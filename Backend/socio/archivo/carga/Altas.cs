using general.archivos;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Reflection;
using util.interfaces.archivo;
using util.dto.mantenimiento;
using persona.comp.mantenimiento.natural;
using core.servicios;
using util.servicios.ef;
using util;
using dal.persona;
using core.servicios.mantenimiento;
using dal.socio;
using dal.generales;
using System.Globalization;
using System.Threading;

namespace socio.archivo.carga {
    /// <summary>
    /// Clase para la carga de Alta de socios con el formato de archivo especifico 
    /// </summary>
    class Altas :ICargaRegistro {

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
            Thread.CurrentThread.CurrentCulture = new CultureInfo("es-PE");
            #region Declaración de Variables
            /// <summary>
            /// Secuencia de persona asignado 
            /// </summary>
            long? cpersona;
            /// <summary>
            /// Objeto que contiene los componenetes de persona 
            /// </summary>
            Natural personaDal = new Natural();
            /// <summary>
            /// Objeto que contiene los datos de Socios de Cesantia
            /// </summary>
            tsoccesantia tsocCesantia = new tsoccesantia();

            List<tsoccesantia> ListtsocCesantia = new List<tsoccesantia>();
            /// <summary>
            /// Objeto con  la Informacion de persona Natural 
            /// </summary>
            tpernatural tperNatural = new tpernatural();

            List<tpernatural> ListtperNatural = new List<tpernatural>();
            /// <summary>
            /// Objeto con la Informacion de Persona Detalle 
            /// </summary>
            tperpersonadetalle tperDetalle = new tperpersonadetalle();

            List<tperpersonadetalle> ListtperDetalle = new List<tperpersonadetalle>();
            ///  
            tperpersonadireccion tperDireccion = new tperpersonadireccion();

            List<tgencargacampos> camposBuscar = lTgenCargaCampos.ToList<tgencargacampos>();

            DateTime fordenG = DateTime.Today, fechaAlta = DateTime.Today;

            tgencatalogodetalle tgencatalogodetalle = new tgencatalogodetalle();

            List<tperpersonadireccion> lstPersonaDireccion = new List<tperpersonadireccion>();

            string Errores = string.Empty, direccion, telefono;
            string formatofecha = string.Empty, formatofechaalta = string.Empty, formatofechaordegen = string.Empty;
            string method = string.Format("{0}.{1}", MethodBase.GetCurrentMethod().DeclaringType.FullName, MethodBase.GetCurrentMethod().Name);
            #endregion Declaración de Variables

            try {
                #region Llenar Información General
                tperDetalle.identificacion = camposBuscar.Find(x => x.atributo == "CEDULA").Mdatos["CEDULA"] != null ? camposBuscar.Find(x => x.atributo == "CEDULA").Mdatos["CEDULA"].ToString() : string.Empty;
                tperpersonadetalle p = TperPersonaDetalleDal.Find(tperDetalle.identificacion);
                if(p != null) {
                    Errores += " YA EXISTE UNA PERSONA CON IDENTIFICACIÓN " + tperDetalle.identificacion;

                }

                bool result = personaDal.ValidarIdentificacionArchivo(tperDetalle.identificacion, "C");
                if(!result) {
                    Errores += " IDENTIFICACION NO VALIDA " + tperDetalle.identificacion;
                }

                direccion = camposBuscar.Find(x => x.atributo == "DIRECCION").Mdatos["DIRECCION"] != null ? camposBuscar.Find(x => x.atributo == "DIRECCION").Mdatos["DIRECCION"].ToString() : string.Empty;
                telefono = camposBuscar.Find(x => x.atributo == "TELEFONO").Mdatos["TELEFONO"] != null ? camposBuscar.Find(x => x.atributo == "TELEFONO").Mdatos["TELEFONO"].ToString() : string.Empty;
                if(!string.IsNullOrEmpty(direccion)) {
                    tperDireccion = new tperpersonadireccion();
                    //tperDireccion.cpersona = p.cpersona;
                    //tperDireccion.ccompania = p.ccompania;
                    tperDireccion.verreg = 0;
                    tperDireccion.optlock = 0;
                    tperDireccion.cusuarioing = rqMantenimiento.Cusuario;
                    tperDireccion.fingreso = DateTime.Now;
                    tperDireccion.tipodireccionccatalogo = 304;
                    tperDireccion.tipodireccioncdetalle = "2";
                    tperDireccion.direccion = direccion;
                    tperDireccion.telefonofijo = telefono;
                    tperDireccion.Esnuevo = true;
                }


                string nombre = camposBuscar.Find(x => x.atributo == "NOMBRES").Mdatos["NOMBRES"] != null ? camposBuscar.Find(x => x.atributo == "NOMBRES").Mdatos["NOMBRES"].ToString() : string.Empty;
                string[] listadoNombre = nombre.Split(' ');
                string primernombre, segundonombre = string.Empty;
                primernombre = listadoNombre[0];

                if(listadoNombre.Length == 2) {
                    segundonombre = listadoNombre[1];
                }

                if(listadoNombre.Length == 3) {
                    segundonombre = listadoNombre[1] + " " + listadoNombre[2];
                }

                if(listadoNombre.Length == 4) {
                    segundonombre = listadoNombre[1] + " " + listadoNombre[2] + " " + listadoNombre[3];
                }

                if(listadoNombre.Length == 5) {
                    segundonombre = listadoNombre[1] + " " + listadoNombre[2] + " " + listadoNombre[3] + " " + listadoNombre[4];
                }
                tperNatural.primernombre = primernombre;
                tperNatural.segundonombre = segundonombre;
                //Errores += " Nombre no válido";

                string apellido = camposBuscar.Find(x => x.atributo == "APELLIDOS").Mdatos["APELLIDOS"] != null ? camposBuscar.Find(x => x.atributo == "APELLIDOS").Mdatos["APELLIDOS"].ToString() : string.Empty;
                string[] listadoApellidos = apellido.Split(' ');
                string apellidopaterno, apellidomaterno = string.Empty;
                apellidopaterno = listadoApellidos[0];

                if(listadoApellidos.Length == 2) {
                    apellidomaterno = listadoApellidos[1];
                }

                if(listadoApellidos.Length == 3) {
                    if(listadoApellidos[0].Length <= 2) {
                        apellidopaterno = listadoApellidos[0] + " " + listadoApellidos[1] + " " + listadoApellidos[2];

                    }
                }

                if(listadoApellidos.Length == 4) {
                    if(listadoApellidos[0].Length <= 2) {
                        apellidopaterno = listadoApellidos[0] + " " + listadoApellidos[1] + " " + listadoApellidos[2];
                        apellidomaterno = listadoApellidos[3];
                    } else {
                        apellidomaterno = listadoApellidos[1] + " " + listadoApellidos[2] + " " + listadoApellidos[3];
                    }

                }

                if(listadoApellidos.Length == 5) {
                    apellidomaterno = listadoApellidos[1] + " " + listadoApellidos[2] + " " + listadoApellidos[3] + " " + listadoApellidos[4];
                }

                tperNatural.apellidopaterno = apellidopaterno;
                tperNatural.apellidomaterno = apellidomaterno;

                //Errores += " Apellido no válido";

                if(listadoNombre.Length > 1 && listadoApellidos.Length > 1) {
                    tperDetalle.nombre = apellidopaterno + " " + apellidomaterno + " " + primernombre + " " + segundonombre;
                } else if(listadoNombre.Length > 1) {
                    tperDetalle.nombre = apellidopaterno + " " + primernombre + " " + segundonombre;
                } else if(listadoApellidos.Length > 1) {
                    tperDetalle.nombre = apellidopaterno + " " + apellidomaterno + " " + primernombre;
                }

                //lTgenCargaCampos

                if(camposBuscar.Find(x => x.atributo == "FECHA NACIMIENTO").Mdatos["FECHA NACIMIENTO"] != null) {
                    formatofecha = camposBuscar.Find(x => x.atributo == "FECHA NACIMIENTO").formatofecha.ToString();
                    try {
                        DateTime fechanacimiento = DateTime.ParseExact(camposBuscar.Find(x => x.atributo == "FECHA NACIMIENTO").Mdatos["FECHA NACIMIENTO"].ToString(), formatofecha, CultureInfo.InvariantCulture);
                        tgenparametros parametros = TgenParametrosDal.Find("EDAD_MINIMA_SOCIO", 1);
                        Errores += ValidaFechaNacimiento(fechanacimiento, parametros);
                        if(fechanacimiento.Date > DateTime.Today) {
                            Errores += " Fecha de nacimiento no puede ser mayor a hoy";
                        } else {
                            tperNatural.fnacimiento = fechanacimiento;
                        }
                    } catch(Exception ex) {
                        Errores += " FECHA DE NACIMIENTO INCORRECTA: " + camposBuscar.Find(x => x.atributo == "FECHA NACIMIENTO").Mdatos["FECHA NACIMIENTO"].ToString();
                    }
                }

                List<tgencatalogodetalle> listadoEstadoCivil, listadoGenero = new List<tgencatalogodetalle>();
                TperNaturalDal dalN = new TperNaturalDal();
                listadoEstadoCivil = dalN.FindEstadoCivil(301);
                string estadocivil = camposBuscar.Find(x => x.atributo == "ESTADO CIVIL").Mdatos["ESTADO CIVIL"] != null ? camposBuscar.Find(x => x.atributo == "ESTADO CIVIL").Mdatos["ESTADO CIVIL"].ToString() : string.Empty;
                int i = 0;
                foreach(tgencatalogodetalle index in listadoEstadoCivil) {

                    if(index.clegal == estadocivil) {
                        tperNatural.estadocivilcdetalle = index.cdetalle;
                        i++;
                    }
                }
                if(i == 0) {
                    Errores += " Estado Civil no valido";
                }


                listadoGenero = dalN.FindGenero(302);
                string genero;
                genero = camposBuscar.Find(x => x.atributo == "GENERO").Mdatos["GENERO"] != null ? camposBuscar.Find(x => x.atributo == "GENERO").Mdatos["GENERO"].ToString() : string.Empty;
                tgencatalogodetalle = TgenCatalogoDetalleDal.FindByLegal(302, genero);
                if(tgencatalogodetalle == null) {
                    Errores += " Género no válido";
                } else {
                    tperNatural.genero = tgencatalogodetalle.cdetalle;
                    tperNatural.genero = tperNatural.genero.Substring(0, 1);
                }
                tperNatural.ccompania = 1;
                tperNatural.verreg = 0;

                tperNatural.Esnuevo = true;
                tperNatural.estadocivilccatalogo = 301;
                tperNatural.cnacionalidad = "ECU";

                tperDetalle.ccompania = 1;
                tperDetalle.verreg = 0;
                tperDetalle.optlock = 0;
                tperDetalle.veractual = 0;
                tperDetalle.Esnuevo = true;
                tperDetalle.espersonanatural = true;

                tperDetalle.tipoidentificaccatalogo = 303;
                tperDetalle.tipoidentificacdetalle =
                    "C";
                tperDetalle.tipodepersona = "N";
                tperDetalle.csocio = 1;
                tperDetalle.regimen = true;
                tperNatural.Esnuevo = true;
                tperDetalle.Esnuevo = true;
                tperNatural.optlock = 0;
                tperDetalle.optlock = 0;
                ListtperNatural.Add(tperNatural);
                ListtperDetalle.Add(tperDetalle);

                rqMantenimiento.AdicionarTabla("NATURAL", ListtperNatural, false);
                rqMantenimiento.AdicionarTabla("DETALLE", ListtperDetalle, false);

                #endregion Llenar Información General


                #region LLenar Socio

                if(camposBuscar.Find(x => x.atributo == "FECHA ALTA").Mdatos["FECHA ALTA"] != null) {
                    formatofechaalta = camposBuscar.Find(x => x.atributo == "FECHA ALTA").formatofecha.ToString();
                    try {
                        fechaAlta = DateTime.ParseExact(camposBuscar.Find(x => x.atributo == "FECHA ALTA").Mdatos["FECHA ALTA"].ToString(), formatofechaalta, CultureInfo.InvariantCulture);
                        if(fechaAlta.Date > DateTime.Today) {
                            Errores += " Fecha de Alta no puede ser mayor a hoy";
                        } else {
                            tsocCesantia.AddDatos("festado", fechaAlta);
                        }
                    } catch(Exception ex) {
                        Errores += " FECHA DE ALTA INCORRECTA" + camposBuscar.Find(x => x.atributo == "FECHA ALTA").Mdatos["FECHA ALTA"].ToString();
                    }

                }

                string ordenG = camposBuscar.Find(x => x.atributo == "ORDEN GENERAL").Mdatos["ORDEN GENERAL"] != null ? camposBuscar.Find(x => x.atributo == "ORDEN GENERAL").Mdatos["ORDEN GENERAL"].ToString() : string.Empty;
                if(ordenG != String.Empty) {
                    tsocCesantia.AddDatos("ordengen", ordenG);
                } else {
                    Errores += " Orden General obligatoria";
                }


                if(camposBuscar.Find(x => x.atributo == "FECHA ORDEN GENERAL").Mdatos["FECHA ORDEN GENERAL"] != null) {
                    formatofechaordegen = camposBuscar.Find(x => x.atributo == "FECHA ORDEN GENERAL").formatofecha.ToString();
                    try {
                        fordenG = DateTime.ParseExact(camposBuscar.Find(x => x.atributo == "FECHA ORDEN GENERAL").Mdatos["FECHA ORDEN GENERAL"].ToString(), formatofechaordegen, CultureInfo.InvariantCulture);
                        if(fordenG.Date > DateTime.Today) {
                            Errores += " Fecha Orden General no puede ser superior a hoy";
                        } else {
                            tsocCesantia.AddDatos("fordengen", fordenG);
                        }
                    } catch(Exception ex) {
                        Errores += " FECHA DE ORDEN GENERAL INCORRECTA: " + camposBuscar.Find(x => x.atributo == "FECHA ORDEN GENERAL").Mdatos["FECHA ORDEN GENERAL"].ToString();
                    }

                }

                if(fechaAlta.Date > fordenG.Date)
                    Errores += " Fecha de Alta no puede ser mayor a fecha de orden general";

                TsocTipoGradoDal grados = new TsocTipoGradoDal();
                long gradovalidar = camposBuscar.Find(x => x.atributo == "GRADO").Mdatos["GRADO"] != null ? long.Parse(camposBuscar.Find(x => x.atributo == "GRADO").Mdatos["GRADO"].ToString()) : 0;
                tsoctipogrado grado1 = TsocTipoGradoDal.Find(gradovalidar);

                if(grado1 == null) {
                    Errores += " Grado no valido";
                } else {
                    tsocCesantia.AddDatos("cgrado", camposBuscar.Find(x => x.atributo == "GRADO").Mdatos["GRADO"] != null ? long.Parse(camposBuscar.Find(x => x.atributo == "GRADO").Mdatos["GRADO"].ToString()) : 0);
                }

                string tipoPolicia = camposBuscar.Find(x => x.atributo == "TIPO POLICIA").Mdatos["TIPO POLICIA"].ToString();
                tsoctipopolicia tipo = TsocTipoPoliciaDal.FindToDescripcion(tipoPolicia);
                if(tipo == null) {
                    Errores += " Tipo de Policia no valido";
                } else {
                    tsocCesantia.ctipopolicia = tipo.ctipopolicia;
                }

                string ubicacionarchivo = camposBuscar.Find(x => x.atributo == "UNIDAD").Mdatos["UNIDAD"] != null ? camposBuscar.Find(x => x.atributo == "UNIDAD").Mdatos["UNIDAD"].ToString() : string.Empty;

                tsocCesantia.ccompania = 1;
                tsocCesantia.verreg = 0;
                tsocCesantia.ubicacionarchivo = ubicacionarchivo;
                tsocCesantia.AddDatos("cgradoactual", gradovalidar);
                tsocCesantia.AddDatos("cestadosocio", 1);
                tsocCesantia.AddDatos("ordengen", ordenG);
                tsocCesantia.AddDatos("festado", camposBuscar.Find(x => x.atributo == "FECHA ALTA").Mdatos["FECHA ALTA"].ToString());
                tsocCesantia.AddDatos("fformatoproceso", formatofechaalta);
                tsocCesantia.AddDatos("fordengen", camposBuscar.Find(x => x.atributo == "FECHA ORDEN GENERAL").Mdatos["FECHA ORDEN GENERAL"].ToString());
                tsocCesantia.AddDatos("fformatoordengen", formatofechaordegen);
                tsocCesantia.Esnuevo = true;
                tsocCesantia.ccatalogotipocargo = 101;
                tsocCesantia.optlock = 0;
                tsocCesantia.ccatalogotipoestado = 2703;
                tsocCesantia.ccdetalletipoestado = "ACT";
                ListtsocCesantia.Add(tsocCesantia);

                rqMantenimiento.AdicionarTabla("SOCIO", ListtsocCesantia, false);
                lstPersonaDireccion.Add(tperDireccion);
                rqMantenimiento.AdicionarTabla("DIRECCION", lstPersonaDireccion, false);
                #endregion Llenar Socio
                if(Errores == String.Empty) {
                    Mantenimiento.ProcesarAnidado(rqMantenimiento, 3, 1);
                    rqMantenimiento.Grabar();
                } else {
                    throw new AtlasException("0000", Errores);
                }
            } catch(Exception e) {

                //throw new SofiaException("0000", method + e.Message);
                throw new AtlasException("0000", e.Message);
            }

        }

        public string ValidaFechaNacimiento(DateTime fnacimiento, tgenparametros parametros) {
            string Errores = string.Empty;
            var fsistema = Fecha.GetFechaSistema();
            var finit = (fsistema.Year * 100 + fsistema.Month) * 100 + fsistema.Day;
            var ffin = (fnacimiento.Year * 100 + fnacimiento.Month) * 100 + fnacimiento.Day;
            var fres = (finit - ffin) / 10000;
            var edad = (int)parametros.numero;
            if(fres <= edad) {
                Errores = " FECHA DE NACIMIENTO " + fnacimiento + " DEBE SER MAYOR A " + edad + " AÑOS";
            }
            return Errores;
        }
    }
}