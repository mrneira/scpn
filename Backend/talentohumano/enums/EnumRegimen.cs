using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace talentohumano.enums
{
    class EnumRegimen
    {
        public static readonly EnumRegimen LOSEP = new EnumRegimen("LOP");
        public static readonly EnumRegimen CODTRABAJO = new EnumRegimen("COD");
       
        /// <summary>
        /// Codigo de trabajo del funcionario .
        /// </summary>
        private String valor;

        /// <summary>
        /// Entrega o fija el valor de: región
        /// </summary>
        public string Value { get => valor; set => valor = value; }

        /// <summary>
        /// Crea una instancia de EnumRegiones.
        /// </summary>
        /// <param name="valor">Codigo de región de nomina.</param>
        private EnumRegimen(String valor)
        {
            this.Value = valor;
        }
    }
}
