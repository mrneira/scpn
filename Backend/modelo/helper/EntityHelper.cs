using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Remoting;
using System.Text;
using System.Threading.Tasks;

namespace modelo.helper {

    public class EntityHelper {

        /// <summary>
        /// Crea y entrega una instancia de IBean.
        /// </summary>
        /// <param name="nombreBean">Nombre del dto.</param>
        /// <returns>IBean</returns>
        public static IBean GetIBeanInstance(String nombreBean) {
            ObjectHandle handle = Activator.CreateInstance("modelo", "modelo." + nombreBean);
            IBean b = (IBean)handle.Unwrap();
            return b;
        }

        public static string GetNombre(IBean bean) {
            Type t = bean.GetType();
            string nombre = t.Name;
            if (!ExisteHerencia(t.BaseType.Name)) {
                t = t.BaseType;
                nombre = t.Name;
            }
            return nombre;
        }


        public static bool ExisteHerencia(string cadena) {
            if (cadena.Contains("AbstractDto") || cadena.Contains("Cuota") || cadena.Contains("Rubro") || cadena.Contains("Movimiento") || cadena.Contains("CuentaPorCobrar"))
                return true;
            return false; 
        }

        public static void SetActualizar(IBean bean) {
            if (bean == null) {
                return;
            }
            AbstractDto obj = (AbstractDto)bean;
            if(!obj.Actualizar) {
                obj.Actualizar = true;
            }
            
            if (obj.GetDatos("BEANORIGINAL") == null) {
                IBean beanoriginal = (IBean)bean.Clone();
                obj.AddDatos("BEANORIGINAL", beanoriginal);
            }
        }

        public static void SetActualizar(List<IBean> lbean) {
            if(lbean.Count <= 0) {
                return;
            }
            foreach (IBean bean in lbean) {
                EntityHelper.SetActualizar(bean);
            }
        }
        

    }

}
