using tesoreria.enums;
using core.componente;
using modelo;
using System.Collections.Generic;
using util.dto;
using util.dto.consulta;
using dal.tesoreria;
using Newtonsoft.Json;

namespace tesoreria.comp.consulta.cashmanagement
{
    /// <summary>
    /// Clase que se encarga de consultar el detalle de la transaccion por operacion
    /// </summary>
    class ResumenRecaudacionCabecera : ComponenteConsulta {

        public override void Ejecutar(RqConsulta rqconsulta)
        {
            List<Dictionary<string, object>> lresp = new List<Dictionary<string, object>>();
            Response resp = rqconsulta.Response;
            int fcontable = int.Parse(rqconsulta.GetDatos("fcontable").ToString());
            long crecaudacion = long.Parse(rqconsulta.GetDatos("crecaudacion").ToString());
            string cestado = rqconsulta.GetDatos("cestado").ToString();
            List<ttesrecaudaciondetalle> detalle = new List<ttesrecaudaciondetalle>();
            detalle = TtesRecaudacionDetalleDal.FindByCodigoCabecera(crecaudacion, cestado);
            foreach (ttesrecaudaciondetalle det in detalle)
            {
                Dictionary<string, object> mresponse = DetalleMap(det);
                lresp.Add(mresponse);
            }
            
            rqconsulta.Response.Add("detalle", "OK");
            rqconsulta.Response.Add("resumenrecaudacion", lresp);
        }

        /// <summary>
        /// Crea un map con los datos de un movimiento de desembolso de cartera.
        /// </summary>

        public static Dictionary<string, object> DetalleMap(ttesrecaudaciondetalle detalle)
        {
            Dictionary<string, object> m = new Dictionary<string, object>();
            m["fcontable"] = detalle.fcontable;
            m["fgeneracion"] = detalle.fgeneracion;
            m["cusuarioing"] = detalle.cusuarioing;
            m["referencia"] = detalle.referencia;
            m["identificacioncliente"] = detalle.identificacioncliente;
            m["nombrecliente"] = detalle.nombrecliente;
            m["valor"] = detalle.valorprocesado;
            return m;
        }
    }
}
