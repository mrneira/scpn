using core.componente;
using dal.cartera;
using dal.generales;
using dal.prestaciones;
using modelo;
using prestaciones.comp.consulta.bonificacion;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.consulta;
using prestaciones.comp.consulta.expediente;
using System.Data;
using dal.socio;
using dal.persona;

namespace prestaciones.comp.consulta.expediente {
    class Simulacion : ComponenteConsulta {

        DatosGenerales datosGenerales = new DatosGenerales();
        Bonificacion Bonificacion = new Bonificacion();
        decimal daportes = 0, tprestamos = 0, totalingresos = 0, tretenciones = 0,
                tnovedades, totalegresos = 0, total = 0, porcentaje = 0, aportes = 0, interes = 0,
                valorbonificacion = 0, vcuantiabasica = 0;
        bool devolucion, cesantia = false, soc0506 = false;
        int totalaportes = 0;
        string simulacion = "S";
        DataSet ds = new DataSet();
        DataTable dt = new DataTable();
        /// <summary>
        /// Clase que realiza la simulacion del expediente de un socio
        /// </summary>
        /// <param name="rqconsulta"></param>
        /// 
        public override void Ejecutar(RqConsulta rqconsulta) {
            IList<Dictionary<string, object>> lresp = new List<Dictionary<string, object>>();
            Dictionary<String, Object> m = new Dictionary<String, Object>();
            IList<Dictionary<string, object>> taportes = new List<Dictionary<string, object>>();
            IList<tpreactosservicio> listactoservicio = new List<tpreactosservicio>();
            long cpersona = long.Parse(rqconsulta.Mdatos["cpersona"].ToString());
            int ccompania = rqconsulta.Ccompania;
            string cdetalletipoexp = rqconsulta.Mdatos["cdetalletipoexp"].ToString();
            string cdetallejerarquia = null;
            if (rqconsulta.Mdatos.ContainsKey("cdetallejerarquia")) {
                cdetallejerarquia = rqconsulta.Mdatos["cdetallejerarquia"].ToString();
            }
            DateTime fechaalta = Convert.ToDateTime((rqconsulta.Mdatos["fechaalta"]));
            DateTime fechabaja = Convert.ToDateTime((rqconsulta.Mdatos["fechabaja"]));
            int coeficiente = int.Parse((rqconsulta.Mdatos["coeficiente"]).ToString());
            int ctipobaja = 0;
            if (rqconsulta.Mdatos.ContainsKey("ctipobaja")) {
                ctipobaja = int.Parse((rqconsulta.Mdatos["ctipobaja"]).ToString());
            }
            porcentaje = TpreParametrosDal.GetValorNumerico("POR-APORTES-ANTICIPO-CENSANTIA-NOMINIMO");
            this.CrearSocio0506();
            if (cdetalletipoexp.Equals("CEF")) {
                if (ctipobaja == 0 && ctipobaja != 3) {
                    ctipobaja = 3;
                }

            }
            listactoservicio = TpreActosServicioDal.Find(ctipobaja);
            string selectedValues = string.Empty;
            if (rqconsulta.Mdatos.ContainsKey("selectedValues")) {
                selectedValues = rqconsulta.Mdatos["selectedValues"].ToString();
            }
            // Consultar el historico de carrera por estado del socio ---- 3 cod BAJA
            tsoccesantiahistorico hisbaja = TsocCesantiaHistoricoDal.FindFordenToEstadoSocio(cpersona, (int)rqconsulta.Ccompania, 3);
            tsoccesantiahistorico hisactual = TsocCesantiaHistoricoDal.Find(cpersona, (int)rqconsulta.Ccompania);

            if (hisbaja != null) {
                porcentaje = TsocTipoBajaDal.FindToAnticipo((long)hisbaja.csubestado) != null ? (decimal)TsocTipoBajaDal.FindToAnticipo((long)hisbaja.csubestado).porcentajeanticipocesantia : TpreParametrosDal.GetValorNumerico("POR-APORTES-ANTICIPO-CENSANTIA-NOMINIMO");
                if (hisactual.secuencia != hisbaja.secuencia) {
                    simulacion = "S";
                } else {
                    simulacion = "N";
                }


            }
            taportes = TpreAportesDal.GetTotalAportes(cpersona, simulacion);
            foreach (DataRow row in ds.Tables[0].Rows) {
                if (cpersona == int.Parse(row["cpersona"].ToString())) {
                    totalingresos = decimal.Parse(row["vcesantia"].ToString());
                    valorbonificacion = decimal.Parse(row["vbonificacion"].ToString());
                    vcuantiabasica = decimal.Parse(row["vcuantiabasica"].ToString());
                    soc0506 = true;
                }
            }
            if (!soc0506) {
                if (listactoservicio.Count == 0) {
                    totalingresos = datosGenerales.Valoringresos(cpersona, cdetalletipoexp, cdetallejerarquia, fechabaja, coeficiente, taportes, listactoservicio.Count > 0 ? true : false);
                }

            }
            aportes = datosGenerales.Aportes(cdetalletipoexp, taportes);
            interes = datosGenerales.Interes(cdetalletipoexp, taportes);
            totalegresos = datosGenerales.Valoregresos(cpersona, ccompania, cdetalletipoexp, selectedValues, totalingresos, taportes, rqconsulta);
            if (cdetalletipoexp.Equals("DEV") || cdetalletipoexp.Equals("DEH")) {
                devolucion = datosGenerales.Devolucion(cpersona);
                porcentaje = 0;
            }
            tprestamos = datosGenerales.ValorDeudaPrestamos(cpersona, rqconsulta);
            tretenciones = datosGenerales.ValorDeudaRetenciones(cpersona, ccompania, totalingresos);
            tnovedades = datosGenerales.ValorDeudaNovedades(cpersona, ccompania);
            daportes = (decimal)datosGenerales.ValorDeudaAportes(cdetalletipoexp, taportes);
            cesantia = devolucion == false ? true : false;
            total = totalingresos - totalegresos;
            if (cdetalletipoexp.Equals("ANT") && !devolucion) {
                total = (total * porcentaje) / 100;
            }

            object[] valores = new object[] { 0, 0, 0, 0, 0 };
            if (!devolucion) {
                //  valores = Bonificacion.Ejecutar(cpersona, cdetallejerarquia, taportes, fechabaja, coeficiente);
                if (!cdetalletipoexp.Equals("ANT")) {
                    porcentaje = 0;
                }
                if (soc0506) {
                    valores[3] = valorbonificacion;
                    valores[1] = vcuantiabasica;
                } else {
                    valores = Bonificacion.Ejecutar(cpersona, cdetallejerarquia, taportes, fechabaja, coeficiente, listactoservicio.Count > 0 ? true : false);
                    if (listactoservicio.Count > 0) {
                        total = 0;
                        totalaportes = datosGenerales.TotalAportes(taportes);
                        int contador = 0;
                        foreach (tpreactosservicio actoservicio in listactoservicio) {
                            contador++;
                            if (actoservicio.aportemin <= totalaportes && totalaportes <= actoservicio.aportemax) {
                                totalingresos = (decimal)valores[1];
                                valores[3] = 0;
                                total = totalingresos;
                                totalingresos = total = total * actoservicio.porcentaje / 100;
                                total = total - totalegresos;
                                porcentaje = actoservicio.porcentaje;
                                contador = 0;//CCA cambios 20210308
                            }else{ //cca cambios expediente
                                if (contador >= 4){
                                    totalingresos = datosGenerales.Valoringresos(cpersona, cdetalletipoexp, cdetallejerarquia, fechabaja, coeficiente, taportes, 0 > 0 ? true : false);
                                    total = totalingresos - totalegresos;
                                }

                            }
                        }
                        cesantia = true;
                        cesantia = devolucion == false ? true : false;
                    }
                }
            }
            totalingresos = Math.Round(totalingresos, 2, MidpointRounding.AwayFromZero);
            porcentaje = decimal.Round(porcentaje, 2);
            m["totalingresos"] = totalingresos;
            m["totalegresos"] = totalegresos;
            m["tprestamos"] = tprestamos;
            m["tretenciones"] = tretenciones;
            m["tnovedades"] = tnovedades;
            m["daportes"] = daportes;
            m["devolucion"] = devolucion;
            m["cesantia"] = cesantia;
            m["total"] = total;
            m["TAPORTE"] = aportes;
            m["interes"] = interes;
            m["Valores"] = valores;
            //m["porcentaje"] = porcentaje != 0 ?  porcentaje.ToString() : string.Empty; ;
            m["porcentaje"] = cdetalletipoexp.Equals("ANT") || cdetalletipoexp.Equals("CEF") ? "(" + porcentaje + ")" + "%" : string.Empty;
            // Fija la respuesta en el response.
            lresp.Add(m);
            rqconsulta.Response["SIMULACION"] = lresp;
            rqconsulta.Response["p_total"] = totalingresos - totalegresos;
            rqconsulta.Response["BONIFICACION"] = valores;

        }

        private void CrearSocio0506() {
            ds.Tables.Add(dt);
            dt.Columns.Add("cpersona", typeof(int));
            dt.Columns.Add("vcuantiabasica", typeof(decimal));
            dt.Columns.Add("vbonificacion", typeof(decimal));
            dt.Columns.Add("vcesantia", typeof(decimal));
            tperpersonadetalle per1 = TperPersonaDetalleDal.FindByIdentification("1101157426");
            tperpersonadetalle per2 = TperPersonaDetalleDal.FindByIdentification("0600058861");
            tperpersonadetalle per3 = TperPersonaDetalleDal.FindByIdentification("0501401160");
            tperpersonadetalle per4 = TperPersonaDetalleDal.FindByIdentification("1201457221");
            tperpersonadetalle per5 = TperPersonaDetalleDal.FindByIdentification("0904044823");
            tperpersonadetalle per6 = TperPersonaDetalleDal.FindByIdentification("0200344679");
            dt.Rows.Add(per1.cpersona, 24215.8, 45603.44, 69819.24);
            dt.Rows.Add(per2.cpersona, 24796.98, 49557.54, 74354.52);
            dt.Rows.Add(per3.cpersona, 24796.98, 11066.24, 35863.22);
            dt.Rows.Add(per4.cpersona, 24796.98, 8902.36, 33699.34);
            dt.Rows.Add(per5.cpersona, 24796.98, 40247.72, 65044.70);
            dt.Rows.Add(per6.cpersona, 44669.98, 19959.04, 64629.02);
        }
    }
}
