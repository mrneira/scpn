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
    class Ascenso :ICargaRegistro {
        /// <summary>
        /// Objeto que contiene los datos de Socios de Cesantia
        /// </summary>
        tsoccesantia tsocCesantia = new tsoccesantia();

        tsoccesantiahistorico tsocCesantiaHistorico = new tsoccesantiahistorico();
        tsoccesantiahistorico tsocCesantiaHistoricoUlt = new tsoccesantiahistorico();

        /// <summary>
        /// Objeto con la Informacion de Persona Detalle 
        /// </summary>

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
            DateTime fordenG = DateTime.Today, fechaAsc = DateTime.Today;
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

                    if (camposBuscar.Find(x => x.atributo == "CODIGOTIPOGRADO").Mdatos["CODIGOTIPOGRADO"] != null) {
                        tsocCesantiaHistoricoUlt = TsocCesantiaHistoricoDal.Find((long)tperDetalleB.cpersona, (int)tperDetalleB.ccompania);
                        if(tsocCesantiaHistoricoUlt.cestadosocio == 3) {
                            Errores += "La persona con identificación: " + identificacion + " está dada de baja, no puede realizar el ascenso";
                        }
                        tsocCesantiaHistorico.cestadosocio = 2;
                        tsocCesantiaHistorico.secuencia = tsocCesantiaHistoricoUlt.secuencia + 1;
                        tsocCesantia = TsocCesantiaDal.Find((long)tperDetalleB.cpersona, (int)tperDetalleB.ccompania);
                        tsocCesantia.secuenciahistorico = tsocCesantiaHistoricoUlt.secuencia + 1;
                        if(camposBuscar.Find(x => x.atributo == "FECHA ASCENSO").Mdatos["FECHA ASCENSO"] != null) {
                            fechaAsc = Convert.ToDateTime(camposBuscar.Find(x => x.atributo == "FECHA ASCENSO").Mdatos["FECHA ASCENSO"].ToString());
                            if(fechaAsc <= DateTime.Now) {
                                tsocCesantiaHistorico.festado = fechaAsc;
                            } else {
                                Errores += "fecha de ascenso no puede ser superior a hoy";
                            }
                        } else {
                            Errores += "sin fecha de ascenso";
                        }
                        if(camposBuscar.Find(x => x.atributo == "FECHA ORDEN GENERAL").Mdatos["FECHA ORDEN GENERAL"] != null) {
                            fordenG = Convert.ToDateTime(camposBuscar.Find(x => x.atributo == "FECHA ORDEN GENERAL").Mdatos["FECHA ORDEN GENERAL"].ToString());
                            if(fordenG <= DateTime.Now) {
                                tsocCesantiaHistorico.fordengen = fordenG;
                            } else {
                                Errores += "fecha de orden general no puede ser superior a hoy";
                            }
                        } else {
                            Errores += "sin fecha de orden general";
                        }

                        if(fechaAsc.Date > fordenG.Date)
                            Errores += " Fecha de Ascenso no puede ser mayor a fecha de orden general";
                        tsocCesantiaHistorico.ordengen = camposBuscar.Find(x => x.atributo == "ORDEN ASCENSO").Mdatos["ORDEN ASCENSO"].ToString();
                        long gradosiguiente = long.Parse(camposBuscar.Find(x => x.atributo == "CODIGOTIPOGRADO").Mdatos["CODIGOTIPOGRADO"].ToString());
                        tsoctipogrado tsoctipogrado = TsocTipoGradoDal.Find(gradosiguiente);
                        if(tsoctipogrado == null) {
                            Errores += " No existe el tipo grado";
                        }
                        tsocCesantiaHistorico.observaciones = "CARGA DE ARCHIVO";
                        tsocCesantiaHistorico.cgradoactual = gradosiguiente;
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