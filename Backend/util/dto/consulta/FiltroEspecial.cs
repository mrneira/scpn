using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace util.dto.consulta {

    [Serializable]
    public class FiltroEspecial {
        /// <summary>
        /// Nombre del campo perteneciente a la tabla o bean.
        /// </summary>
        private string campo;
        /// <summary>
        /// Condicion a aplicar, si es null y el tipo de dato es string se toma like.
        /// </summary>
        private string condicion;

        /// <summary>
        /// Crea una instancia de FiltroEspecial.
        /// </summary>
        /// <param name="campo">Codigo de campo de la tabla.</param>
        /// <param name="condicion">Condicion a aplicar al campo, ejemplo is null, is not null in ()</param>
        public FiltroEspecial(string campo, string condicion) {
            this.campo = campo;
            this.condicion = condicion;
        }

        public string Campo { get => campo; set => campo = value; }
        public string Condicion { get => condicion; set => condicion = value; }
    }
}
