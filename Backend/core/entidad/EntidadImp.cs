using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using modelo.interfaces;
using util.interfaces;
using modelo;
using dal.generales;
using util;

namespace core.entidad {

    public class EntidadImp : IVersionRegistro {

        public bool IsVersionReg(IBean bean) {
            Type t = bean.GetType();
            //retreive the base type
            if (!ExisteHerencia(t.BaseType.Name)) {
                t = t.BaseType;
            }

            string beanName = t.Name;
            tgenentidad te = TgenentidadDal.Find(beanName);
            return Constantes.EsUno(te.versionreg);

        }

        public static bool ExisteHerencia(string cadena) {
            if (cadena.Contains("AbstractDto") || cadena.Contains("Cuota") || cadena.Contains("Rubro") || cadena.Contains("Movimiento") || cadena.Contains("CuentaPorCobrar"))
                return true;
            return false;
        }
    }
}
