using dal.generales;
using modelo;
using modelo.helper;
using modelo.interfaces;
using modelo.servicios;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using util;
using util.servicios.ef;
using util.thread;

namespace core.util {

    public class SecuenciaImp : ISecuencia {

        private String campoSecuencia = "secuencia";
        private String campoSecuenciaPk = "secuencia";
        /// <summary>
        /// Map que almacena los parametros de restricciones y sus datos con el cual se busca la maxima secuencia de un b ean en la base.
        /// </summary>
        private Dictionary<String, Object> mparametros = new Dictionary<String, Object>();
        /// <summary>
        /// Almacena la secuencia con la cual se obtiene la proxima secuencia con la cual se inserta el registro en la base.
        /// </summary>
        private String HQL = "";

        //private int? msecuencia = null;

        /// <summary>
        /// Metodo que fija el valor del atributo secuencia en el bean. Si el campo secuencia esta en null, obtiene el maximo de la base de datos
	    /// y fija el atributo con el valor que entrega la base de datos.
        /// </summary>
        /// <param name="bean">Objeto a fiajal el valor de la secuencia.</param>
        /// <param name="nombretabla">Nombre de la tabla o alias de la tabla.</param>
        /// <returns>bool</returns>
        public bool SetSecuencia(AbstractDto bean, string nombretabla, ref int isecuencial) {

            if (this.Validarcompeltasecuencia(bean) && SecuenciaImp.Validarnull(bean, this.campoSecuenciaPk)) {
                int? secuencia = SecuenciaImp.GetSecuenciaFromDatos(nombretabla);
                if (secuencia == null) {
                    this.ArmarSentecnia(bean);

                    secuencia = this.GetSecuencia();

                    if (secuencia == isecuencial) secuencia++;

                    isecuencial = secuencia.Value; 


                }
                SecuenciaImp.SetSecuenciaToDatos(nombretabla, secuencia);
                DtoUtil.SetValorCampo((IBean)bean, this.campoSecuenciaPk, secuencia);
                SecuenciaImp.AddSecuenciaToDatos(bean, nombretabla, secuencia, this.campoSecuenciaPk);
            }
            return this.Adicionacampospk(bean, nombretabla);
        }

        /// <summary>
        /// Busca la secuencia en el threadlocal.
        /// </summary>
        /// <param name="nombretabla">Nombre de la tabla o alias de la tabla.</param>
        /// <returns>int</returns>
        private static int? GetSecuenciaFromDatos(String nombretabla) {
            Object sec = null;
            string key = "maxsecuencia" + nombretabla;
            if (ThreadNegocio.GetDatos().Mdatos.ContainsKey(key)) {
                sec = ThreadNegocio.GetDatos().Mdatos[key];
            }
            if (sec == null) {
                return null;
            }
            return Int32.Parse(sec.ToString()) + 1;
        }

        /// <summary>
        /// Fija la secuencia de la tabla en ele threadlocal.
        /// </summary>
        /// <param name="nombretabla">Nombre de la tabla o alias de la tabla.</param>
        /// <param name="secuencia">Valor de la secuencia.</param>
        private static void SetSecuenciaToDatos(string nombretabla, int? secuencia) {
            string key = "maxsecuencia" + nombretabla;
            ThreadNegocio.GetDatos().Mdatos[key] = secuencia;
        }

        /// <summary>
        /// Fija la secuencia de la tabla en ele threadlocal.
        /// </summary>
        /// <param name="bean">Bean a adicionar secuencia.</param>
        /// <param name="nombretabla">Nombre de la tabla.</param>
        /// <param name="secuencia">Valor de la secuencia.</param>
        /// <param name="campoSecuenciaPk">Campo de secuencia dentro del pk.</param>
        private static void AddSecuenciaToDatos(AbstractDto bean, string nombretabla, int? secuencia, string campoSecuenciaPk) {
            List<Dictionary<string, object>> lsec = null;
            if (ThreadNegocio.GetDatos().Msecuencia.ContainsKey(nombretabla)) {
                lsec = (List<Dictionary<string, object>>)ThreadNegocio.GetDatos().Msecuencia[nombretabla];
            }

            if (lsec == null) {
                lsec = new List<Dictionary<string, object>>();
            }
            Dictionary<String, object> msec = new Dictionary<String, object> {
                ["idreg"] = bean.Idreg
            };
            String aux = campoSecuenciaPk.Replace(".", "_");
            if (secuencia != null) {
                msec[aux] = (int)secuencia;
            }
            lsec.Add(msec);
            ThreadNegocio.GetDatos().Msecuencia[nombretabla] = lsec;
        }

        /// <summary>
        /// Valida que el campo secuencia este en null.
        /// </summary>
        /// <param name="bean">Objeto a verificar que el campo secuencia este en null.</param>
        /// <returns>bool</returns>
        private bool Validarcompeltasecuencia(AbstractDto bean) {
            string beanName = EntityHelper.GetNombre((IBean)bean);
            tgenentidad te = TgenentidadDal.Find(beanName);
            if (te == null || !Constantes.EsUno(te.secautomatica)) {
                return false;
            }
            if (te.camposecuencia != null && !te.camposecuencia.Equals("")) {
                this.campoSecuencia = te.camposecuencia;
                this.campoSecuenciaPk = this.campoSecuencia;
            }
            return true;
        }

        /// <summary>
        /// Valida que el campo secuencia este en null.
        /// </summary>
        /// <param name="bean">Objeto a verificar que el campo secuencia este en null.</param>
        /// <param name="campoSecuenciaPk">Campo de pk</param>
        /// <returns>bool</returns>
        private static bool Validarnull(AbstractDto bean, String campoSecuenciaPk) {
            try {
                Object obj = DtoUtil.GetValorCampo((IBean)bean, campoSecuenciaPk);
                if (obj == null || (int.Parse(obj.ToString())) == 0) {
                    return true;
                }
                return false;
            } catch (Exception e) {
                e.GetBaseException();
                return false;
            }
        }

        /// <summary>
        /// Metodo que construye la sentencia jpql, con la cual se obtiene la maxima secuencia de la tabla dado el pk de la misma.
        /// </summary>
        /// <param name="bean">Bean a obtener la maxima secuencia.</param>
        private void ArmarSentecnia(AbstractDto bean) {
            FieldInfo fi = DtoUtil.GetCampo((IBean)bean, this.campoSecuencia.Replace("pk.", ""));
            Type tipo = DtoUtil.GetTipo(fi, this.campoSecuencia.Replace("pk.", ""));
            string[] keys = DtoUtil.GetCamposPk((IBean)bean);
            if (tipo.FullName.Contains("String")) {
                this.HQL = "select coalesce(max(convert(int," + this.campoSecuencia + ")),0)+1 as secuencia from " + bean.GetType().Name + " t";
            } else {
                this.HQL = "select coalesce(max( " + this.campoSecuencia + "), 0) + 1 as secuencia from " + bean.GetType().Name + " t";
            }

            bool first = true;
            foreach (String campo in keys) {
                String aux = campo.ToLower();
                if (aux.CompareTo(this.campoSecuenciaPk) == 0 || campo.Equals("verreg")) {
                    continue;
                }
                if (first) {
                    this.HQL = this.HQL + " where";
                    first = false;
                } else {
                    this.HQL = this.HQL + " and";
                }
                String param = aux.Substring(aux.IndexOf(".") + 1);
                this.HQL = this.HQL + " t." + aux + " = @" + param;
                Object value = DtoUtil.GetValorCampo((IBean)bean, aux);
                this.mparametros[param] = value;
            }
        }

        /// <summary>
        /// Busca la secuencia en la base de datos.
        /// </summary>
        /// <returns>int</returns>
        public int GetSecuencia() {
            object secuencia = 0;
            ConsultaHelper ch = new ConsultaHelper(Sessionef.GetAtlasContexto(), mparametros, this.HQL);
            string json = ch.EjecutarConsulta(false);
            Dictionary<String, Object> mdatos = JsonConvert.DeserializeObject<Dictionary<string, object>>(json);
            JArray a = (JArray)mdatos["resp"];
            IList<Dictionary<string, object>> ldatos = a.ToObject<IList<Dictionary<string, object>>>();
            foreach (Dictionary<String, Object> map in ldatos) {
                secuencia = map["secuencia"];
                break;
            }
            return Int32.Parse(secuencia.ToString());
        }

        /// <summary>
        /// Adiciona campos pk del bean, a la respuesta si esta definifo en la tgenentidad que retorna el pk.
        /// </summary>
        /// <param name="bean">Objeto que contiene una instancia del bean.</param>
        /// <param name="nombretabla">Alias de la tabla asociada al bean.</param>
        /// <returns>bool</returns>
        private bool Adicionacampospk(AbstractDto bean, string nombretabla) {
            string beanName = EntityHelper.GetNombre((IBean)bean);
            tgenentidad te = TgenentidadDal.Find(beanName);
            if (te == null || !Constantes.EsUno(te.retornapk)) {
                return false;
            }
            List<Dictionary<string, object>> lsec;
            if (ThreadNegocio.GetDatos().Msecuencia.ContainsKey(nombretabla)) {
                lsec = (List<Dictionary<string, object>>)ThreadNegocio.GetDatos().Msecuencia[nombretabla];
            } else {
                lsec = new List<Dictionary<string, object>>();
                ThreadNegocio.GetDatos().Msecuencia[nombretabla] = lsec;
            }

            Dictionary<String, Object> m = new Dictionary<String, Object> {
                ["idreg"] = bean.Idreg
            };
            string[] keys = DtoUtil.GetCamposPk((IBean)bean);
            foreach (String campo in keys) {
                string aux = campo.ToLower();               
                Object valor = DtoUtil.GetValorCampo((IBean)bean, aux);
                if (aux.CompareTo("verreg") == 0 && valor == null) {
                    valor = 0;
                }
                m[campo.Replace(".", "_")] = valor;
            }
            lsec.Add(m);
            return true;
        }

        //public bool SetSecuencia(AbstractDto bean, string nombretabla)
        //{
        //    throw new NotImplementedException();
        //}
    }
}
