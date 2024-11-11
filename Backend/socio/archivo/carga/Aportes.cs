using general.archivos;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
//using System.Text;
//using System.Threading.Tasks;
using System.Reflection;
using util.interfaces.archivo;
using util.dto.mantenimiento;
//using persona.comp.mantenimiento.natural;
using core.servicios;
using util.servicios.ef;
using util;
using dal.persona;
using dal.socio;
using util.dto;
using System.Globalization;
using dal.prestaciones;
using modelo.interfaces;
using System.Threading;

namespace socio.archivo.carga {
    class Aportes :ICargaRegistro {
        public static List<tpreaporte> aportesAcumulado = new List<tpreaporte>();
        /// <summary>
        /// procesa la logica de necogio para subir un registro a la base de datos 
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="registro"></param>
        /// <param name="numerolinea"></param>
        public void Procesar(RqMantenimiento rqmantenimiento, string registro, int numerolinea, int cmodulo, int ctipoarchivo) {

            RegistroHelper rh = new RegistroHelper(rqmantenimiento, numerolinea, registro, cmodulo, ctipoarchivo);
            IList<tgencargacampos> lTgenCargaCampos = rh.CompletarValorCampo();
            this.CompletarAporte(rqmantenimiento, lTgenCargaCampos);
        }

        public void CompletarAporte(RqMantenimiento rqmantenimiento, IList<tgencargacampos> lTgenCargaCampos) {

            List<tgencargacampos> camposBuscar = lTgenCargaCampos.ToList<tgencargacampos>();
            string method = string.Format("{0}.{1}", MethodBase.GetCurrentMethod().DeclaringType.FullName, MethodBase.GetCurrentMethod().Name);
            tpreaporte tpreAportes = new tpreaporte();
            List<DtoDatos> laportes = new List<DtoDatos>();
            List<tpreaporte> lAportes = new List<tpreaporte>();
            List<tsoccesantia> lsocio = new List<tsoccesantia>();
            List<tsoccesantiahistorico> lsociohis = new List<tsoccesantiahistorico>();
            decimal sumpatronal = 0, sumpersonal = 0;

            // Culture valores decimal tome . como separador decimal
            Thread.CurrentThread.CurrentCulture = new CultureInfo("es-PE");

            DateTime Freal = new DateTime(rqmantenimiento.Freal.Year, rqmantenimiento.Freal.Month, 1);

            string Errores = string.Empty;

            DtoDatos d = new DtoDatos();
            try {
                string identificacion = camposBuscar.Find(x => x.atributo == "identificacion").Mdatos["identificacion"] != null ? camposBuscar.Find(x => x.atributo == "identificacion").Mdatos["identificacion"].ToString() : string.Empty;
                tperpersonadetalle tperpersonadetalle = TperPersonaDetalleDal.Find(identificacion);

                List<tpreaporte> Ltpreaporte = TpreAportesDal.FindPorFaporte(Fecha.DateToInteger(Freal));
                if(Ltpreaporte.Count > 0) {
                    Errores += "YA EXISTE APORTES CARGADOS CON FECHA: " + Freal;
                }

                if(identificacion.Trim().Length == 0) {
                    Errores += "IDENTIFICACIÓN VACÍA";
                }

                if(tperpersonadetalle == null) {
                    Errores += "NO EXISTE LA PERSONA CON CÉDULA: " + identificacion;
                    d.AddDatos("cpersona", 0);
                } else {
                    tsoccesantiahistorico tsoccesantiahistorico = TsocCesantiaHistoricoDal.FindToAportes(tperpersonadetalle.cpersona, tperpersonadetalle.ccompania);
                    if(tsoccesantiahistorico == null) {
                        Errores += "NO EXISTE HISTÓRICO DE LA PERSONA CON CÉDULA: " + identificacion;
                    }
                    d.AddDatos("cpersona", tperpersonadetalle.cpersona);
                }



                d.AddDatos("identificacio", identificacion);

                string ubicacion = camposBuscar.Find(x => x.atributo == "ubicacion").Mdatos["ubicacion"] != null ? camposBuscar.Find(x => x.atributo == "ubicacion").Mdatos["ubicacion"].ToString() : string.Empty;
                d.AddDatos("ubicacion", ubicacion);

                string sueldo = camposBuscar.Find(x => x.atributo == "sueldoactual").Mdatos["sueldoactual"] != null ? camposBuscar.Find(x => x.atributo == "sueldoactual").Mdatos["sueldoactual"].ToString() : string.Empty;
                d.AddDatos("sueldo", decimal.Parse(sueldo));

                if(sueldo.Trim().Length == 0) {
                    Errores += "SUELDO VACÍO";
                }

                if(decimal.Parse(sueldo) <= 0) {
                    Errores += "SUELDO ES IGUAL O MENOR A CERO PARA: " + identificacion;
                }

                string aportepersonal = camposBuscar.Find(x => x.atributo == "aportepersonal").Mdatos["aportepersonal"] != null ? camposBuscar.Find(x => x.atributo == "aportepersonal").Mdatos["aportepersonal"].ToString() : string.Empty;
                d.AddDatos("aportepersonal", decimal.Parse(aportepersonal));

                if(aportepersonal.Trim().Length == 0) {
                    Errores += "APORTE PATRONAL VACÍO";
                }

                if(decimal.Parse(aportepersonal) <= 0) {
                    Errores += "APORTE PATRONAL ES IGUAL O MENOR A CERO PARA: " + identificacion;
                }

                long caporte = Secuencia.GetProximovalor("APORTES");
                long? max = TpreAportesDal.GetMaxCaportes();

                if(max + 1 > caporte) {
                    Errores += "SECUENCIA INCORRECTA: ";
                }
                d.AddDatos("caporte", caporte);
                laportes.Add(d);
                Errores += LlenarAportes(rqmantenimiento, laportes);
                bool fin;
                if(rqmantenimiento.GetDatos("procesoaportefin") != null) {
                    fin = (bool)rqmantenimiento.GetDatos("procesoaportefin");
                    if(fin) {

                        if(Errores == String.Empty) {
                            this.Grabar(aportesAcumulado);
                            //rqmantenimiento.AdicionarTabla("tpreaporte", aportesAcumulado, false);
                          //  lsocio = TsocCesantiaDal.UpdateTsocCesantia(aportesAcumulado);
                            //rqmantenimiento.AdicionarTabla("tsoccesantia", lsocio, false);
                            this.ActualizarSocio(lsocio);
                            //DateTime Freal = new DateTime(rqmantenimiento.Freal.Year, rqmantenimiento.Freal.Month, 1);
                            sumpersonal = (decimal)TpreAportesDal.GetSumPersonal(aportesAcumulado);
                            sumpatronal = (decimal)TpreAportesDal.GetSumPatronal(aportesAcumulado);
                            rqmantenimiento.AddDatos("totalAporteIndividual", sumpersonal);
                            rqmantenimiento.AddDatos("totalAportePatronal", sumpatronal);
                        }

                        aportesAcumulado = new List<tpreaporte>();

                    }
                }

                if(Errores != String.Empty) {
                    throw new AtlasException("0000", Errores);
                }
            } catch(Exception e) {
                aportesAcumulado = new List<tpreaporte>();
                throw new AtlasException("0000", e.Message);
            }
        }

        public string LlenarAportes(RqMantenimiento rqmantenimiento, List<DtoDatos> aporte) {
            string Errores = "";
            tpreaporte tpreaporte = new tpreaporte();
            tpreaporte.Esnuevo = true;
            tpreaporte.caporte = (long)aporte[0].Mdatos["caporte"];
            tpreaporte.cpersona = (long)aporte[0].Mdatos["cpersona"];
            DateTime fechaaporte = new DateTime(DateTime.Parse(rqmantenimiento.Mdatos["fechaaporte"].ToString()).Year, DateTime.Parse(rqmantenimiento.Mdatos["fechaaporte"].ToString()).Month, 1);
            tpreaporte.ccompania = rqmantenimiento.Ccompania;
            tpreaporte.fechaaporte = (Fecha.DateToInteger(fechaaporte) - 1) / 100;
            tpreaporte tpreaporteval = TpreAportesDal.FindPorCpersonaFaporte(tpreaporte.cpersona, tpreaporte.fechaaporte);
            if(tpreaporteval != null) {
                Errores = ("YA EXISTEN APORTES EN FECHA: " + tpreaporte.fechaaporte + " CON IDENTIFICACIÓN: " + aporte[0].Mdatos["identificacio"]);
            }
            tpreaporte.sueldo = (decimal)aporte[0].Mdatos["sueldo"];
            tpreaporte.aportepersonal = (decimal)aporte[0].Mdatos["aportepersonal"];
            tpreaporte.aportepatronal = CalcularAporte((decimal)tpreaporte.sueldo);
            tpreaporte.ajuste = 0;
            tpreaporte.activo = true;
            tpreaporte.valido = true;
            tpreaporte.descripcion = "";
            tpreaporte.comprobantecontable = 0;
            tpreaporte.cusuariocrea = rqmantenimiento.Cusuario;
            tpreaporte.fechahoracrea = rqmantenimiento.Freal;
            tpreaporte.interesgenerado = 0;
            tpreaporte.AddDatos("ubicacion", aporte[0].Mdatos["ubicacion"]);
            aportesAcumulado.Add(tpreaporte);
            if(aportesAcumulado.Count > 1) {
                foreach(tpreaporte aporteAux in aportesAcumulado.GroupBy(t => t).Where(t => t.Count() != 1)) {
                    //if (aporteAux.cpersona == tpreaporte.cpersona && aporteAux.fechaaporte == tpreaporte.fechaaporte) {
                    Errores = "DATOS DUPLICADOS CON IDENTIFICACIÓN: " + aporte[0].Mdatos["identificacio"];
                    // }
                }

            }
            return Errores;
        }

        public decimal CalcularAporte(decimal sueldo) {
            decimal aportepersonal = TpreParametrosDal.GetValorNumerico("POR-APORTE-PATRONO");
            aportepersonal = aportepersonal / 100;
            sueldo = sueldo * aportepersonal;
            return sueldo;
        }
        public void Grabar(List<tpreaporte> tpreaporte) {
            foreach(tpreaporte aporteSave in tpreaporte) {
                Sessionef.Grabar(aporteSave);
            }
        }

        public void ActualizarSocio(List<tsoccesantia> tsoccesantia) {
            foreach(tsoccesantia socioUpdate in tsoccesantia) {
                Sessionef.Actualizar(socioUpdate);
            }
        }
    }
}