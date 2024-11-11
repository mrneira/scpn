using core.componente;
using dal.contabilidad;
using dal.contabilidad.cuentasporpagar;
using dal.seguridades;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using util.dto.consulta;

namespace contabilidad.comp.consulta.reportes {

    public class SaldosContablesFecha : ComponenteConsulta {

        /// <summary>
        /// Metodo que entrega la cabecera y detalle de un comprobante contable.
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta) {


            int nivel = int.TryParse(rqconsulta.Mdatos["nivel"].ToString(), out nivel) ? nivel : 20;
            string ccuenta = rqconsulta.Mdatos["ccuenta"].ToString();
            int ccompania = int.TryParse(rqconsulta.Mdatos["ccompania"].ToString(), out ccompania) ? ccompania : 1;
            int csucursal = int.TryParse(rqconsulta.Mdatos["csucursal"].ToString(), out csucursal) ? csucursal : 1;
            int cagencia = int.TryParse(rqconsulta.Mdatos["cagencia"].ToString(), out cagencia) ? cagencia : 1;


            rqconsulta.Response["SALDOSCONTABLESFECHAREPORTE"] = TconSaldosDal.FindSaldosAlaFecha(nivel, ccuenta, ccompania, csucursal, cagencia);
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
