using core.componente;
using dal.contabilidad;
using dal.contabilidad.cuentasporpagar;
using dal.seguridades;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using util.dto.consulta;

namespace contabilidad.comp.consulta.comprobante {

    public class DatosMayorizarComprobante : ComponenteConsulta {

        /// <summary>
        /// Metodo que entrega la cabecera y detalle de un comprobante contable.
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta) {
            long fechaHoy = long.Parse(DateTime.Now.Year.ToString() + String.Format("{0:00}", DateTime.Now.Month) + String.Format("{0:00}", DateTime.Now.Day));
            string tipodocumentocdetalle = rqconsulta.Mdatos["tipodocumentocdetalle"].ToString();
            long fcontableini = fechaHoy;
            long fcontablefin = fechaHoy;
            if (rqconsulta.Mdatos.ContainsKey("fcontableini")) {
                fcontableini = long.Parse( rqconsulta.Mdatos["fcontableini"].ToString().Substring(0, 4) + rqconsulta.Mdatos["fcontableini"].ToString().Substring(5, 2) +
                                rqconsulta.Mdatos["fcontableini"].ToString().Substring(8, 2));
            }
            if (rqconsulta.Mdatos.ContainsKey("fcontablefin")) {
                fcontablefin = long.Parse(rqconsulta.Mdatos["fcontablefin"].ToString().Substring(0, 4) + rqconsulta.Mdatos["fcontablefin"].ToString().Substring(5, 2) +
                                rqconsulta.Mdatos["fcontablefin"].ToString().Substring(8, 2));
            }

            IList<Dictionary<string, object>> detalleComprobantes = TconComprobanteDal.FindComprobantesParaMayorizar(tipodocumentocdetalle,fcontableini,fcontablefin);
            List<tconcomprobante> ldetalle = ProcesarDetalle(detalleComprobantes);
            rqconsulta.Response["COMPROBANTESPARAMAYORIZAR"] = ldetalle;
        }

        /// <summary>
        /// Procesar detalle de comprobante contable
        /// </summary>
        /// <param name="listaQuery"></param>
        /// <returns></returns>
        public List<tconcomprobante>  ProcesarDetalle(IList<Dictionary<string, object>> listaQuery) {
            List<tconcomprobante> ldetalle = new List<tconcomprobante>();
            foreach (Dictionary<string, object> obj in listaQuery) {
                tconcomprobante d = new tconcomprobante();
                foreach (var pair in obj) {
                    d.AddDatos(pair.Key, pair.Value);
                }
                ldetalle.Add(d);
            }
            return ldetalle;
        }

    }
}
