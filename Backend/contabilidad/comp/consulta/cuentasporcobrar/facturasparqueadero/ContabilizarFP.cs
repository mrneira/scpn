using core.componente;
using dal.contabilidad;
using dal.contabilidad.cuentasporpagar;
using dal.seguridades;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using util.dto.consulta;

namespace contabilidad.comp.consulta.cuentasporcobrar.facturasparqueadero {

    public class ContabilizarFP : ComponenteConsulta {

        /// <summary>
        /// Metodo que entrega la cabecera y detalle de un comprobante contable.
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta) {
            string ffactura = (string) rqconsulta.Mdatos["ffactura"];
            string tipofactura = (string)rqconsulta.Mdatos["tipofactura"];
            string estado = (string)rqconsulta.Mdatos["estado"];
            string cctacajaparqueadero = rqconsulta.Mdatos.ContainsKey("cctacajaparqueadero") ? (string)rqconsulta.Mdatos["cctacajaparqueadero"]:"" ;
            string identificacion = "";
            if (rqconsulta.Mdatos.ContainsKey("identificacion")) {
                identificacion = (string)rqconsulta.Mdatos["identificacion"];
                rqconsulta.Response["CONTAB_FAC_PARQ"] = TconCargaMasivaFacturasParqueaderoDal.FindFacturasContratoPorIdentificacion(tipofactura, estado, identificacion);
                rqconsulta.Response["suma_total"] = TconCargaMasivaFacturasParqueaderoDal.FindTotalFacturasContratoPorIdentificacion(tipofactura, estado, identificacion);
            } else {
                rqconsulta.Response["CONTAB_FAC_PARQ"] = TconCargaMasivaFacturasParqueaderoDal.FindXFecha(ffactura, tipofactura, estado, cctacajaparqueadero);
                rqconsulta.Response["suma_total"] = TconCargaMasivaFacturasParqueaderoDal.FindTotalesXFecha(ffactura, tipofactura, estado, cctacajaparqueadero);
            }
        }
    }
}
