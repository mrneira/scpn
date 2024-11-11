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

namespace core.util {

    public class VersionActualImp : IVersionActual {


        private String campoSecuencia = "secuencia";
        private bool tieneSecuencia = false;

        /// <summary>
        /// Map que almacena los parametros de restricciones y sus datos con el cual se busca la maxima secuencia de un b ean en la base.
        /// </summary>
        private Dictionary<String, Object> mparametros = new Dictionary<string, object>();

        /// <summary>
        /// Almacena la secuencia con la cual se obtiene la proxima secuencia con la cual se inserta el registro en la base.
        /// </summary>
        private String jpql = "";

        /// <summary>
        /// Obtiene el valor actual de la version del rwegistro.
        /// </summary>
        /// <param name="bean"></param>
        /// <returns></returns>
        public int GetVersionActual(AbstractDto bean) {
            int veractual = 0;
            this.LlenarCampoSecuencia(bean);
            this.ArmarSentecnia(bean);
            if (!tieneSecuencia) {
                veractual = this.GetValorActual();
            }
            if (veractual.CompareTo(0) == 0) {
                return 0;
            }
            return veractual;
        }

        /// <summary>
        /// Busca la secuencia en la base de datos.
        /// </summary>
        /// <returns></returns>
        public int GetValorActual() {
            object verreg = 0;
            ConsultaHelper ch = new ConsultaHelper(Sessionef.GetAtlasContexto(), mparametros, this.jpql);
            string json = ch.EjecutarConsulta(false);
            Dictionary<String, Object> mdatos = JsonConvert.DeserializeObject<Dictionary<string, object>>(json);
            JArray a = (JArray)mdatos["resp"];
            IList<Dictionary<string, object>> ldatos = a.ToObject<IList<Dictionary<string, object>>>();
            foreach (Dictionary<String, Object> map in ldatos) {
                verreg = map["version"];
            }
            return Int32.Parse(verreg.ToString());

        }

        /// <summary>
        /// Metodo que construye la sentencia jpql, con la cual se obtiene la maxima secuencia de la tabla dado el pk de la misma.
        /// </summary>
        /// <param name="bean"></param>
        private void ArmarSentecnia(AbstractDto bean) {
            EntityKeyHelper ekh = EntityKeyHelper.Instance;
            IBean ibean = (IBean)bean;
            Dictionary<string, object> pk = ekh.GetPK(ibean, Sessionef.GetAtlasContexto(), ibean.GetType());
            string tabla = EntityHelper.GetNombre((IBean)bean);
            this.jpql = "select coalesce(max( verreg ), 0) as version from " + tabla + " t";

            bool first = true;
            foreach (string campo in pk.Keys) {
                String aux = campo;
                if (aux.CompareTo(this.campoSecuencia) == 0) {
                    tieneSecuencia = true;
                    continue;
                }
                if (aux.Equals("verreg") || aux.Equals("optlock")) {
                    continue;
                }
                if (first) {
                    this.jpql = this.jpql + " where";
                    first = false;
                } else {
                    this.jpql = this.jpql + " and";
                }
                this.jpql = this.jpql + " t." + aux + " = @" + aux;
                Object value = pk[campo];
                if (aux.Equals("verreg") && value == null) {
                    value = 0;
                }
                this.mparametros[aux] = value;
            }
        }

        /// <summary>
        /// Obtiene el campo de secuencia para el bean.
        /// </summary>
        /// <param name="bean">Objeto a obtener campo secuencia.</param>
        private void LlenarCampoSecuencia(AbstractDto bean) {
            string beanName = EntityHelper.GetNombre((IBean)bean);
            tgenentidad te = TgenentidadDal.Find(beanName);
            if (te == null) {
                return;
            }
            if (te.camposecuencia != null && !te.camposecuencia.Equals("")) {
                this.campoSecuencia = te.camposecuencia;
                this.campoSecuencia.Replace("pk.", "");
            }
        }
    }
}
