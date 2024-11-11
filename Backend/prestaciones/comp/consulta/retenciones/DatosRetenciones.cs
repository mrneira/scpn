using core.componente;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.consulta;
using modelo;
using dal.socio;
using dal.generales;
using dal.prestaciones;
using prestaciones.comp.consulta.expediente;
using System.Data;

namespace prestaciones.comp.consulta.retenciones {
    class DatosRetenciones : ComponenteConsulta {
        /// <summary>
        /// Clase que entrega los datos de retenciones del socio
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta) {
            decimal totalingresos = 0;
            DatosGenerales datosGenerales = new DatosGenerales();
            tsoctipogrado tsoctipogrado = new tsoctipogrado();
            long cpersona = (long)rqconsulta.Mdatos["cpersona"];
            bool bandeja = (bool)rqconsulta.Mdatos["bandeja"];
            int ccompania = rqconsulta.Ccompania;
            string cdetalletipoexp, cdetallejerarquia, simulacion = "S";
            DateTime fechaalta, fechabaja;
            int coeficiente;

            IList<tpreactosservicio> listactoservicio = new List<tpreactosservicio>();

            IList<Dictionary<string, object>> taportes = new List<Dictionary<string, object>>();
            // Consultar el historico de carrera por estado del socio ---- 1 cod ALTA
            tsoccesantiahistorico hisalta = TsocCesantiaHistoricoDal.FindFordenToEstadoSocio(cpersona, (int)rqconsulta.Ccompania, 1);
            // Consultar el historico de carrera por estado del socio ---- 3 cod BAJA
            tsoccesantiahistorico hisbaja = TsocCesantiaHistoricoDal.FindFordenToEstadoSocio(cpersona, (int)rqconsulta.Ccompania, 3);

            // Consultar el historico actual del socio
            tsoccesantiahistorico hisact = TsocCesantiaHistoricoDal.Find(cpersona, (int)rqconsulta.Ccompania);

            long csubestado = hisbaja == null ? -1 : (int)hisbaja.csubestado;
            tsoctipobaja tsoctipobaja = TsocTipoBajaDal.Find((long)csubestado);
            if (tsoctipobaja != null) {
                listactoservicio = TpreActosServicioDal.Find(tsoctipobaja.ctipobaja);
            } else {
                listactoservicio = TpreActosServicioDal.Find(0);
            }

            if (hisbaja == null) {
                tsoctipogrado = TsocTipoGradoDal.Find((long)hisact.cgradoactual);
                simulacion = "S";

            } else {
                tsoctipogrado = TsocTipoGradoDal.Find((long)hisbaja.cgradoactual);
                simulacion = "N";
            }

            tpreexpediente objexp;

            if (bandeja) {

                if (rqconsulta.Mdatos.ContainsKey("pagoretencion")) {
                    objexp = TpreExpedienteDal.FindToUltimaEtapa(cpersona, ccompania);
                } else {
                    int secuencia = int.Parse(rqconsulta.Mdatos["secuencia"].ToString());
                    objexp = TpreExpedienteDal.FindToExpediente(secuencia);
                }

                cdetalletipoexp = objexp.cdetalletipoexp;
                cdetallejerarquia = tsoctipogrado.cdetallejerarquia;
                fechaalta = Convert.ToDateTime(objexp.fentradapolicia);
                fechabaja = Convert.ToDateTime(objexp.fsalidapolicia);
                coeficiente = (int)tsoctipogrado.coeficiente;
            } else {
                cdetalletipoexp = rqconsulta.Mdatos["cdetalletipoexp"].ToString();
                cdetallejerarquia = rqconsulta.Mdatos["cdetallejerarquia"].ToString();
                fechaalta = Convert.ToDateTime((rqconsulta.Mdatos["fechaalta"]));
                fechabaja = Convert.ToDateTime((rqconsulta.Mdatos["fechabaja"]));
                coeficiente = int.Parse((rqconsulta.Mdatos["coeficiente"]).ToString());
            }

            IList<tsocnovedadades> lresp = new List<tsocnovedadades>();


            if (rqconsulta.Mdatos.ContainsKey("pagoretencion")) {
                lresp = TsocNovedadesDal.FindToRetencionesNoPagadas(cpersona, rqconsulta.Ccompania);
            } else {
                //int secuencia = int.Parse(rqconsulta.Mdatos["secuencia"].ToString());
                lresp = TsocNovedadesDal.FindToRetenciones(cpersona, rqconsulta.Ccompania);
            }

            taportes = TpreAportesDal.GetTotalAportes(cpersona, simulacion);

            if (lresp.Count > 0) {
                totalingresos = datosGenerales.Valoringresos(cpersona, cdetalletipoexp, cdetallejerarquia, fechabaja, coeficiente, taportes, listactoservicio.Count > 0 ? true : false);
                foreach (tsocnovedadades obj in lresp) {
                    tgencatalogodetalle catalogodetalle = TgenCatalogoDetalleDal.Find((int)obj.ccatalogonovedad, obj.cdetallenovedad);
                    obj.AddDatos("ntiponovedad", catalogodetalle.nombre);
                }
            }


            // Fija la respuesta en el response.
            rqconsulta.Response["RETENCIONES"] = lresp;
            rqconsulta.Response["totalingresos"] = totalingresos;
        }


    }
}
