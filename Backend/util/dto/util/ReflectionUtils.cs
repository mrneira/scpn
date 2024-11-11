using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Reflection;

namespace util {
    /// <summary>
    /// Clase utilitaria que entrega informacion de una clase.
    /// </summary>
    public static class ReflectionUtils {

        /// <summary>
        /// Entrega todos los campos de la clase
        /// </summary>
        /// <param name="type">Tipo de objeto de la clase</param>
        /// <returns></returns>
        public static IEnumerable<FieldInfo> GetAllFields(this Type type) {
            if (type == null) {
                return Enumerable.Empty<FieldInfo>();
            }

            BindingFlags flags = BindingFlags.Public |
                                 BindingFlags.NonPublic |
                                 BindingFlags.Static |
                                 BindingFlags.Instance |
                                 BindingFlags.DeclaredOnly;

            return type.GetFields(flags).Union(GetAllFields(type.BaseType));
        }

        /// <summary>
        /// Entrega todos las propiedades de la clase
        /// </summary>
        /// <param name="type">Tipo de objeto de la clase</param>
        /// <returns></returns>
        public static IEnumerable<PropertyInfo> GetAllProperties(this Type type) {
            if (type == null) {
                return Enumerable.Empty<PropertyInfo>();
            }

            BindingFlags flags = BindingFlags.Public |
                                 BindingFlags.NonPublic |
                                 BindingFlags.Static |
                                 BindingFlags.Instance |
                                 BindingFlags.DeclaredOnly;

            return type.GetProperties(flags).Union(GetAllProperties(type.BaseType));
        }

        /// <summary>
        /// Entrega todos los constructores de la clase
        /// </summary>
        /// <param name="type">Tipo de objeto de la clase</param>
        /// <returns></returns>
        public static IEnumerable<ConstructorInfo> GetAllConstructors(this Type type) {
            if (type == null) {
                return Enumerable.Empty<ConstructorInfo>();
            }

            BindingFlags flags = BindingFlags.Public |
                                 BindingFlags.NonPublic |
                                 BindingFlags.Static |
                                 BindingFlags.Instance |
                                 BindingFlags.DeclaredOnly;

            return type.GetConstructors(flags);
        }

        /// <summary>
        /// Entrega todos los metodos de la clase
        /// </summary>
        /// <param name="type">Tipo de objeto de la clase</param>
        /// <returns></returns>
        public static IEnumerable<MethodInfo> GetAllMethods(this Type type) {
            if (type == null) {
                return Enumerable.Empty<MethodInfo>();
            }

            BindingFlags flags = BindingFlags.Public |
                                 BindingFlags.NonPublic |
                                 BindingFlags.Static |
                                 BindingFlags.Instance |
                                 BindingFlags.DeclaredOnly;

            return type.GetMethods(flags).Union(GetAllMethods(type.BaseType));
        }
    }
}
