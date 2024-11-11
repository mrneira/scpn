using modelo.helper;
using modelo.interfaces;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Runtime.Remoting;
using System.Text;
using System.Threading.Tasks;

namespace modelo.servicios {

    /// <summary>
    /// Clase utilitaria que se encarga de ejecutar sql en la base de datos.
    /// </summary>
    public class ConsultaHelper {

        private AtlasContexto contexto;
        private Dictionary<string, object> parametros;
        private string sqloriginal;
        private string sql;
        public int pagina { get; set; }
        public int registrosporpagina { get; set; }

        public ConsultaHelper (AtlasContexto contexto, Dictionary<string, object> parametros, string sql) {
            this.contexto = contexto;
            this.parametros = parametros;
            this.sqloriginal = sql;
            if (!sqloriginal.ToLower().Contains("order by")) {
                this.sqloriginal = this.sqloriginal + " order by 1";
            }
        }

        /// <summary>
        /// Consulta y entrega una lista de de registros.
        /// </summary>
        /// <param name="nombreBean">Nombre del dto.</param>
        /// <param name="sql">Sentencia sql a ejecutar incluye subqueries, order by y parametros</param>
        /// <param name="parametros">Parametros a utilizar en la consulta.</param>
        /// <param name="lcampos">Lista de campos de subquieries.</param>
        /// <returns>List<IBean></returns>
        public List<IBean> GetRegistros(String nombreBean, List<string> lcampos) {
            string json = this.EjecutarConsulta(true);
            return this.GetBeans(nombreBean, json, lcampos);
        }

        public IList<Dictionary<string, object>> GetRegistroDictionary() {
            string json = this.EjecutarConsulta(false);
            Dictionary<String, Object> mdatos = JsonConvert.DeserializeObject<Dictionary<string, object>>(json);
            JArray a = (JArray)mdatos["resp"];
            IList<Dictionary<string, object>> ldatos = a.ToObject<IList<Dictionary<string, object>>>();
            return ldatos;
        }

        public IList<Dictionary<string, object>> GetRegistrosDictionary() {
            string json = this.EjecutarConsulta(true);
            Dictionary<String, Object> mdatos = JsonConvert.DeserializeObject<Dictionary<string, object>>(json);
            if(mdatos == null) {
                return new List<Dictionary<string, object>>();
            }
            JArray a = (JArray)mdatos["resp"];
            IList<Dictionary<string, object>> ldatos = a.ToObject<IList<Dictionary<string, object>>>();
            return ldatos;
        }

        /// <summary>
        /// Consulta y entrega un IBean.
        /// </summary>
        /// <param name="nombreBean">Nombre del dto.</param>
        /// <param name="sql">Sentencia sql a ejecutar incluye subqueries, order by y parametros</param>
        /// <param name="parametros">Parametros a utilizar en la consulta.</param>
        /// <param name="lcampos">Lista de campos de subquieries.</param>
        /// <returns>IBean</returns>
        public IBean GetRegistro(String nombreBean, List<string> lcampos) {
            string json = this.EjecutarConsulta(false);
            List<IBean> lregistros = this.GetBeans(nombreBean, json, lcampos);
            if (lregistros.Count() > 0) {
                return lregistros.ElementAt<IBean>(0);
            }
            else
            {
                return null;
            }
        }

        /// <summary>
        /// Ejecuta una senetencia en la base de datos y entrega el resultado en un json.
        /// </summary>
        /// <param name="sql">Sentencia sql a ejecutar incluye subqueries, order by y parametros</param>
        /// <param name="parametros">Parametros a utilizar en la consulta.</param>
        /// <returns>string</returns>
        public string EjecutarConsulta(bool eslista) {
            string json = string.Empty;
            var sqlparam = new SqlParameter[parametros.Count];
            int i = 0;
            foreach (string key in parametros.Keys) {
                SqlParameter p = new SqlParameter(key, parametros[key]);
                sqlparam[i] = p;
                i++;
            }
            this.sql = this.sqloriginal;
            if (eslista) {
                
                int numreg = this.registrosporpagina == 0 ? 10 : this.registrosporpagina;
                
                this.sql = this.sqloriginal + " OFFSET " + (this.pagina) + " ROWS FETCH NEXT " + numreg + " ROWS ONLY";
            }
            var resp = contexto.Database.SqlQuery<string>(sql + " for json path , root('resp'), INCLUDE_NULL_VALUES", sqlparam).ToList();
            string[] pruebax = new string[resp.Count];
            if (resp.Count > 0) {
                foreach (var y in resp.ToArray()) {
                    json += y;
                }
            }
            return json;
        }

        /// <summary>
        /// Entrega una lista de IBean, crea instancias del bean y fija datos.
        /// </summary>
        /// <param name="nombreBean">Nombre del dto.</param>
        /// <param name="json">Json resultado de la base de datos.</param>
        /// <param name="lcampos">Lista de campos de sunqueries.</param>
        /// <returns>List<IBean></returns>
        private List<IBean> GetBeans(String nombreBean, string json, List<string> lcampos) {
            List<IBean> lregistros = new List<IBean>();
            if (string.IsNullOrEmpty(json)) {
                return lregistros;
            }
            Dictionary<String, Object> mdatos = JsonConvert.DeserializeObject<Dictionary<string, object>>(json);
            JArray a = (JArray)mdatos["resp"];
            IList<Dictionary<string, object>> ldatos = a.ToObject<IList<Dictionary<string, object>>>();
            foreach (Dictionary<String, Object> map in ldatos) {
                IBean bean = this.GetBean(nombreBean, map, lcampos);
                lregistros.Add(bean);
            }
            return lregistros;
        }

        /// <summary>
        /// Crea una instancia de IBean, fija datos en el objeto completa campos de control en mcampos.
        /// </summary>
        /// <param name="nombreBean">Nombre del dto.</param>
        /// <param name="mregistro">Objeto que contiene la informacion de los campos resultados de la consulta en la base de datos.</param>
        /// <param name="lcampos">Lista de campos de sunqueries.</param>
        /// <returns>IBean</returns>
        private IBean GetBean(String nombreBean, Dictionary<String, Object> mregistro, List<string> lcampos) {
            IBean bean = EntityHelper.GetIBeanInstance(nombreBean);
            AbstractDto abean = (AbstractDto)bean;
            var j = JsonConvert.SerializeObject(mregistro);
            JsonConvert.PopulateObject(j, bean);
            foreach (var campo in lcampos) {
                object valor = mregistro[campo];
                abean.AddDatos(campo, valor);
            }
            return bean;

        }



    }

}
