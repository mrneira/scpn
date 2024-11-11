using dal.generales;
using dal.persona;
using dal.socio;
using general.archivos;
using modelo;
using modelo.helper;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;

using util.interfaces.archivo;

namespace socio.archivo.carga {
    class Actualizacion :ICargaRegistro {
        public void Procesar(RqMantenimiento rqmantenimiento, string registro, int numerolinea, int cmodulo, int ctipoarchivo) {
            RegistroHelper rh = new RegistroHelper(rqmantenimiento, numerolinea, registro, cmodulo, ctipoarchivo);
            IList<tgencargacampos> lTgenCargaCampos = rh.CompletarValorCampo();
            this.ActualizarSocio(lTgenCargaCampos, rqmantenimiento);
        }
        public void ActualizarSocio(IList<tgencargacampos> lTgenCargaCampos, RqMantenimiento rqmantenimiento) {
            string Identificacion, direccion, telefono, credencial, tipoPolicia, estadoCivl, fnacimento;
            long cpersona;
            string Errores = string.Empty;
            tperpersonadetalle tperDetalle;

            ValdidarCampos ValdidarCampos = new ValdidarCampos();

            tperpersonadireccion tperDireccion;
            List<tperpersonadireccion> lstPersonaDireccion = new List<tperpersonadireccion>();

            tgencatalogodetalle tgencatalogodetalle = new tgencatalogodetalle();

            tsoccesantia socio = new tsoccesantia();
            List<tsoccesantia> lstSocio = new List<tsoccesantia>();

            tpernatural natural = new tpernatural();
            List<tpernatural> lstNatural = new List<tpernatural>();

            List<tgencargacampos> camposBuscar = lTgenCargaCampos.ToList<tgencargacampos>();
            Identificacion = camposBuscar.Find(x => x.atributo == "IDENTIFICACION").Mdatos["IDENTIFICACION"] != null ? camposBuscar.Find(x => x.atributo == "IDENTIFICACION").Mdatos["IDENTIFICACION"].ToString() : string.Empty;
            direccion = camposBuscar.Find(x => x.atributo == "DIRECCION").Mdatos["DIRECCION"] != null ? camposBuscar.Find(x => x.atributo == "DIRECCION").Mdatos["DIRECCION"].ToString() : string.Empty;
            telefono = camposBuscar.Find(x => x.atributo == "TELEFONO").Mdatos["TELEFONO"] != null ? camposBuscar.Find(x => x.atributo == "TELEFONO").Mdatos["TELEFONO"].ToString() : string.Empty;
            credencial = camposBuscar.Find(x => x.atributo == "CREDENCIAL").Mdatos["CREDENCIAL"] != null ? camposBuscar.Find(x => x.atributo == "CREDENCIAL").Mdatos["CREDENCIAL"].ToString() : string.Empty;
            tipoPolicia = camposBuscar.Find(x => x.atributo == "TIPO POLICIA").Mdatos["TIPO POLICIA"] != null ? camposBuscar.Find(x => x.atributo == "TIPO POLICIA").Mdatos["TIPO POLICIA"].ToString() : string.Empty;
            estadoCivl = camposBuscar.Find(x => x.atributo == "ESTADO CIVIL").Mdatos["ESTADO CIVIL"] != null ? camposBuscar.Find(x => x.atributo == "ESTADO CIVIL").Mdatos["ESTADO CIVIL"].ToString() : string.Empty;
            fnacimento = camposBuscar.Find(x => x.atributo == "FNACIMIENTO").Mdatos["FNACIMIENTO"] != null ? camposBuscar.Find(x => x.atributo == "FNACIMIENTO").Mdatos["FNACIMIENTO"].ToString() : string.Empty;
            Errores += ValdidarCampos.ValidarString(Identificacion, "IDENTIFICACIÓN");
         
            tperDetalle = TperPersonaDetalleDal.Find(Identificacion);

            if(tperDetalle != null) {
                cpersona = (long)tperDetalle.cpersona;
                natural = TperNaturalDal.Find(cpersona, tperDetalle.ccompania);

                if(natural != null) {
                    tgencatalogodetalle = TgenCatalogoDetalleDal.FindByLegal(301, estadoCivl);
                    string formatofecha = camposBuscar.Find(x => x.atributo == "FNACIMIENTO").formatofecha.ToString();
                    try {
                        if(!string.IsNullOrEmpty(fnacimento)) {
                            DateTime fechanacimiento = DateTime.ParseExact(fnacimento, formatofecha, CultureInfo.InvariantCulture);
                            if(fechanacimiento.Date > DateTime.Today) {
                                Errores += " Fecha de nacimiento no puede ser mayor a hoy";
                            } else {
                                natural.fnacimiento = fechanacimiento;
                            }
                        }

                    } catch(Exception ex) {
                        Errores += " FECHA DE NACIMIENTO INCORRECTA: " + fnacimento;
                    }
                    if(!string.IsNullOrEmpty(estadoCivl)) {
                        if(tgencatalogodetalle != null) {
                            natural.estadocivilcdetalle = tgencatalogodetalle.cdetalle;
                        } else {
                            Errores += "ESTADO CIVIL NO DEFINIDO";
                        }
                    }

                }
                tperDireccion = TperPersonaDireccionDal.Find(cpersona, tperDetalle.ccompania);
                if(!string.IsNullOrEmpty(direccion) || !string.IsNullOrEmpty(telefono)) {
                    if(tperDireccion == null) {
                        tperDireccion = new tperpersonadireccion();
                        tperDireccion.cpersona = tperDetalle.cpersona;
                        tperDireccion.ccompania = tperDetalle.ccompania;
                        tperDireccion.verreg = 0;
                        tperDireccion.optlock = 0;
                        tperDireccion.cusuarioing = rqmantenimiento.Cusuario;
                        tperDireccion.fingreso = DateTime.Now;
                        tperDireccion.tipodireccionccatalogo = 304;
                        tperDireccion.tipodireccioncdetalle = "2";
                        tperDireccion.direccion = direccion;
                        tperDireccion.telefonofijo = telefono;
                        tperDireccion.Esnuevo = true;
                    } else {
                        tperDireccion.direccion = direccion;
                        tperDireccion.telefonofijo = telefono;
                        tperDireccion.Actualizar = true;
                    }
                }

                socio = TsocCesantiaDal.FindToCarga(cpersona, tperDetalle.ccompania);
                if(socio != null) {
                    if(!string.IsNullOrEmpty(tipoPolicia)) {
                        tsoctipopolicia tipo = TsocTipoPoliciaDal.FindToDescripcion(tipoPolicia);
                        if(tipo == null) {
                            Errores += " Tipo de Policia no valido";
                        } else {
                            socio.ctipopolicia = tipo.ctipopolicia;

                        }

                        if(!string.IsNullOrEmpty(credencial)) {
                            socio.credencial = credencial;
                        }
                    }
                } else {
                    Errores += "NO EXISTE EL SOCIO CON IDENTIFICACIÓN " + Identificacion;
                }
                if(Errores == String.Empty) {
                    lstNatural.Add(natural);
                    rqmantenimiento.AdicionarTabla("tpernatural", lstNatural, false);
                    lstPersonaDireccion.Add(tperDireccion);
                    rqmantenimiento.AdicionarTabla("tperpersonadireccion", lstPersonaDireccion, false);
                    lstSocio.Add(socio);
                    rqmantenimiento.AdicionarTabla("tsoccesantia", lstSocio, false);
                    rqmantenimiento.Grabar();
                } else {
                    throw new AtlasException("0000", Errores);
                }

            } else {
                throw new AtlasException("CA-003", "NO EXISTE PERSONA PARA LA IDENTIFICACION INGRESADA " + Identificacion);
            }
        }

    }
}

