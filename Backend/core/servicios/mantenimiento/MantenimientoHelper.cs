using core.servicios.consulta;
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
using System.Runtime.Remoting;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.consulta;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace core.servicios.mantenimiento {

    public class MantenimientoHelper {

        private RqMantenimiento rqMantenimiento;

        public void LlenaDtoMantenimiento(Dictionary<String, Object> mdatos, RqMantenimiento rqMantenimiento) {
            this.rqMantenimiento = rqMantenimiento;
            foreach (var key in mdatos.Keys) {
                if (!(mdatos[key] is Newtonsoft.Json.Linq.JObject)) {
                    object valor = mdatos[key];
                    this.rqMantenimiento.Mdatos[key] = valor;
                    continue;
                }
                JObject a = (JObject)mdatos[key];
                Dictionary<String, Object> mdatosBean = a.ToObject<Dictionary<String, Object>>();
                this.AddTabla(key, mdatosBean);
            }
        }

        private void AddTabla(String alias, Dictionary<String, Object> mdatos) {
            Tabla tabla = new Tabla(alias);
            tabla.EnviarSP = false;
            if (mdatos.ContainsKey("enviarSP") && (bool)mdatos["enviarSP"]) {
                tabla.EnviarSP = true;
            }
            // Order de grabado de datos en la base.
            Object pos = mdatos["pos"];
            if (pos != null) {
                int i = Int32.Parse(pos.ToString()) - 1;
                VerificarCapacidad(this.rqMantenimiento.Lorden, i);
                if (i > this.rqMantenimiento.Lorden.Count) {
                    i = this.rqMantenimiento.Lorden.Count;
                }
                this.rqMantenimiento.Lorden.Insert(i, alias);
            } else {
                this.rqMantenimiento.Lorden.Add(alias);
            }
            tabla.AddEliminados(this.CompletarObjectos(mdatos, "del", false, alias));
            tabla.AddInsertados(this.CompletarObjectos(mdatos, "ins", false, alias));
            tabla.AddModificados(this.CompletarObjectos(mdatos, "upd", true, alias));
            this.rqMantenimiento.Mtablas.Add(alias, tabla);
        }

        private void VerificarCapacidad(List<string> lorden, int pos) {
            if (pos > this.rqMantenimiento.Lorden.Count) {
                for (var c = this.rqMantenimiento.Lorden.Count + 1; c <= pos; c++) {
                    this.rqMantenimiento.Lorden.Add(null);
                }
            }
        }

        private List<IBean> CompletarObjectos(Dictionary<String, Object> mdatos, String criterio, bool isupdate, String tabla) {
            List<IBean> lIBeans = new List<IBean>();
            JArray a = (JArray)mdatos[criterio];
            IList<Dictionary<string, object>> ldatos = a.ToObject<IList<Dictionary<string, object>>>();

            if (ldatos == null || ldatos.Count <= 0) {
                return lIBeans;
            }

            bool esform = !mdatos.ContainsKey("esform") ? false : (bool)mdatos["esform"];
            foreach (Dictionary<String, Object> map in ldatos) {
                String nombreBean = mdatos["bean"].ToString();

                // En mantenimiento se ecesita el IBean para obtener el pk y leer el registro de la base.
                IBean IBean = GetIBeanInstance(nombreBean);
                // En el mantenimiento se cambia el IBean por el de la base y se completa datos del rq.
                IBean = this.MapToObjeto(IBean, map, isupdate, tabla, nombreBean, criterio);
                ((AbstractDto)IBean).AddDatos("esform", esform);
                lIBeans.Add(IBean);
            }
            return lIBeans;
        }

        private IBean GetIBeanInstance(String nombreBean) {
            tgenentidad entidad = TgenentidadDal.Find(nombreBean);
            ObjectHandle handle = Activator.CreateInstance("modelo", "modelo." + nombreBean);
            IBean b = (IBean)handle.Unwrap();
            return b;
        }

        private IBean MapToObjeto(IBean bean, Dictionary<String, Object> map, bool isupdate, String tabla, String nombreBean, String criterio) {
            var json = JsonConvert.SerializeObject(map);
            JsonConvert.PopulateObject(json, bean);

            // Valida optlock cuando es delete
            if (criterio != null && criterio.CompareTo("del") == 0) {
                IBean beanbase = this.GetBeanBase(bean, nombreBean);
                if (map.ContainsKey("optlock")) {
                    ValidaOptlocking(map["optlock"], beanbase);
                }
            }

            // Eso se hace solo si es un update.
            if (isupdate && bean is AbstractDto) {
                // si es update y es de tipo trnsaporte de flip
                bean = this.Merge(bean, map, tabla, nombreBean);
            }
            return bean;
        }

        private IBean Merge(IBean bean, Dictionary<String, Object> map, String tabla, String nombreBean) {
            IBean beanbase = this.GetBeanBase(bean, nombreBean);
            AbstractDto boriginal = (AbstractDto)beanbase.Clone(); // Clona con los datos de la base para el registro de auditoria.
            foreach (String key in map.Keys) {
                if (key.CompareTo("idreg") == 0 || key.CompareTo("pk") == 0) {
                    continue;
                }
                Object valor = map[key];
                if (key.Equals("optlock")) {
                    ValidaOptlocking(map[key], beanbase);
                    valor = long.Parse(valor.ToString()) + 1; //Se suma al optlock en los mantenimientos.
                }
                if (valor is IBeanId) {
                    continue;
                }
                DtoUtil.SetValorCampo(beanbase, key, valor);
            }
            // va aqui porque en el for anterior se fija el valor de mdatos que llega desde la pantalla.
            ((AbstractDto)beanbase).AddDatos("BEANORIGINAL", boriginal);
            return beanbase;
        }

        private IBean GetBeanBase(IBean bean, string nombreBean) {
            EntityKeyHelper ekh = EntityKeyHelper.Instance;
            Type tipo = bean.GetType();
            Dictionary<string, string> pk = ekh.GetValoresPK(bean, Sessionef.GetAtlasContexto(), tipo);
            Object beanbase = MotorConsulta.Consultar(nombreBean, pk);
            if (beanbase == null) {
                // Si no encuentra un registro a modificar en la base, esta cambiando el pk, o el registro tiene que llegar como un insert
                throw new AtlasException("SER-001", "TABLA NO PERMITE ACTUALIZAR EL PK: {0}", bean.GetType().Name);
            }
            return (IBean)beanbase;
        }

        private static void ValidaOptlocking(Object opplockrequest, IBean IBeanbase) {
            Object optlockorig = DtoUtil.GetValorCampo(IBeanbase, "optlock");
            if (!opplockrequest.Equals(optlockorig)) {
                // Si la version del registro original es diferente el usuario tiene que reconsultar los datos.
                throw new AtlasException("SER-006", "DATOS DE LA TABLA: {0} MODIFICADOS EN OTRA SESSION RECONSULTE LOS DATOS", IBeanbase.GetType().Name);
            }
        }
    }

}
