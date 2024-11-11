using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using modelo.interfaces;
using modelo.servicios;
using util.servicios.ef;
using modelo;
using System.Collections;
using util.dto.util;

namespace util {


    /// <summary>
    /// Clase que implementa metodos utilitarios de dto's.
    /// </summary>
    public class DtoUtil {
        private static tsegusuariodetalle tsegusuariodetalledal;


        /// <summary>
        /// Metodo que se encarga de cambiar el tipo de dato que llega desde la pantalla, al tipo de dato del objeto.
        /// </summary>
        /// <param name="lcampos">Objeto que contiene lista de campos del objeto.</param>
        /// <param name="nombreCampo">Nombre del campo a buscar en la lista de campo y obtener el tipo.</param>
        /// <param name="valor">Valor del campo a transformar al tipo de dato de la clase.</param>
        /// <returns>Object</returns>
        public static Object CambiarTipo(Type tipo, Object valor) {

            if (valor == null) {
                return valor;
            }
            if (tipo.FullName.Contains("String")) {
                valor = valor.ToString().Trim();
                return valor;
            }
            if (tipo.FullName.Contains("Int64")) {
                valor = Int64.Parse(valor.ToString());
                return valor;
            }
            if (tipo.FullName.Contains("Int")) {
                if (valor.ToString().Equals(""))
                    valor = null;
                else
                    valor = Int32.Parse(valor.ToString());
                return valor;
            }
            if (tipo.FullName.Contains("DateTime")) {
                if (valor is long) {
                    long l = (long)valor;
                    valor = (new DateTime(1970, 1, 1)).AddMilliseconds(l);
                } else {
                    valor = DateTime.Parse(valor.ToString());
                }
                return valor;
            }
            if (tipo.FullName.Contains("Boolean")) {
                valor = (bool)valor;
                return valor;
            }
            if (tipo.FullName.Contains("Decimal")) {
                valor = System.Convert.ToDecimal(valor);
                return valor;
            }
            if (tipo.FullName.Contains("TimeSpan"))
            {
                valor = System.TimeSpan.Parse(valor.ToString());
                return valor;
            }
            if (tipo.FullName.Contains("Byte[]") && valor.GetType().ToString().Contains("String"))
            {
                valor = System.Convert.FromBase64String(valor.ToString());
                return valor;
            }
            if (valor is IConvertible) {
                valor = Convert.ChangeType(valor, tipo);
                return valor;
            }
            // Pendiente revisar Date y DateTime

            return valor;
        }

        /// <summary>
        /// Entrega el Type de un campo de una clase.
        /// </summary>
        /// <param name="lcampos">Lista de campos de un Dto.</param>
        /// <param name="nombreCampo">Nombre del campo a buscar el tipo.</param>
        /// <returns>Type</returns>
        public static Type GetTipo(IEnumerable<FieldInfo> lcampos, string nombreCampo) {
            nombreCampo = nombreCampo.Replace("pk.", "");
            nombreCampo = nombreCampo.Replace("pk.", "");
            nombreCampo = nombreCampo.ToLower();
            foreach (var campo in lcampos) {
                Type tipo = campo.FieldType;
                string ncampo = campo.Name;
                ncampo = GetNombreCampo(ncampo);
                if (ncampo.Equals(nombreCampo)) {
                    return tipo;
                }
                ncampo = GetNombreCampo(ncampo);
            }
            return null;
        }

        public static string GetNombreCampo(string nombrecampo) {
            string resultado = nombrecampo.Split('>').First();
            resultado = resultado.Split('<').Last();
            return resultado;
        }

        /// <summary>
        /// Entrega una lista de objetos, que llegan desde el request, mas los objetos que de la base de datos 
        /// que no esten en la lista de eliminados y modificados.
        /// </summary>
        /// <param name="lbasedatos">Lista de registros que se enuentran almacenados en la base de datos.</param>
        /// <param name="lmodificados">Lista de regisrtros nuevos o modificados que llegan en el request.</param>
        /// <param name="leliminados">Lista de registros que se elimina.</param>
        /// <returns>List<IBean></returns>
        public static List<IBean> GetMergedList(List<IBean> lbasedatos, List<IBean> lmodificados, List<IBean> leliminados) {
            List<IBean> lmerge = new List<IBean>();
            // adiciona los registros nuevos y modificados que llegan desde el request.
            if (lmodificados != null) {
                lmerge.AddRange(lmodificados);
            }

            // Si los reistros de la base no estan entre los eliminados y los nuevos o modificados se adicionan a la lista.
            if (lbasedatos != null) {
                foreach (IBean obj in lbasedatos) {
                    if (!DtoUtil.ExistsInList(obj, leliminados) && !DtoUtil.ExistsInList(obj, lmodificados)) {
                        lmerge.Add(obj);
                    }
                }
            }
            return lmerge;
        }

        /// <summary>
        /// Verifica si un objeto esta en una lista de objetos, la comparacion se hace por llave primaria.<br>
        /// Para poder realizar la comparacion los objetos deben tener sobreescrito el metodo equals.
        /// </summary>
        /// <param name="obj">Objeto del mismo tipo de la lista a verificar que si esta o no en la lista.</param>
        /// <param name="ldata">Lista de objetos de tipo IBean</param>
        /// <returns>Boolean<IBean></returns>
        public static Boolean ExistsInList(IBean obj, List<IBean> ldata) {
            if (ldata == null || ldata.Count == 0) {
                return false;
            }
            Dictionary<string, string> objpk = GetCamposValoresPk(obj);
            foreach (IBean item in ldata) {
                Dictionary<string, string> itempk = GetCamposValoresPk(item);
                Boolean result = DtoUtil.CompararDictionary(objpk, itempk);
                if (result) {
                    return true;
                }
            }
            return false;
        }

        public static Boolean CompararDictionary(Dictionary<string, string> obj, Dictionary<string, string> objcompare) {
            if((obj == null && objcompare != null) || obj != null && objcompare == null ) {
                return false;
            }
            if (obj.Count() != objcompare.Count()) {
                return false;
            }
            foreach (string key in obj.Keys) {
                if (obj[key].ToString().CompareTo(objcompare[key].ToString()) != 0) {
                    return false;
                }
            }            
            return true;
        }

        /// <summary>
        /// Entrega el tipo de dato de un campo de una clase.
        /// </summary>
        /// <param name="campo">Objeto que contiene informacion de un campo de una clase.</param>
        /// <param name="nombreCampo">Nombre del campo a obetener el tipo.</param>
        /// <returns>Type</returns>
        public static Type GetTipo(FieldInfo campo, string nombreCampo) {
            Type tipo = campo.FieldType;
            string ncampo = GetNombreCampo(campo.Name);
            if (ncampo.Equals(nombreCampo)) {
                return tipo;
            }
            return null;
        }

        /// <summary>
        /// Entrega el Type de un campo de una clase.
        /// </summary>
        /// <param name="lcampos">Lista de campos de un Dto.</param>
        /// <param name="nombreCampo">Nombre del campo a buscar el tipo.</param>
        /// <returns>FieldInfo</returns>
        public static FieldInfo GetCampo(IBean IBean, string nombreCampo) {
            FieldInfo campo = null;
            IEnumerable<FieldInfo> lcampos = GetCampos(IBean);

            //busca campos no pk.
            foreach (FieldInfo item in lcampos) {
                string ncampo = DtoUtil.GetNombreCampo(item.Name);
                if (ncampo == nombreCampo) {
                    campo = item;
                    break;
                }
            }
            if (campo != null) {
                return campo;
            }

            if (campo == null) {
                throw new AtlasException("SER-008", "CAMPO: {0} NO EXISTE EN EL BEAN: {1}", nombreCampo, IBean.GetType().Name);
            }
            return campo;
        }

        /// <summary>
        /// Entrega el Type de un campo de una clase.
        /// </summary>
        /// <param name="lcampos">Lista de campos de un Dto.</param>
        /// <param name="nombreCampo">Nombre del campo a buscar el tipo.</param>
        /// <returns>FieldInfo</returns>
        public static FieldInfo GetCampo(IEnumerable<FieldInfo> lcampos, string nombreCampo) {
            FieldInfo campo = null;
            foreach (FieldInfo item in lcampos) {
                string ncampo = GetNombreCampo(item.Name);
                if (ncampo == nombreCampo) {
                    campo = item;
                    break;
                }
            }
            return campo;
        }

        /// <summary>
        /// Entrega el Type de un campo de una clase.
        /// </summary>
        /// <param name="lcampos">Lista de campos de un Dto.</param>
        /// <param name="nombreCampo">Nombre del campo a buscar el tipo.</param>
        /// <returns>FieldInfo</returns>
        public static FieldInfo GetCampoPk(IBeanId beanid, string nombreCampo) {
            FieldInfo campo = null;
            foreach (FieldInfo item in beanid.GetType().GetAllFields()) {
                string ncampo = GetNombreCampo(item.Name);
                if (ncampo == nombreCampo) {
                    campo = item;
                    break;
                }
            }
            if (campo == null) {
                throw new AtlasException("SER-008", "CAMPO: {0} NO EXISTE EN EL BEAN: {1}", campo, beanid.GetType().Name);
            }
            return campo;
        }

        /// <summary>
        /// Entrega una lista de campos de un Dto.
        /// </summary>
        /// <param name="_namespace">Namespace al que pertenece el Dto.</param>
        /// <param name="IBean">Nombre del Dto.</param>
        /// <returns>IEnumerable<FieldInfo></returns>
        public static IEnumerable<FieldInfo> GetCampos(string _namespace, string nombrebean) {
            nombrebean = _namespace + "." + nombrebean + "," + _namespace;
            Type t = Type.GetType(nombrebean);
            if (t.FullName.Contains("System.Data.Entity.DynamicProxies")) {
                t = t.BaseType;
            }
            IEnumerable<FieldInfo> lcampos = t.GetAllFields();
            return lcampos;
        }

        /// <summary>
        /// Entrega lista de campos de un bean.
        /// </summary>
        /// <param name="ibean">Objeto a obtener los campos.</param>
        /// <returns></returns>
        public static IEnumerable<FieldInfo> GetCampos(IBean ibean) {
            Type t = ((IBean)ibean).GetType();
            if (t.FullName.Contains("System.Data.Entity.DynamicProxies")) {
                t = t.BaseType;
            }
            IEnumerable<FieldInfo> lcampos = t.GetAllFields();
            return lcampos;
        }

        /// <summary>
        /// Entrega lista de campos SIN PK de un bean en una lista de String
        /// </summary>
        /// <param name="ibean">Objeto a obtener los campos.</param>
        /// <returns></returns>
        public static List<String> GetCamposSinPK(IBean ibean) {
            List<String> retorno = new List<String>();
            IEnumerable<FieldInfo> lcampos = GetCampos(ibean);
            foreach (FieldInfo campo in lcampos) {
                // no incluye campos de AbstractDto para el manejo de historicos.
                if (campo.DeclaringType.Name == "AbstractDto" || campo.FieldType.Name.Contains("ICollection") || campo.FieldType.FullName.Contains("modelo.")) {
                    continue;
                }
                string ncampo = GetNombreCampo(campo.Name);
                retorno.Add(ncampo);
            }
            return retorno;
        }

        /// <summary>
        /// Enterga un arreglo con nombre de campos de pk.
        /// </summary>
        /// <param name="ibean">Objeto a obtener los campos del pk.</param>
        /// <returns>string[]</returns>
        public static string[] GetCamposPk(IBean ibean) {
            EntityKeyHelper ekh = EntityKeyHelper.Instance;
            string[] keys = ekh.GetCamposPK(Sessionef.GetAtlasContexto(), ibean.GetType());
            return keys;
        }

        /// <summary>
        /// Entrega campos del pk con sus valores.
        /// </summary>
        /// <param name="ibean"></param>
        /// <returns></returns>
        public static Dictionary<string, string> GetCamposValoresPk(IBean ibean) {
            EntityKeyHelper ekh = EntityKeyHelper.Instance;
            Dictionary<string, string> keys = ekh.GetValoresPK(ibean, Sessionef.GetAtlasContexto(),  ibean.GetType());
            return keys;
        }

        /// <summary>
        /// Fija el valor de un campo en un objeto. Si valor del campo es diferente al del tipo del campo transforma el valor al tipo de dato del campo.
        /// </summary>
        /// <param name="IBean">Objeto a fijar el valor de un campo.</param>
        /// <param name="nombrecampo">Nombre del campo a fijar el valor.</param>
        /// <param name="valor">Valor a fijar en el campo del objeto.</param>
        public static void SetValorCampo(IBean bean, String nombrecampo, Object valor) {
            nombrecampo = nombrecampo.ToLower();
            FieldInfo campo = GetCampo(bean, nombrecampo);
            if (nombrecampo == "mdatos") {
                JObject a = (JObject)valor;
                valor = a.ToObject<Dictionary<String, Object>>();
            } else {
                Type tipo = GetTipo(campo, nombrecampo.Replace("pk.", ""));
                valor = CambiarTipo(tipo, valor);
            }
            if (nombrecampo.Contains("pk.")) {
                IBeanId beanid = (IBeanId)GetValorCampo(bean, "pk");
                campo.SetValue(beanid, valor);
            } else {
                campo.SetValue(bean, valor);
            }

        }

        /// <summary>
        /// Fija el valor de un campo en un objeto sin cambiar el tipo de dato.
        /// </summary>
        /// <param name="IBean">Objeto a fijar el valor de un campo.</param>
        /// <param name="nombrecampo">Nombre del campo a fijar el valor.</param>
        /// <param name="valor">Valor a fijar en el campo del objeto.</param>
        public static void SetValorCampoSinCambiarTipo(IBean bean, String nombrecampo, Object valor) {
            FieldInfo campo = GetCampo(bean, nombrecampo);
            if (nombrecampo.Contains("pk.")) {
                IBeanId beanid = (IBeanId)GetValorCampo(bean, "pk");
                campo.SetValue(beanid, valor);
            } else {
                campo.SetValue(bean, valor);
            }
        }

        /// <summary>
        /// Entrega el valor de un campo.
        /// </summary>
        /// <param name="bean">Objeto a obetener el valor de un campo.</param>
        /// <param name="nombrecampo">Nombre del campoa obtener el valor.</param>
        /// <returns>object</returns>
        public static object GetValorCampo(IBean bean, String nombrecampo) {
            if (nombrecampo.Contains("pk.")) {
                return GetValorCampoPk(bean, nombrecampo);
            }
            FieldInfo campo = GetCampo(bean, nombrecampo);
            return campo.GetValue(bean);
        }

        public static object GetValorCampoPk(IBean bean, String nombrecampo) {
            IBeanId beanid = (IBeanId)GetValorCampo(bean, "pk");
            if (beanid == null) { return null; }
            int j = nombrecampo.Length - 3;
            string ncampo = nombrecampo.Substring(3, j);
            FieldInfo campo = GetCampoPk(beanid, ncampo);
            return campo.GetValue(beanid);
        }

        /// <summary>
        /// Entrega el vsalor de un campo de un objeto que no es un Dto. Si no existe el campo retorna null.
        /// </summary>
        /// <param name="bean">Objecto a obtener el valor de un campo.</param>
        /// <param name="nombreCampo">Nombre del campo a obtener el valor.</param>
        /// <returns></returns>
        public static object GetValorCampoNoDto(object bean, String nombreCampo) {
            FieldInfo campo = null;
            IEnumerable<FieldInfo> lcampos = bean.GetType().GetAllFields();
            foreach (FieldInfo field in lcampos) {
                string ncampo = GetNombreCampo(field.Name);
                if (ncampo == nombreCampo) {
                    campo = field;
                    break;
                }
            }
            if (campo == null) {
                return null; // si no existe el campo retorna null.
            }
            return campo.GetValue(bean);
        }

        /// <summary>
        /// Compara si dos objetos tienen el mismo contenido.
        /// </summary>
        /// <param name="objectoUno"></param>
        /// <param name="objectoDos"></param>
        /// <returns></returns>
        public static bool Compare(object objectoUno, object objectoDos) {
            if (objectoUno == null && objectoDos == null) {
                return true;
            }
            if (objectoUno == null && objectoDos != null) {
                return false;
            }
            if (objectoUno != null && objectoDos == null) {
                return false;
            }
            Type t = objectoUno.GetType();
            if (!ExisteHerencia(t.BaseType.Name)) {
                t = t.BaseType;
            }
            IEnumerable<PropertyInfo> props = t.GetAllProperties();

            foreach (PropertyInfo prop in props) {
                if (prop is ICollection || prop.Name.Equals("optlock") || prop.Name.Equals("Idreg") || prop.Name.Equals("Actualizar") || prop.Name.Equals("Esnuevo") || prop.Name.Equals("Mdatos") || prop.Name.Equals("Mbce")) {
                    continue;
                }

                object datoUno = t.GetProperty(prop.Name).GetValue(objectoUno, null);
                object datoDos = t.GetProperty(prop.Name).GetValue(objectoDos, null);
                if (datoUno == null && datoDos == null) {
                    continue;
                }

                if ((datoUno == null && datoDos != null) || (datoUno != null && datoDos == null)) {
                    return false;
                }

                Type type = t.GetProperty(prop.Name).GetValue(objectoDos, null).GetType();

                if (prop.PropertyType.IsClass && !prop.PropertyType.FullName.Contains("System.String")) {
                    continue;
                } else if (!datoUno.Equals(datoDos)) {
                    return false;
                }

            }

            return true;

        }

        public static bool ExisteHerencia(string cadena) {
            if (cadena.Contains("AbstractDto") || cadena.Contains("Cuota") || cadena.Contains("Rubro") || cadena.Contains("Movimiento") || cadena.Contains("CuentaPorCobrar"))
                return true;
            return false;
        }

    }
}


