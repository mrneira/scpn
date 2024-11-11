using dal.persona;
using dal.socio;
using general.archivos;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;
using util.interfaces.archivo;
using util.servicios.ef;

namespace socio.archivo.carga {
    class Bajas :ICargaRegistro {
        /// <summary>
        /// Objeto que contiene los datos de Socios de Cesantia
        /// </summary>
        tsoccesantiahistorico tsocCesantiaHistorico = new tsoccesantiahistorico();
        tsoccesantiahistorico tsocCesantiaHistoricoUlt = new tsoccesantiahistorico();
        /// <summary>-
        /// Objeto con la Informacion de Persona Detalle 
        /// </summary>
        tperpersonadetalle tperDetalle = new tperpersonadetalle();
        /// <summary>
        /// procesa la logica de necogio para subir un registro a la base de datos 
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="registro"></param>
        /// <param name="numerolinea"></param>
        public void Procesar(RqMantenimiento rqmantenimiento, string registro, int numerolinea, int cmodulo, int ctipoarchivo) {
            RegistroHelper rh = new RegistroHelper(rqmantenimiento, numerolinea, registro, cmodulo, ctipoarchivo);
            IList<tgencargacampos> lTgenCargaCampos = rh.CompletarValorCampo();
            this.CompletarSocio(lTgenCargaCampos, rqmantenimiento);
        }

        public void CompletarSocio(IList<tgencargacampos> lTgenCargaCampos, RqMantenimiento rqMantenimiento) {
            List<tgencargacampos> camposBuscar = lTgenCargaCampos.ToList<tgencargacampos>();
            string Errores = string.Empty;
            DateTime fordenG = DateTime.Today, fechaBaja = DateTime.Today;
            if(camposBuscar.Find(x => x.atributo == "IDENTIFICACION").Mdatos["IDENTIFICACION"] != null) {
                string identificacion = camposBuscar.Find(x => x.atributo == "IDENTIFICACION").Mdatos["IDENTIFICACION"].ToString();
                tperpersonadetalle tperDetalleB = TperPersonaDetalleDal.Find(identificacion);
                tsoccesantia tsocCesantia = new tsoccesantia();
                if(tperDetalleB != null) {
                    tsocCesantiaHistorico.Esnuevo = true;
                    tsocCesantiaHistorico.cpersona = tperDetalleB.cpersona;
                    tsocCesantiaHistorico.ccompania = tperDetalleB.ccompania;
                    tsocCesantiaHistorico.verreg = 0;
                    tsocCesantiaHistorico.optlock = 0;
                    tsocCesantiaHistorico.activo = true;
                    if(camposBuscar.Find(x => x.atributo == "CODIGOBAJA").Mdatos["CODIGOBAJA"] != null) {
                        int subestado = int.Parse(camposBuscar.Find(x => x.atributo == "CODIGOBAJA").Mdatos["CODIGOBAJA"].ToString());
                        tsoctipobaja tsoctipobaja = TsocTipoBajaDal.Find(subestado);
                        if(tsoctipobaja == null) {
                            Errores += "CÓDIGO BAJA NO EXISTE:" + subestado;
                        }
                        tsocCesantiaHistorico.csubestado = subestado;
                        int? grado = TsocCesantiaHistoricoDal.FindByActual((long)tperDetalleB.cpersona, (int)tperDetalleB.ccompania);
                        tsocCesantiaHistoricoUlt = TsocCesantiaHistoricoDal.Find((long)tperDetalleB.cpersona, (int)tperDetalleB.ccompania);
                        if(tsocCesantiaHistoricoUlt.cestadosocio == 3) {
                            Errores += "La persona con identificación: " + identificacion + " está dada de baja, no puede realizar la baja";
                        }
                        tsocCesantiaHistorico.cestadosocio = 3;
                        tsocCesantiaHistorico.secuencia = tsocCesantiaHistoricoUlt.secuencia + 1;
                        tsocCesantia = TsocCesantiaDal.Find((long)tperDetalleB.cpersona, (int)tperDetalleB.ccompania);
                        tsocCesantia.secuenciahistorico = tsocCesantiaHistoricoUlt.secuencia + 1;
                        tsocCesantia.ccdetalletipoestado = "BAJ";
                        if(camposBuscar.Find(x => x.atributo == "FECHA BAJA").Mdatos["FECHA BAJA"] != null) {
                            fechaBaja = Convert.ToDateTime(camposBuscar.Find(x => x.atributo == "FECHA BAJA").Mdatos["FECHA BAJA"].ToString());
                            if(fechaBaja <= DateTime.Now) {
                                tsocCesantiaHistorico.festado = fechaBaja;
                            } else {
                                Errores += "Fecha de baja no puede ser superior a hoy";
                            }
                        } else {
                            Errores += "Sin fecha de baja";
                        }
                        if(camposBuscar.Find(x => x.atributo == "FECHAORDENGEN").Mdatos["FECHAORDENGEN"] != null) {
                            fordenG = Convert.ToDateTime(camposBuscar.Find(x => x.atributo == "FECHAORDENGEN").Mdatos["FECHAORDENGEN"].ToString());
                            if(fordenG <= DateTime.Now) {
                                tsocCesantiaHistorico.fordengen = fordenG;
                            } else {
                                Errores += "Fecha de orden general no puede ser superior a hoy";
                            }
                        } else {
                            Errores += "Sin fecha de orden general";
                        }

                        if(fechaBaja.Date > fordenG.Date)
                            Errores += " Fecha de Baja no puede ser mayor a fecha de orden general";
                        tsocCesantiaHistorico.ordengen = camposBuscar.Find(x => x.atributo == "ORDENGENBAJA").Mdatos["ORDENGENBAJA"].ToString();
                        tsocCesantiaHistorico.cgradoactual = grado;

                    } else {
                        Errores += "Sin grado";
                    }
                } else {
                    Errores += "NO EXISTE PERSONA CON LA IDENTI>FICACIÓN: " + identificacion;
                }

                if(Errores == String.Empty) {
                    rqMantenimiento.AdicionarTabla("ACTULIZACIONSO>CIO", tsocCesantia, 0, false);
                    rqMantenimiento.AdicionarTabla("tsoccesantiahistorico", tsocCesantiaHistorico, 0, false);
                    rqMantenimiento.Grabar();
                } else {
                    throw new AtlasException("0000", Errores);
                }
            }
        }
    }
}