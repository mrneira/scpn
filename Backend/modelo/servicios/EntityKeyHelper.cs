using modelo.helper;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace modelo.servicios {
    public class EntityKeyHelper {
        private static readonly Lazy<EntityKeyHelper> LazyInstance = new Lazy<EntityKeyHelper>(() => new EntityKeyHelper());
        private readonly Dictionary<Type, string[]> _dict = new Dictionary<Type, string[]>();
        private EntityKeyHelper() { }

        public static EntityKeyHelper Instance {
            get { return LazyInstance.Value; }
        }

        private string[] GetKeyNames(AtlasContexto context, Type tipo) {

            Type t = tipo;
            //retreive the base type
            if (!ExisteHerencia(t.BaseType.Name)) {
                t = t.BaseType;
            }

            string[] keys;
            _dict.TryGetValue(t, out keys);
            if (keys != null) {
                return keys;
            }
            ObjectContext objectContext = ((IObjectContextAdapter)context).ObjectContext;
            //create method CreateObjectSet with the generic parameter of the base-type
            MethodInfo method = typeof(ObjectContext).GetMethod("CreateObjectSet", Type.EmptyTypes)
                                                     .MakeGenericMethod(t);
            dynamic objectSet = method.Invoke(objectContext, null);

            IEnumerable<dynamic> keyMembers = objectSet.EntitySet.ElementType.KeyMembers;
            string[] keyNames = keyMembers.Select(k => (string)k.Name).ToArray();
            _dict.Add(t, keyNames);
            return keyNames;
        }

        public static bool ExisteHerencia(string cadena) {
            if (cadena.Contains("AbstractDto") || cadena.Contains("Cuota") || cadena.Contains("Rubro") || cadena.Contains("Movimiento") || cadena.Contains("CuentaPorCobrar"))
                return true;
            return false;
        }

        public string[] GetCamposPK(AtlasContexto context, Type tipo) {
            var keyNames = GetKeyNames(context, tipo);
            return keyNames;
        }

        public Dictionary<string, string> GetValoresPK(IBean entity, AtlasContexto context, Type tipo) {
            var keyNames = GetKeyNames(context, tipo);
            Type type = tipo;
            Dictionary<string, string> mkey = new Dictionary<string, string>();
            foreach (string campo in keyNames) {
                object valor = type.GetProperty(campo).GetValue(entity, null);
                string val = valor == null ? null : valor.ToString();
                mkey[campo] = val;
            }
            return mkey;
        }

        public Dictionary<string, object> GetPK(IBean entity, AtlasContexto context, Type tipo) {
            var keyNames = GetKeyNames(context, tipo);
            Type type = tipo;
            Dictionary<string, object> mkey = new Dictionary<string, object>();
            foreach (string campo in keyNames) {
                string valor = type.GetProperty(campo).GetValue(entity, null).ToString();
                mkey[campo] = valor;
            }
            return mkey;
        }

    }
}
