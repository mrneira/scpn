using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace util.enums {

    /// <summary>
    /// Clase que define enumeracion de criterios de busqueda.
    /// </summary>
    public class EnumCriterios {
        /// <summary>
        /// Nombre de la condicion.
        /// </summary>
        private string nombre;
        /// <summary>
        /// Condicion de buqueda =, !=, >, <, >=, <=
        /// </summary>
        private string condicion;

        /// <summary>
        /// Crea una instancia de EnumCriterios.
        /// </summary>
        /// <param name="nombre">Nombre de la condicion. </param>
        /// <param name="condicion">Condicion</param>
        public EnumCriterios(string nombre, string condicion) {
            this.Nombre = nombre;
            this.Condicion = condicion;
        }

        /// <summary>
        /// Entrega el valor de nombre.
        /// </summary>
        public string Nombre { get => nombre; set => nombre = value; }
        /// <summary>
        /// Entrega el valor de condicion.
        /// </summary>
        public string Condicion { get => condicion; set => condicion = value; }

        public static readonly EnumCriterios IGUAL = new EnumCriterios("IGUAL", "=");
        public static readonly EnumCriterios DIFERENTE = new EnumCriterios("DIFERENTE", "!=");
        public static readonly EnumCriterios MAYOR = new EnumCriterios("MAYOR", ">");
        public static readonly EnumCriterios MENOR = new EnumCriterios("MENOR", "<");
        public static readonly EnumCriterios MAYOROIGUAL = new EnumCriterios("MAYOROIGUAL", "<=");
        public static readonly EnumCriterios MENOROIGUAL = new EnumCriterios("MENOROIGUAL", ">=");

        public static IEnumerable<EnumCriterios> Values {
            get {
                yield return IGUAL;
                yield return DIFERENTE;
                yield return MAYOR;
                yield return MENOR;
                yield return MAYOROIGUAL;
                yield return MENOROIGUAL;
            }
        }

        /// <summary>
        /// Entrega una instancia de la enumeracion dada la condicion.
        /// </summary>
        /// <param name="cond">Condicion a buscar la enumeracion.</param>
        /// <returns></returns>
        public static EnumCriterios GetEnumCriterios(string cond) {
            EnumCriterios obj = null;
            foreach (EnumCriterios e in EnumCriterios.Values) {
                if (e.condicion.Equals(cond)) {
                    obj = e;
                }
            }
            return obj;
        }

    }
}
