
using dal.generales;
using modelo;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Reflection;
using System.Text.RegularExpressions;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace general.archivos {

    /// <summary>
    /// Clase que se encarga de procesar una línea de un archvio, fija los datos de cada campo en TgenCargaCampos.
    /// </summary>
    public class RegistroHelper :Linea {
        /// <summary>
        /// Objeto que contien la cabecera de ejecucion de un archivo.
        /// </summary>
        private tgencargaarchivo tgenCargaArchivo;

        /// <summary>
        /// Objeto que contiene la definicion de la estrutura de campos un registro a cargar.
        /// </summary>
        private IList<tgencargacampos> lTgenCargaCampos;

        /// <summary>
        /// Crea una instancia de RegistroHelper.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        /// <param name="numlinea">Numero de linea del archivo.</param>
        /// <param name="registro">Objeto que contiene datos de una linea del archivo.</param>
        public RegistroHelper(RqMantenimiento rqmantenimiento, int numlinea, string datosRegistro, int cmodulo, int ctipoarchivo) : base(rqmantenimiento, numlinea, datosRegistro, cmodulo, ctipoarchivo) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tgenCargaArchivo = TgenCargaArchivoDal.Find(cmodulo, ctipoarchivo);
            lTgenCargaCampos = TgenCargaCamposDal.Find(cmodulo, ctipoarchivo);
        }

        public IList<tgencargacampos> CompletarValorCampo() {
            // Lena en una lista los campos del string.
            //string method = string.Format("{0}.{1}", MethodBase.GetCurrentMethod().DeclaringType.FullName, MethodBase.GetCurrentMethod().Name);
            List<object> lcampos = this.LineaToList();
            IList<tgencargacampos> lcamposFInal = new List<tgencargacampos>();
            int i = 0;
            foreach(object valor in lcampos) {
                try {
                    tgencargacampos campo = (tgencargacampos)lTgenCargaCampos.ElementAt(i).Clone();
                    this.CompletarValorCampo(valor, campo);
                    i++;
                    lcamposFInal.Add(campo);
                } catch(Exception e) {
                    throw new AtlasException("0000", e.Message + "\n");
                }

                //catch (ArgumentOutOfRangeException) {
                //    throw new SofiaException("REG-023", "TGENARCHIVOS NO TIENE DEFINIDO TODOS LOS CAMPOS QUE LLEGAN EN EL ARCHIVO");
                //}


            }
            return lcamposFInal;
        }

        /// <summary>
        /// Entrega una lista de valores de campos en el orden en que estan los datos en el archivo, cada valor se obtiene por separador.
        /// </summary>
        /// <param name="separator"></param>
        /// <returns></returns>
        private List<object> LineaToList() {
            if(!(bool)this.tgenCargaArchivo.tieneseparador) {
                // Implementar por posicion.
            }
            List<object> lcampos = new List<object>();
            String separador = this.tgenCargaArchivo.separadorcolumnas;
            string[] camops = this.DatosRegistro.Split(Convert.ToChar(separador));// Regex.Split(this.DatosRegistro, separador);
            foreach(string campo in camops) {
                lcampos.Add(campo);
            }
            return lcampos;
        }

        private void CompletarValorCampo(object valor, tgencargacampos tgenCargaCampos) {
            // string method = string.Format("{0}.{1}", MethodBase.GetCurrentMethod().DeclaringType.FullName, MethodBase.GetCurrentMethod().Name);
            try {
                object val = this.GetValor(valor, tgenCargaCampos.atributo, tgenCargaCampos.tipodato, tgenCargaCampos.formatofecha, tgenCargaCampos.longitud);
                if(val == null || val.Equals(""))
                    if((bool)tgenCargaCampos.requerido) {
                        tgenCargaCampos.Mdatos[tgenCargaCampos.atributo] = null;
                        throw new AtlasException("0000", "(" + tgenCargaCampos.atributo + ") ES OBLIGATORIO ");
                    }
                tgenCargaCampos.Mdatos[tgenCargaCampos.atributo] = val;
            } catch(Exception e) {

                throw new AtlasException("0000", e.Message);
            }

        }

        private Object GetValor(object valor, string atributo, string datatype, string formatofecha, int? longitud) {
            Object auxValue = (Object)valor;
            string method = string.Format("{0}.{1}", MethodBase.GetCurrentMethod().DeclaringType.FullName, MethodBase.GetCurrentMethod().Name);
            if((valor == null) || valor.Equals("")) {
                return null;
            }

            DateTime parsedDate;
            try {
                if(datatype.CompareTo("String") == 0 && valor.ToString().Length <= longitud) {
                    auxValue = valor.ToString().Trim();
                } else if(datatype.CompareTo("String") == 0 && valor.ToString().Length > longitud) {
                    throw new AtlasException("0000", string.Format("Texto demasiado grande: " + atributo + " VALOR:" + valor + " REGISTRO: " + this.NumLinea) + "Tamaño Requerido:" + longitud.ToString());
                }
                if(datatype.CompareTo("Int") == 0) {
                    int result;
                    bool boolresult;
                    string str = "int";
                    boolresult = Int32.TryParse(valor.ToString(), out result);
                    if(boolresult) {
                        auxValue = result;
                    } else {
                        throw new AtlasException("0000", string.Format("Campo parametrizado como " + str + " : " + valor.ToString() + "NO TIENE EL FOTMATO CORRECTO"));
                    }

                } else if(datatype.CompareTo("Long") == 0) {
                    long result;
                    bool boolresult;
                    string str = "long";
                    boolresult = long.TryParse(valor.ToString(), out result);
                    if(boolresult) {
                        auxValue = result;
                    } else {
                        throw new AtlasException("0000", string.Format("Campo parametrizado como " + str + " : " + valor.ToString() + "NO TIENE EL FOTMATO CORRECTO"));
                    }
                } else if(datatype.CompareTo("Decimal") == 0) {
                   // auxValue = Convert.ToDecimal(valor);
                    decimal result;
                    bool boolresult;
                    string str = "decimal";
                    boolresult = decimal.TryParse(valor.ToString(), out result);
                    if(boolresult) {
                        auxValue = result;
                    } else {
                        throw new AtlasException("0000", string.Format("Campo parametrizado como " + str + " : " + valor.ToString() + "NO TIENE EL FOTMATO CORRECTO"));
                    }
                } else if(datatype.CompareTo("Date") == 0) {
                    if(!string.IsNullOrEmpty(formatofecha)) {
                        if(valor.ToString().Length == 10) {
                            if(formatofecha == "dd/mm/yyyy") {
                                string dia = valor.ToString().Substring(0, 2);
                                if(Convert.ToInt32(dia) > 31) {
                                    throw new AtlasException("REG-026", string.Format("FORMATO DE FECHA INCORRECTO dia: " + atributo + " VALOR:" + valor + " REGISTRO: " + this.NumLinea));
                                }
                                string mes = valor.ToString().Substring(3, 2);
                                if(Convert.ToInt32(mes) > 12) {
                                    throw new AtlasException("REG-026", string.Format("FORMATO DE FECHA INCORRECTO mes: " + atributo + " VALOR:" + valor + " REGISTRO: " + this.NumLinea));
                                }
                                string anio = valor.ToString().Substring(6, 4);
                                DateTime resultado = new DateTime(Convert.ToInt32(anio), Convert.ToInt32(mes), Convert.ToInt32(dia));

                            }
                            if(formatofecha == "mm/dd/yyyy") {
                                string dia = valor.ToString().Substring(3, 2);
                                if(Convert.ToInt32(dia) > 31) {
                                    throw new AtlasException("REG-026", string.Format("FORMATO DE FECHA INCORRECTO dia:" + atributo + " VALOR:" + valor + " REGISTRO: " + this.NumLinea));
                                }
                                string mes = valor.ToString().Substring(0, 2);
                                if(Convert.ToInt32(mes) > 12) {
                                    throw new AtlasException("REG-026", string.Format("FORMATO DE FECHA INCORRECTO mes:" + atributo + " VALOR:" + valor + " REGISTRO: " + this.NumLinea));
                                }
                                string anio = valor.ToString().Substring(6, 4);
                                DateTime resultado = new DateTime(Convert.ToInt32(anio), Convert.ToInt32(mes), Convert.ToInt32(dia));

                            }
                            if(formatofecha == "yyyy/mm/dd") {
                                string dia = valor.ToString().Substring(7, 2);
                                if(Convert.ToInt32(dia) > 31) {
                                    throw new AtlasException("REG-026", string.Format("FORMATO DE FECHA INCORRECTO dia: " + atributo + " VALOR:" + valor + " REGISTRO: " + this.NumLinea));
                                }
                                string mes = valor.ToString().Substring(5, 2);
                                if(Convert.ToInt32(mes) > 12) {
                                    throw new AtlasException("REG-026", string.Format("FORMATO DE FECHA INCORRECTO mes: " + atributo + " VALOR:" + valor + " REGISTRO: " + this.NumLinea));
                                }
                                string anio = valor.ToString().Substring(0, 4);
                                DateTime resultado = new DateTime(Convert.ToInt32(anio), Convert.ToInt32(mes), Convert.ToInt32(dia));

                            }
                        } else {
                            throw new AtlasException("REG-026", string.Format("No contiene los 10 digitos requeridos en fecha " + atributo + " VALOR:" + valor + " REGISTRO: " + this.NumLinea));
                        }
                    } else
                        throw new AtlasException("REG-026", string.Format("FORMATO DE FECHA INCORRECTO NO HAY FECHA: " + atributo + " VALOR:" + valor + " REGISTRO: " + this.NumLinea));

                }
            } catch(Exception e) {
                throw new AtlasException("REG-026", e.Message);
            }
            return auxValue;
        }

    }
}
