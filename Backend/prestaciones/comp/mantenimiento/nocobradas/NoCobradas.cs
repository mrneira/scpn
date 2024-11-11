using core.componente;
using dal.persona;
using dal.prestaciones;
using dal.socio;
using general.archivos.bulkinsert;
using modelo;
using prestaciones.comp.consulta.bonificacion;
using prestaciones.comp.consulta.expediente;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;


namespace prestaciones.comp.mantenimiento.nocobradas {
    class NoCobradas : ComponenteMantenimiento {
        IList<Dictionary<String, Object>> lsoc = new List<Dictionary<String, Object>>();
        IList<Dictionary<string, object>> taportes = new List<Dictionary<string, object>>();
        int cpersona = 0, coeficiente = 0, totalaportes = 0; long csubestado, cgradoactual; decimal? naportesm = 0, totalingresos = 0,
            valorbonificacion = 0, vcuantiabasica = 0, porcentajef = 0;
        string cdetalletipoexp = string.Empty, cdetallejerarquia = string.Empty;
        DateTime fechabaja;
        bool soc0506 = false, devolucion = false;
        tpreparametros param = new tpreparametros();
        IList<tpreactosservicio> actoservicio = null;

        IList<tprenocobradas> lexpediente = new List<tprenocobradas>();

        tsoctipobaja tsoctipobaja = new tsoctipobaja();
        tsoctipogrado tsoctipogrado = new tsoctipogrado();
        DatosGenerales datosGenerales = new DatosGenerales();
        Bonificacion Bonificacion = new Bonificacion();
        DataSet ds = new DataSet();
        DataTable dt = new DataTable();

        public override void Ejecutar(RqMantenimiento rm) {
            lsoc = TpreExpedienteDal.GetSocio();
            TpreExpedienteDal.EliminarNoCobradas();
            this.Simular(lsoc);
            BulkInsertHelper.Grabar(lexpediente, "tprenocobradas");

        }

        public void Simular(IList<Dictionary<String, Object>> lsoc) {
            this.CrearSocio0506();
            param = TpreParametrosDal.Find("CAN-MINIMA-APORTES");
            naportesm = param.numero;
            foreach (Dictionary<String, Object> soc in lsoc) {
                cpersona = int.Parse(soc.ElementAt(0).Value.ToString());
                int ccompania = 1;
                cdetallejerarquia = soc.ElementAt(1).Value.ToString();
                fechabaja = (DateTime)soc.ElementAt(2).Value;
                csubestado = (long)soc.ElementAt(3).Value;
                cgradoactual = (long)soc.ElementAt(4).Value;
                totalaportes = int.Parse(soc.ElementAt(5).Value.ToString());
                tsoctipobaja = TsocTipoBajaDal.Find(csubestado);
                tsoctipogrado = TsocTipoGradoDal.Find(cgradoactual);
                coeficiente = (int)tsoctipogrado.coeficiente;

                if (tsoctipobaja != null) {
                    actoservicio = TpreActosServicioDal.Find(tsoctipobaja.ctipobaja);
                } else {
                    actoservicio = TpreActosServicioDal.Find(0);
                }

                if (totalaportes < naportesm) {
                    cdetalletipoexp = "DEV";
                } else {
                    cdetalletipoexp = "CES";
                }

                if (tsoctipobaja != null && (actoservicio.Count > 0)) {
                    if (cdetalletipoexp.Equals("CES")) {
                        cdetalletipoexp = "CEF";
                    }

                    if (actoservicio.Count > 0 && cdetalletipoexp.Equals("DEV")) {
                        cdetalletipoexp = "CEF";
                    }
                }

                if (tsoctipobaja != null) {
                    if (cdetalletipoexp.Equals("DEV") && tsoctipobaja.ctipobaja == 2) {
                        cdetalletipoexp = "DEH";
                    }
                }



                taportes = TpreAportesDal.GetTotalAportes(cpersona, "N");
                soc0506 = false;
                foreach (DataRow row in ds.Tables[0].Rows) {
                    if (cpersona == int.Parse(row["cpersona"].ToString())) {
                        totalingresos = decimal.Parse(row["vcesantia"].ToString());
                        valorbonificacion = decimal.Parse(row["vbonificacion"].ToString());
                        vcuantiabasica = decimal.Parse(row["vcuantiabasica"].ToString());
                        soc0506 = true;
                    }
                }

                // if (fechabaja.Year < 2007) {
                //   fechabaja = DateTime.Now;
                // }

                if (!soc0506) {
                    totalingresos = datosGenerales.Valoringresos(cpersona, cdetalletipoexp, cdetallejerarquia, fechabaja, coeficiente, taportes, actoservicio.Count > 0 ? true : false);
                }

                decimal aportes = datosGenerales.ValorAportes(cdetalletipoexp, taportes);
                decimal interes = datosGenerales.Interes(cdetalletipoexp, taportes);
                totalaportes = datosGenerales.TotalAportes(taportes);
                decimal totalegresos = datosGenerales.Valoregresos(cpersona, 1, cdetalletipoexp, (decimal)totalingresos, taportes);
                devolucion = false;
                if (cdetalletipoexp.Equals("DEV") || cdetalletipoexp.Equals("DEH")) {
                    devolucion = true;
                }
                decimal tretenciones = datosGenerales.ValorDeudaRetenciones(cpersona, ccompania, (decimal)totalingresos);
                decimal tnovedades = datosGenerales.ValorDeudaNovedades(cpersona, ccompania);
                decimal daportes = (decimal)datosGenerales.ValorDeudaAportes(cdetalletipoexp, taportes);
                decimal? total = totalingresos - totalegresos;
                if (cdetalletipoexp.Equals("ANT") && !devolucion) {
                    total = (total * porcentajef) / 100;
                }
                total = Math.Round((decimal)total, 2, MidpointRounding.AwayFromZero);
                object[] valores = new object[] { 0, 0, 0, 0, 0 };
                if (!devolucion) {


                    if (soc0506) {
                        valores[3] = valorbonificacion;
                        valores[1] = vcuantiabasica;
                    } else {


                        valores = Bonificacion.Ejecutar(cpersona, cdetallejerarquia, taportes, fechabaja, coeficiente, actoservicio.Count > 0 ? true : false);
                        if (actoservicio.Count > 0) {
                            porcentajef = 0;
                            total = 0;
                            totalaportes = datosGenerales.TotalAportes(taportes);
                            foreach (tpreactosservicio actoservicio in actoservicio) {
                                if (actoservicio.aportemin <= totalaportes && totalaportes <= actoservicio.aportemax) {
                                    totalingresos = (decimal)valores[1];
                                    valorbonificacion = 0;
                                    valores[3] = valorbonificacion;
                                    decimal porcent = decimal.Parse(actoservicio.porcentaje.ToString());
                                    total = totalingresos;
                                    total = (total * porcent) / 100;
                                    total = total - totalegresos;
                                    total = Math.Round((decimal)total, 2, MidpointRounding.AwayFromZero);
                                    porcentajef = actoservicio.porcentaje;
                                }
                            }
                        }
                    }
                }
                totalingresos = Math.Round((decimal)totalingresos, 2, MidpointRounding.AwayFromZero);
                tprenocobradas exp = new tprenocobradas();
                exp.Esnuevo = true;
                exp.cpersona = cpersona;
                exp.ccompania = ccompania;
                exp.ccatalogotipoexp = 2802;
                exp.cdetalletipoexp = cdetalletipoexp;
                exp.subtotal = totalingresos;
                exp.totalliquidacion = total;
                exp.numaportaciones = totalaportes;
                exp.vcuantiabasica = decimal.Parse(valores[1].ToString());
                exp.vbonificacion = valorbonificacion;
                exp.taportes = aportes;
                exp.vinteres = interes;
                exp.dprestamos = 0;
                exp.dnovedades = tnovedades;
                exp.dretenciones = tretenciones;
                exp.daportes = daportes;
                exp.tdescuento = tnovedades + tretenciones + daportes;
                exp.fingreso = DateTime.Now;
                lexpediente.Add(exp);
            }
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

