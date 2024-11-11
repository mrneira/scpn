using core.componente;
using dal.cartera;
using dal.generales;
using dal.monetario;
using modelo;
using System;
using System.Collections.Generic;
using util;
using util.dto.consulta;

namespace cartera.comp.consulta.movimiento
{

    /// <summary>
    /// Clase que se encarga de consultar en la base y entregar movimientos contables asociados a un numero de mensaje.
    /// La movimientos se entrega entrega en una List<Map<String, Object>>
    /// </summary>
    public class MovimientoCancelacion : ComponenteConsulta
    {

        /// <summary>
        /// Consulta movimientos contables de cartera.
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            String coperacion = rqconsulta.Coperacion;
            String mensaje = (String)rqconsulta.Mdatos["mensajeaconsultar"];

            // Consulta cuotas con sus rubros.
            IList<tcaroperaciontransaccionrubro> lmovi = TcarOperacionTransaccionRubroDal.FindCancelacion(coperacion, mensaje);

            // Lista de respuesta con la tabla de pagos
            List<Dictionary<string, object>> lresp = new List<Dictionary<string, object>>();
            if (rqconsulta.Response.ContainsKey("MOVIMIENTOS") && rqconsulta.Response["MOVIMIENTOS"] != null)
            {
                lresp = (List<Dictionary<string, object>>)rqconsulta.Response["MOVIMIENTOS"];
            }

            foreach (tcaroperaciontransaccionrubro mov in lmovi)
            {
                Dictionary<string, object> mresponse = MovimientoCancelacion.MovimientoToMap(mov);
                lresp.Add(mresponse);
            }
            // Fija la respuesta en el response. La respuesta contiene los movimientos.
            rqconsulta.Response["MOVIMIENTOS"] = lresp;
        }

        /// <summary>
        /// Crea un map con los datos de un movimiento de cartera.
        /// </summary>
        public static Dictionary<string, object> MovimientoToMap(tcaroperaciontransaccionrubro movimiento)
        {
            Dictionary<string, object> m = new Dictionary<string, object>();
            m["coperacion"] = movimiento.coperacion;
            m["tran"] = movimiento.ctransaccion;
            m["ntran"] = TgentransaccionDal.Find(7, (int)movimiento.ctransaccion).nombre;
            m["nsaldo"] = TmonSaldoDal.Find(movimiento.csaldo).nombre;
            m["fcontable"] = movimiento.fcontable;
            m["monto"] = movimiento.monto;
            return m;
        }


    }
}
