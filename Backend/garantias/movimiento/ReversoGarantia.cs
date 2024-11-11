using core.servicios.mantenimiento;
using dal.garantias;
using dal.monetario;
using modelo;
using modelo.helper.cartera;
using modelo.interfaces;
using monetario.util;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.enums;
using util.movimiento;

namespace garantias.movimiento {

    /// <summary>
    /// Clase que se encarga de ejecutar reversos de garantias, dado un numero de mensaje, operacion.
    /// </summary>
    public class ReversoGarantia : IReverso {

        /// <summary>
        /// Ejecuta reversos de movimientos de garantias.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuata el reverso.</param>
        /// <param name="tmonmovimiento">Movimiento de garantia a reversar.</param>
        public void Ejecutar(RqMantenimiento rqmantenimiento, IBean tmonmovimiento)
        {
            tmonmovimiento obj = (tmonmovimiento)tmonmovimiento;

            if (TmonMovimientoDal.ExisteMovimientosFuturos(obj)) {
                throw new AtlasException("CAR-0006", "EJECUTE EL REVERSO DESDE EN ORDEN INVERSO AL DE LA EJECUCION ORIGINAL");
            }

            IList<tgarmovimiento> lmov = TgarMovimientoDal.Find(obj.mensaje, obj.coperacion, obj.particion);
            ReversoGarantia.Reversar(rqmantenimiento, lmov);
        }

        /// <summary>
        /// Procesa reversos por transaccion. Obtiene los movimientos de una tranzaccion y los reversa, hasta terminar con todas las transacciones.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="lmov"></param>
        public static void Reversar(RqMantenimiento rqmantenimiento, IList<tgarmovimiento> lmov)
        {
            Dictionary<string, List<tgarmovimiento>> mgarantia = new Dictionary<string, List<tgarmovimiento>>();
            String key = "";
            foreach (tgarmovimiento mov in lmov) {
                ReversoGarantia.Validar(mov, rqmantenimiento.Mensajereverso);

                // Arma map por cada transaccion de origen
                key = "" + mov.cmoduloorigen + "^" + mov.ctransaccionorigen;
                List<tgarmovimiento> movs = null;
                if (mgarantia.ContainsKey(key)) {
                    movs = mgarantia[key];
                }

                if (movs == null) {
                    movs = new List<tgarmovimiento>();
                    mgarantia[key] = movs;
                }
                movs.Add(mov);
            }

            // Ejecuta reverso por cada transaccion de origen.
            foreach (string keys in mgarantia.Keys) {
                List<tgarmovimiento> lmovaux = mgarantia[keys];
                ReversoGarantia.ReversaTransaccion(rqmantenimiento, lmovaux);
            }
        }

        /// <summary>
        /// Ejecuta reverso por transaccion origen.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se reversa las transacciones.</param>
        /// <param name="lmovoriginal">Lista de movimientos originales a reversar.</param>
        private static void ReversaTransaccion(RqMantenimiento rqmantenimiento, IList<tgarmovimiento> lmovoriginal)
        {
            // Fija la transaccion de origen para el reverso, en la transaccion de origen esta parametrizado los componentes de negocio.
            rqmantenimiento.Cmodulo = (int)lmovoriginal.ElementAt(0).cmodulo;
            rqmantenimiento.Ctransaccion = (int)lmovoriginal.ElementAt(0).ctransaccion;
            rqmantenimiento.Coperacion = lmovoriginal.ElementAt(0).coperacion;

            List<Movimiento> lmovreverso = new List<Movimiento>();

            foreach (tgarmovimiento mov in lmovoriginal) {
                tgarmovimiento movreverso = (tgarmovimiento)mov.Clone();
                movreverso.cusuarioreverso = rqmantenimiento.Cusuario;
                movreverso.mensaje = rqmantenimiento.Mensaje;
                lmovreverso.Add((Movimiento)movreverso);
                // Marca el movimiento anterior como reversado.
                mov.mensajereverso = rqmantenimiento.Mensaje;
            }
            // Monetario de reverso.
            new ComprobanteMonetario(rqmantenimiento, lmovreverso);

            // Ejecuta componentes de negocio asociados a la transaccionoriginal.
            if (EnumModulos.GARANTIAS.Cmodulo == rqmantenimiento.Cmodulo) {
                Mantenimiento.Procesar(rqmantenimiento, rqmantenimiento.Response);
            }

        }

        /// <summary>
        /// Valida que el movimiento no este reversado previamente.
        /// </summary>
        /// <param name="mov">Movimiento a reversar.</param>
        /// <param name="mensajereverso">Numero de mensaje de reverso.</param>
        private static void Validar(tgarmovimiento mov, string mensajereverso)
        {
            if (mov.mensajereverso != null) {
                throw new AtlasException("CAR-0005", "MOVIMIENTOS ASOCIADOS AL MENSAJE: {0} YA  REVERSADOS", mensajereverso);
            }
        }

    }
}
