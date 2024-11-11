using dal.monetario;
using modelo.interfaces;
using monetario.util;
using System;
using System.Collections.Generic;
using System.Linq;
using util.dto.mantenimiento;
using util.movimiento;
using modelo;
using util;
using dal.cartera;
using modelo.helper.cartera;
using util.enums;
using core.servicios.mantenimiento;

namespace cartera.movimiento {

    /// <summary>
    /// Clase que se encarga de ejecutar reversos de cartera, dado un numero de mensaje, operacion.
    /// </summary>
    public class ReversoCartera : IReverso {

        /// <summary>
        /// Ejecuta reversos de movimientos de cartera.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuata el reverso.</param>
        /// <param name="tmonmovimiento">Movimiento de cartera a reversar.</param>
        public void Ejecutar(RqMantenimiento rqmantenimiento, IBean tmonmovimiento) {
            tmonmovimiento obj = (tmonmovimiento)tmonmovimiento;

            if (TmonMovimientoDal.ExisteMovimientosFuturos(obj)) {
                throw new AtlasException("CAR-0006", "EJECUTE EL REVERSO DESDE EN ORDEN INVERSO AL DE LA EJECUCION ORIGINAL");
            }

            IList<tcarmovimiento> lmov = TcarMovimientoDal.Find(obj.mensaje, obj.coperacion, obj.particion);
            ReversoCartera.Reversar(rqmantenimiento, lmov);
        }

        /// <summary>
        /// Procesa reversos por transaccion. Obtiene los movimientos de una tranzaccion y los reversa, hasta terminar con todas las transacciones.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="lmov"></param>
        public static void Reversar(RqMantenimiento rqmantenimiento, IList<tcarmovimiento> lmov) {
            Dictionary<string, List<tcarmovimiento>> mcartera = new Dictionary<string, List<tcarmovimiento>>();
            String key = "";
            foreach (tcarmovimiento mov in lmov) {
                ReversoCartera.Validar(mov, rqmantenimiento.Mensajereverso);

                // Arma map por cada transaccion de origen
                key = "" + mov.cmoduloorigen + "^" + mov.ctransaccionorigen;
                List<tcarmovimiento> movs = null;
                if (mcartera.ContainsKey(key)) {
                    movs = mcartera[key];
                }
                
                if (movs == null) {
                    movs = new List<tcarmovimiento>();
                    mcartera[key] = movs;
                }
                movs.Add(mov);
            }

            // Ejecuta reverso por cada transaccion de origen.
            foreach (string keys in mcartera.Keys  ) {
                List<tcarmovimiento> lmovaux = mcartera[keys];
                ReversoCartera.ReversaTransaccion(rqmantenimiento, lmovaux);
            }
        }

        /// <summary>
        /// Ejecuta reverso por transaccion origen.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se reversa las transacciones.</param>
        /// <param name="lmovoriginal">Lista de movimientos originales a reversar.</param>
        private static void ReversaTransaccion(RqMantenimiento rqmantenimiento, IList<tcarmovimiento> lmovoriginal) {
            // Fija la transaccion de origen para el reverso, en la transaccion de origen esta parametrizado los componentes de negocio.
            rqmantenimiento.Cmodulo = (int)lmovoriginal.ElementAt(0).cmoduloorigen;
            rqmantenimiento.Ctransaccion = (int)lmovoriginal.ElementAt(0).ctransaccionorigen;
            rqmantenimiento.Coperacion = lmovoriginal.ElementAt(0).coperacion;

            List<Movimiento> lmovreverso = new List<Movimiento>();

            foreach (tcarmovimiento mov in lmovoriginal) {
                tcarmovimiento movreverso = (tcarmovimiento)mov.Clone();
                movreverso.cusuarioreverso = rqmantenimiento.Cusuario;
                movreverso.mensaje = rqmantenimiento.Mensaje;
                lmovreverso.Add((Movimiento)movreverso);
                // Marca el movimiento anterior como reversado.
                mov.mensajereverso = rqmantenimiento.Mensaje;
            }
            // Monetario de reverso.
            new ComprobanteMonetario(rqmantenimiento, lmovreverso);

            // Ejecuta componentes de negocio asociados a la transaccionoriginal.
            if (EnumModulos.CARTERA.Cmodulo == rqmantenimiento.Cmodulo) {
                Mantenimiento.Procesar(rqmantenimiento, rqmantenimiento.Response);
            }

        }

        /// <summary>
        /// Valida que el movimiento no este reversado previamente.
        /// </summary>
        /// <param name="mov">Movimiento a reversar.</param>
        /// <param name="mensajereverso">Numero de mensaje de reverso.</param>
        private static void Validar(tcarmovimiento mov, string mensajereverso) {
            if (mov.mensajereverso != null) {
                throw new AtlasException("CAR-0005", "MOVIMIENTOS ASOCIADOS AL MENSAJE: {0} YA  REVERSADOS", mensajereverso);
            }
        }

    }
}
