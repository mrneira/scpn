using core.componente;
using dal.cartera;
using dal.contabilidad;
using dal.generales;
using dal.monetario;
using modelo;
using System;
using System.Collections.Generic;
using util;
using util.dto.consulta;

namespace cartera.comp.consulta.movimiento {

    /// <summary>
    /// Clase que se encarga de consultar en la base y entregar movimientos contables asociados a un numero de mensaje.
    /// La movimientos se entrega entrega en una List<Map<String, Object>>
    /// </summary>
    public class MovimientoRecuperacion : ComponenteConsulta {

        /// <summary>
        /// Consulta movimientos contables de cartera.
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            String coperacion = rqconsulta.Coperacion;
            String mensaje = (String)rqconsulta.Mdatos["mensajeaconsultar"];
            int? fmovimiento = rqconsulta.GetDatos("fmovimiento") == null ? null : rqconsulta.GetInt("fmovimiento");
            if (fmovimiento == null) {
                fmovimiento = rqconsulta.Fconatable;
            }
            int particion = Constantes.GetParticion(fmovimiento ?? 0);

            // Consulta cuotas con sus rubros.
            IList<tcarmovimiento> lmovi = TcarMovimientoDal.FindMovimientos(mensaje, coperacion, particion);

            // Lista de respuesta con la tabla de pagos
            List<Dictionary<string, object>> lresp = new List<Dictionary<string, object>>();
            foreach (tcarmovimiento mov in lmovi) {
                //if (mov.debito != null && mov.debito == true) {
                //    continue;
                //}
                Dictionary<string, object> mresponse = MovimientoRecuperacion.MovimientoToMap(mov);
                lresp.Add(mresponse);
            }

            // Fija la respuesta en el response. La respuesta contiene los movimientos.
            rqconsulta.Response["MOVIMIENTOS"] = lresp;
        }

        /// <summary>
        /// Crea un map con los datos de un movimiento de cartera.
        /// </summary>
        public static Dictionary<string, object> MovimientoToMap(tcarmovimiento movimiento)
        {
            Dictionary<string, object> m = new Dictionary<string, object>();
            m["numcuota"] = movimiento.numcuota == Constantes.CERO ? null : movimiento.numcuota;
            m["mod"] = movimiento.cmodulotransaccion;
            m["nmod"] = TgenModuloDal.Find((int)movimiento.cmodulotransaccion).nombre;
            m["tran"] = movimiento.ctransaccion;
            m["ntran"] = TgentransaccionDal.Find(movimiento.cmodulotransaccion ?? 0, movimiento.ctransaccion ?? 0).nombre;
            m["rubro"] = movimiento.crubro;
            if (movimiento.debito != null && movimiento.debito == true) {
                m["debito"] = movimiento.monto;
            } else {
                m["credito"] = movimiento.monto;
            }
            m["csaldo"] = movimiento.csaldo;
            m["nsaldo"] = TmonSaldoDal.Find(movimiento.csaldo).nombre;
            m["cuenta"] = movimiento.ccuenta;
            m["ncuenta"] = TconCatalogoDal.Find((int)movimiento.ccompania, movimiento.ccuenta).nombre;

            return m;
        }


    }
}
