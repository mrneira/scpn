using core.componente;
using dal.contabilidad;
using dal.contabilidad.cuentasporpagar;
using dal.seguridades;
using modelo;
using modelo.interfaces;
using System.Collections.Generic;
using util.dto.consulta;

namespace contabilidad.comp.consulta.cuentasporpagar {

    public class DatosRetencionAir : ComponenteConsulta {

        /// <summary>
        /// Metodo que entrega la cabecera y detalle de un comprobante contable.
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta) {
            IList<Dictionary<string, object>> lRetencionesFuente = TconRetencionAirDal.ListarRetencionAir();
            List<tconretencionair> lresp = this.ProcesarDetalle(lRetencionesFuente);
            rqconsulta.Response["LRETENCIONAIR"] = lresp;
        }

        /// <summary>
        /// Procesar detalle de comprobante contable
        /// </summary>
        /// <param name="listaQuery"></param>
        /// <returns></returns>
        public List<tconretencionair>  ProcesarDetalle(IList<Dictionary<string, object>> listaQuery) {
            List<tconretencionair> ldetalle = new List<tconretencionair>();
            foreach (Dictionary<string, object> obj in listaQuery) {
                tconretencionair d = new tconretencionair();
                foreach (var pair in obj) {
                    d.AddDatos(pair.Key, pair.Value);
                }
                ldetalle.Add(d);
            }
            return ldetalle;
        }

    }
}
