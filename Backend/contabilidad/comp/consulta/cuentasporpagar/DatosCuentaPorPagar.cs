using core.componente;
using dal.contabilidad;
using dal.seguridades;
using modelo;
using modelo.interfaces;
using System.Collections.Generic;
using util.dto.consulta;

namespace contabilidad.comp.consulta.cuentasporpagar {

    public class DatosCuentaPorPagar : ComponenteConsulta {

        /// <summary>
        /// Metodo que entrega la cabecera y detalle de un comprobante contable.
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta) {
            int ccompania = rqconsulta.Ccompania;
            string ccomprobante = (string)rqconsulta.Mdatos["codigocomprobante"];
            int fcontable = int.Parse(rqconsulta.Mdatos["fcontable"].ToString());

            tconcomprobante comprobante = TconComprobanteDal.FindComprobante(ccomprobante, fcontable, ccompania);
            IList<Dictionary<string, object>> detalleFA = TconComprobanteDetalleDal.FindComprobanteDetallePorTipoplan(ccomprobante, fcontable, ccompania, "PC-FA");
            List<tconcomprobantedetalle> ldetalleFA = ProcesarDetalle(detalleFA);

            IList<Dictionary<string, object>> detalleAF = TconComprobanteDetalleDal.FindComprobanteDetallePorTipoplan(ccomprobante, fcontable, ccompania, "PC-ADF");
            List<tconcomprobantedetalle> ldetalleAF = ProcesarDetalle(detalleAF);

            rqconsulta.Response["COMPCONTA"] = comprobante;
            rqconsulta.Response["CONCEPTO"] = comprobante.tconconcepto;
            
            rqconsulta.Response["DETALLECOMPROBANTECONTABLEFA"] = ldetalleFA;
            rqconsulta.Response["DETALLECOMPROBANTECONTABLEAF"] = ldetalleAF;

        }

        /// <summary>
        /// Procesar detalle de comprobante contable
        /// </summary>
        /// <param name="listaQuery"></param>
        /// <returns></returns>
        public List<tconcomprobantedetalle>  ProcesarDetalle(IList<Dictionary<string, object>> listaQuery) {
            List<tconcomprobantedetalle> ldetalle = new List<tconcomprobantedetalle>();
            foreach (Dictionary<string, object> obj in listaQuery) {
                tconcomprobantedetalle d = new tconcomprobantedetalle();
                foreach (var pair in obj) {
                    d.AddDatos(pair.Key, pair.Value);
                }
                ldetalle.Add(d);

            }
            return ldetalle;
        }

    }
}
