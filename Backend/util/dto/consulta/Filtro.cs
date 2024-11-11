using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.enums;

namespace util.dto.consulta {
    [Serializable]
    public class Filtro {

        /// <summary>
        /// Nombre del campo perteneciente a la tabla o bean.
        /// </summary>
        private string campo;
        /// <summary>
        /// Condicion a aplicar, si es null y el tipo de dato es string se toma like.
        /// </summary>
        private string condicion;
        /// <summary>
        /// Valor de la condicion, si es diferente de null se considera en la sentencia.
        /// </summary>
        private string valor;

        /// <summary>
        /// Crea una instancia de FIltro.
        /// </summary>
        /// <param name="campo">Codigo de campo del dto.</param>
        /// <param name="valor">Valor a buscar en campo.</param>
        public Filtro(string campo, string valor) {
            this.campo = campo;
            this.valor = valor;
            if (valor.Length > 1) {
                Evaluadoscriterio(valor.Substring(0, 2));
            }
            if ((this.condicion == null) && (valor.Length > 0)) {
                Evaluadoscriterio(valor.Substring(0, 1));
            }
        }

        /// <summary>
        /// Crea una instancia de FIltro.
        /// </summary>
        /// <param name="campo">Codigo de campo del dto.</param>
        /// <param name="condicion">Condicion a utilizar en la busqueda.</param>
        /// <param name="valor">Valor a buscar en campo.</param>
        public Filtro(string campo, string condicion, string valor) {
            this.Campo = campo;
            this.Condicion = condicion;
            this.Valor = valor;
        }

        /// <summary>
        /// Evalua la condicion de busqueda.
        /// </summary>
        /// <param name="cond">Condicion a utilizar en la busqueda.</param>
        private void Evaluadoscriterio(string cond) {
            if (EnumCriterios.GetEnumCriterios(cond) != null) {
                this.condicion = cond;
                this.valor = this.valor.Substring(cond.Length, this.valor.Length);
            }
        }


        public string Campo { get => campo; set => campo = value; }
        public string Condicion { get => condicion; set => condicion = value; }
        public string Valor { get => valor; set => valor = value; }
    }
}
