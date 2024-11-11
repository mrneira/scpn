using core.componente;
using dal.prestaciones;
using dal.socio;
using dal.persona;
using modelo;
using prestaciones.comp.consulta.bonificacion;
using prestaciones.comp.consulta.expediente;
using prestaciones.comp.mantenimiento.expediente;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace prestaciones.comp.mantenimiento.expediente {
    class CalcularLiquidacion : ComponenteMantenimiento {
        DatosGenerales datosGenerales = new DatosGenerales();
        Bonificacion Bonificacion = new Bonificacion();
        decimal daportes = 0, tprestamos = 0, totalingresos = 0, tretenciones = 0, tnovedades, totalegresos = 0, total = 0, porcentaje = 0, porcentajef = 0, aportes = 0, interes = 0,
                valorbonificacion = 0, vcuantiabasica = 0;
        bool devolucion, cesantia = false, soc0506 = false;
        int totalaportes = 0;
        string simulacion = "S", nporcentaje = string.Empty;
        DataSet ds = new DataSet();
        DataTable dt = new DataTable();
        /// <summary>
        /// Clase que calcula la liquidacion del socio
        /// </summary>
        /// <param name="rm"></param>
        public override void Ejecutar(RqMantenimiento rm) {
            if (rm.GetTabla("DATOSEXPEDIENTE") == null || rm.GetTabla("DATOSEXPEDIENTE").Lregistros.Count() <= 0) {
                return;
            }
            IList<Dictionary<string, object>> lresp = new List<Dictionary<string, object>>();
            Dictionary<String, Object> m = new Dictionary<String, Object>();
            IList<Dictionary<string, object>> taportes = new List<Dictionary<string, object>>();
            tpreexpediente obj = (tpreexpediente)rm.GetTabla("DATOSEXPEDIENTE").Lregistros.ElementAt(0);
            tpreexpediente exp = null;

            long cpersona = long.Parse(rm.Mdatos["cpersona"].ToString());
            int ccompania = rm.Ccompania;
            string cdetalletipoexp = rm.Mdatos["cdetalletipoexp"].ToString();
            string cdetallejerarquia = rm.Mdatos["cdetallejerarquia"].ToString();
            DateTime fechaalta = Convert.ToDateTime((rm.Mdatos["fechaalta"]));
            DateTime fechabaja = Convert.ToDateTime((rm.Mdatos["fechabaja"]));
            int coeficiente = int.Parse((rm.Mdatos["coeficiente"]).ToString());
            //porcentaje = decimal.Parse(rm.Mdatos["porcentaje"].ToString());
            int ctipobaja = int.Parse((rm.Mdatos["ctipobaja"]).ToString());
            this.CrearSocio0506();
            IList<tpreactosservicio> listactoservicio = TpreActosServicioDal.Find(ctipobaja);
            // Consultar el historico de carrera por estado del socio ---- 3 cod BAJA
            tsoccesantiahistorico hisbaja = TsocCesantiaHistoricoDal.FindFordenToEstadoSocio(cpersona, (int)rm.Ccompania, 3);
            if (hisbaja != null) {
                if (obj.secuencia > 0) {
                    tpreliquidacion objliq = TpreLiquidacionDal.Find((int)obj.secuencia);
                    exp = TpreExpedienteDal.FindToExpediente((int)obj.secuencia);
                    porcentajef = (decimal)objliq.porcentajeanticipo;
                } else {
                    porcentajef = TsocTipoBajaDal.FindToAnticipo((long)hisbaja.csubestado) != null ? (decimal)TsocTipoBajaDal.FindToAnticipo((long)hisbaja.csubestado).porcentajeanticipocesantia : TpreParametrosDal.GetValorNumerico("POR-APORTES-ANTICIPO-CENSANTIA-NOMINIMO");
                }

                if (porcentaje > 0) {
                    if (porcentaje > porcentajef) {
                        nporcentaje = "PORCENTAJE NO PUEDE SER MAYOR A: " + porcentajef.ToString();
                    }
                    porcentajef = porcentaje;
                }

                simulacion = "N";
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
                totalingresos = datosGenerales.Valoringresos(cpersona, cdetalletipoexp, cdetallejerarquia, fechabaja, coeficiente, taportes, listactoservicio.Count > 0 ? true : false);
            }
            aportes = datosGenerales.ValorAportes(cdetalletipoexp, taportes);
            interes = datosGenerales.Interes(cdetalletipoexp, taportes);
            totalaportes = datosGenerales.TotalAportes(taportes);
            totalegresos = datosGenerales.Valoregresos(cpersona, ccompania, cdetalletipoexp, totalingresos, taportes);
            if (cdetalletipoexp.Equals("DEV") || cdetalletipoexp.Equals("DEH")) {
                devolucion = datosGenerales.Devolucion(cpersona);
            }
            tretenciones = datosGenerales.ValorDeudaRetenciones(cpersona, ccompania, totalingresos);
            tnovedades = datosGenerales.ValorDeudaNovedades(cpersona, ccompania);
            daportes = (decimal)datosGenerales.ValorDeudaAportes(cdetalletipoexp, taportes);
            cesantia = devolucion == false ? true : false;
            total = totalingresos - totalegresos;
            if (cdetalletipoexp.Equals("ANT") && !devolucion) {
                total = (total * porcentajef) / 100;
            }
            total = Math.Round(total, 2, MidpointRounding.AwayFromZero);
            object[] valores = new object[] { 0, 0, 0, 0, 0 };
            if (!devolucion) {
                

                if (soc0506) {
                    valores[3] = valorbonificacion;
                    valores[1] = vcuantiabasica;
                } else {
                    valores = Bonificacion.Ejecutar(cpersona, cdetallejerarquia, taportes, fechabaja, coeficiente, listactoservicio.Count > 0 ? true : false);
                    if (listactoservicio.Count > 0) {
                        porcentajef = 0;
                        total = 0;
                        totalaportes = datosGenerales.TotalAportes(taportes);
                        int contador = 0;
                        foreach (tpreactosservicio actoservicio in listactoservicio) {
                            contador++;
                            if (actoservicio.aportemin <= totalaportes && totalaportes <= actoservicio.aportemax) {
                                totalingresos = (decimal)valores[1];
                                valores[3] = 0;
                                decimal porcent = decimal.Parse(actoservicio.porcentaje.ToString());
                                total = totalingresos;
                                totalingresos = total = (total * porcent) / 100;
                                total = total - totalegresos;
                                total = Math.Round(total, 2, MidpointRounding.AwayFromZero);
                                porcentajef = actoservicio.porcentaje;
                                contador = 0;
                            }else{ //cca cambios expediente
                                if (contador >= 4){
                                    totalingresos = datosGenerales.Valoringresos(cpersona, cdetalletipoexp, cdetallejerarquia, fechabaja, coeficiente, taportes, 0 > 0 ? true : false);
                                    total = totalingresos - totalegresos;
                                }
                            }
                        }
                    }
                }
            }

            totalingresos = Math.Round(totalingresos, 2, MidpointRounding.AwayFromZero);

            rm.AddDatos("total", total);
            rm.AddDatos("totalingresos", totalingresos);
            rm.AddDatos("totalegresos", totalegresos);
            rm.AddDatos("valorbonificacion", valores[3]);
            rm.AddDatos("vcuantiabasica", valores[1]);
            rm.AddDatos("tprestamos", tprestamos);
            rm.AddDatos("tretenciones", tretenciones);
            rm.AddDatos("tnovedades", tnovedades);
            rm.AddDatos("daportes", daportes);
            rm.AddDatos("taportes", aportes);
            rm.AddDatos("interes", interes);
            rm.AddDatos("year", fechabaja.Year);
            rm.AddDatos("cdetalletipoexp", cdetalletipoexp);
            rm.AddDatos("cdetallejerarquia", cdetallejerarquia);
            rm.AddDatos("porcentaje", porcentajef);
            rm.AddDatos("totalaportes", totalaportes);

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
            //m["porcentaje"] = porcentajef != 0 ? porcentajef.ToString() : string.Empty;
            m["porcentaje"] = cdetalletipoexp.Equals("ANT") || cdetalletipoexp.Equals("CEF") ? "(" + porcentajef + ")" + "%" : string.Empty;
            m["nporcentaje"] = nporcentaje;
            m["totalsolicitado"] = exp == null ? 0 : exp.totalsolicitado;
            // Fija la respuesta en el response.
            lresp.Add(m);
            rm.Response["SIMULACION"] = lresp;
            rm.Response["BONIFICACION"] = valores;
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
