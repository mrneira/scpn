using core.componente;
using dal.contabilidad;
using dal.contabilidad.cuentasporpagar;
using dal.seguridades;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using util.dto.consulta;

namespace contabilidad.comp.consulta.cuentasporpagar {

    public class DatosAutorizarCxp : ComponenteConsulta {

        /// <summary>
        /// Metodo que entrega la cabecera y detalle de un comprobante contable.
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta) {
            int ccompania = rqconsulta.Ccompania;
            int cpersona;
            int.TryParse(rqconsulta.Mdatos["cpersona"].ToString(), out cpersona);
            decimal valorapagarini, valorapagarfin;
            DateTime fingresoini = DateTime.TryParse(rqconsulta.Mdatos["fingresoini"].ToString(), out fingresoini) == false ? DateTime.Today : fingresoini;
            DateTime fingresofin = DateTime.TryParse(rqconsulta.Mdatos["fingresofin"].ToString(), out fingresofin) == false ? DateTime.Today : fingresofin;
            Decimal.TryParse(rqconsulta.Mdatos["valorapagarini"].ToString(), out valorapagarini);
            Decimal.TryParse(rqconsulta.Mdatos["valorapagarfin"].ToString(), out valorapagarfin);

            IList<Dictionary<string, object>> detalleFacturas = TconCuentaporpagarDal.FindCxPParaAutorizar(cpersona,fingresoini, fingresofin, valorapagarini, valorapagarfin);
            List<tconcuentaporpagar> ldetalle = ProcesarDetalle(detalleFacturas);
            rqconsulta.Response["CXPPARAAUTORIZAR"] = ldetalle;
        }

        /// <summary>
        /// Procesar detalle de comprobante contable
        /// </summary>
        /// <param name="listaQuery"></param>
        /// <returns></returns>
        public List<tconcuentaporpagar>  ProcesarDetalle(IList<Dictionary<string, object>> listaQuery) {
            List<tconcuentaporpagar> ldetalle = new List<tconcuentaporpagar>();
            foreach (Dictionary<string, object> obj in listaQuery) {
                tconcuentaporpagar d = new tconcuentaporpagar();
                foreach (var pair in obj) {
                    d.AddDatos(pair.Key, pair.Value);
                }
                ldetalle.Add(d);
            }
            return ldetalle;
        }

    }
}
