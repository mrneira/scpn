using core.servicios;
using dal.persona;
using dal.prestaciones;
using dal.socio;
using general.archivos;
using modelo;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using util;
using util.dto;
using util.dto.mantenimiento;
using util.interfaces.archivo;
using util.servicios.ef;

namespace socio.archivo.carga {
    class AportesAdicionales : ICargaRegistro {
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


            // DateTime fechaaporte = new DateTime(DateTime.Parse(rqmantenimiento.Mdatos["fechaaporte"].ToString()).Year, DateTime.Parse(rqmantenimiento.Mdatos["fechaaporte"].ToString()).Month, 1);
            int intfechaaporte = int.Parse(rqmantenimiento.Mdatos["fechaaporte"].ToString());
            // int intfechaaporte = (Fecha.DateToInteger(fechaaporte) - 1) / 100;

            string Errores = string.Empty;

            string ubicacion = camposBuscar.Find(x => x.atributo == "ubicacion").Mdatos["ubicacion"] != null ? camposBuscar.Find(x => x.atributo == "ubicacion").Mdatos["ubicacion"].ToString() : string.Empty;

            string sueldo = camposBuscar.Find(x => x.atributo == "sueldo").Mdatos["sueldo"] != null ? camposBuscar.Find(x => x.atributo == "sueldo").Mdatos["sueldo"].ToString() : string.Empty;

            DtoDatos d = new DtoDatos();
            try {
                string identificacion = camposBuscar.Find(x => x.atributo == "identificacion").Mdatos["identificacion"] != null ? camposBuscar.Find(x => x.atributo == "identificacion").Mdatos["identificacion"].ToString() : string.Empty;
                tperpersonadetalle tperpersonadetalle = TperPersonaDetalleDal.Find(identificacion);

                if (identificacion.Trim().Length == 0) {
                    Errores += "IDENTIFICACIÓN VACÍA";
                }

                if (tperpersonadetalle == null) {
                    Errores += "NO EXISTE LA PERSONA CON CÉDULA: " + identificacion;
                } else {
                    tsoccesantiahistorico tsoccesantiahistorico = TsocCesantiaHistoricoDal.FindToAportes(tperpersonadetalle.cpersona, tperpersonadetalle.ccompania);
                    if (tsoccesantiahistorico == null) {
                        Errores += "NO EXISTE HISTÓRICO DE LA PERSONA CON CÉDULA: " + identificacion;
                    }
                    tpreAportes = TpreAportesDal.FindPorCpersonaFaporte(tperpersonadetalle.cpersona, intfechaaporte);
                    if (tpreAportes == null) {
                        if (decimal.Parse(sueldo) > 0)
                            Errores += "NO EXISTE APORTES CARGADOS CON FECHA: " + intfechaaporte + " PARA LA PERSONA: " + identificacion;
                    } else {
                        if (tpreAportes.ajuste > 0) {
                            Errores += "YA EXISTE APORTE ADICIONAL CARGADOS CON FECHA: " + intfechaaporte + " PARA LA PERSONA: " + identificacion;
                        }
                    }


                }



                if (sueldo.Trim().Length == 0) {
                    Errores += "SUELDO VACÍO";
                }

                if (decimal.Parse(sueldo) < 0) {
                    Errores += "SUELDO ES IGUAL O MENOR A CERO PARA: " + identificacion;
                }

                string adicional = camposBuscar.Find(x => x.atributo == "aportepersonal").Mdatos["aportepersonal"] != null ? camposBuscar.Find(x => x.atributo == "aportepersonal").Mdatos["aportepersonal"].ToString() : string.Empty;

                if (adicional.Trim().Length == 0) {
                    Errores += "APORTE ADICIONAL VACÍO";
                }

                if (decimal.Parse(adicional) < 0) {
                    Errores += "APORTE ADICIONAL ES IGUAL O MENOR A CERO PARA: " + identificacion;
                }

                Errores += LlenarAportes(rqmantenimiento, tpreAportes, decimal.Parse(adicional), identificacion);

                bool fin;

                if (rqmantenimiento.GetDatos("procesoaportefin") != null) {
                    fin = (bool)rqmantenimiento.GetDatos("procesoaportefin");
                    if (fin) {
                        if (Errores == String.Empty) {
                            this.Actualizar(aportesAcumulado);
                        }
                        aportesAcumulado = new List<tpreaporte>();
                    }
                }

                if (Errores != String.Empty) {
                    throw new AtlasException("0000", Errores);
                }
            } catch (Exception e) {
                aportesAcumulado = new List<tpreaporte>();
                throw new AtlasException("0000", e.Message);
            }
        }

        public string LlenarAportes(RqMantenimiento rqmantenimiento, tpreaporte aporte, decimal adicional, string identificacion) {
            string Errores = "";
            adicional = adicional / 100;
            if (adicional > 0) {
                aporte.ajuste = adicional;
                aporte.ajustepatronal = CalcularAdicionalPatronal(adicional);
                aportesAcumulado.Add(aporte);
                if (aportesAcumulado.Count > 1) {
                    foreach (tpreaporte aporteAux in aportesAcumulado.GroupBy(t => t).Where(t => t.Count() != 1)) {
                        Errores = "DATOS DUPLICADOS CON IDENTIFICACIÓN: " + identificacion;
                    }
                }
            }

            return Errores;
        }

        public decimal CalcularAdicionalPatronal(decimal adicional) {
            decimal adicionalpatronal = 0;
            decimal porcentajepatronal = TpreParametrosDal.GetValorNumerico("POR-APORTE-PATRONO");
            decimal porcentajepersonal = TpreParametrosDal.GetValorNumerico("POR-APORTE-PERSONAL");
            decimal sueldo = Math.Round(adicional * 100 / porcentajepersonal, 2);
            adicionalpatronal = Math.Round(sueldo * porcentajepatronal / 100, 2);
            return adicionalpatronal;
        }
        public void Actualizar(List<tpreaporte> tpreaporte) {
            foreach (tpreaporte aporteSave in tpreaporte) {
                Sessionef.Actualizar(aporteSave);
            }
        }
    }
}
