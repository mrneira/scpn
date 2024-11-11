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
    class ResumenRecaudacion : ComponenteConsulta {

        public override void Ejecutar(RqConsulta rqconsulta)
        {
            List<Dictionary<string, object>> lresp = new List<Dictionary<string, object>>();
            Response resp = rqconsulta.Response;

            int fcontable = int.Parse(rqconsulta.GetDatos("fcontable").ToString());
            List<List<ttesrecaudaciondetalle>> detalle = new List<List<ttesrecaudaciondetalle>>();
            if (rqconsulta.GetDatos("cabecera") == null)
            {
                return;
            }
            dynamic arrayTransaccion = JsonConvert.DeserializeObject(rqconsulta.Mdatos["cabecera"].ToString());

            foreach (var obj in arrayTransaccion)
            {
                string crecaudacion = obj.crecaudacion;
                string cestado = obj.cestado;
                detalle.Add(TtesRecaudacionDetalleDal.FindByCodigoCabecera(long.Parse(crecaudacion), cestado));
                foreach (ttesrecaudaciondetalle recauda in TtesRecaudacionDetalleDal.FindByCodigoCabecera(long.Parse(crecaudacion), cestado))
                {
                    Dictionary<string, object> mresponse = DetalleMap(recauda);
                    lresp.Add(mresponse);
                }
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
