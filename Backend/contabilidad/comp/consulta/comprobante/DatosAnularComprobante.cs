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

    public class DatosAnularComprobante : ComponenteConsulta {

        /// <summary>
        /// Metodo que entrega la cabecera y detalle de un comprobante contable.
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta) {
            string ccomprobante = rqconsulta.Mdatos["ccomprobante"].ToString();
            long fcontableini = long.TryParse(rqconsulta.Mdatos["fcontableini"].ToString(), out fcontableini) == false ? 20170101 : fcontableini;
            long fcontablefin = long.TryParse(rqconsulta.Mdatos["fcontablefin"].ToString(), out fcontablefin) == false ? 20171231 : fcontablefin;


            IList<Dictionary<string, object>> detalleComprobantes = TconComprobanteDal.FindComprobantesParaAnular(ccomprobante,fcontableini,fcontablefin);
            List<tconcomprobante> ldetalle = ProcesarDetalle(detalleComprobantes);
            rqconsulta.Response["COMPROBANTESPARAANULAR"] = ldetalle;
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
