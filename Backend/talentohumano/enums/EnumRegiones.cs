using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace talentohumano.enums
{
    class EnumRegiones
    {
        public static readonly EnumRegiones SIERRA = new EnumRegiones("SIE");
        public static readonly EnumRegiones AMAZONIA = new EnumRegiones("AMZ");
        public static readonly EnumRegiones COSTA = new EnumRegiones("COS");
        public static readonly EnumRegiones GALAPAGOS = new EnumRegiones("GAL");

        /// <summary>
        /// Codigo de regiones del funcionario .
        /// </summary>
        private String valor;

        /// <summary>
        /// Entrega o fija el valor de: región
        /// </summary>
        public string Value { get => valor; set => valor = value; }

        /// <summary>
        /// Crea una instancia de EnumRegiones.
        /// </summary>
        /// <param name="cestatus">Codigo de región de nomina.</param>
        private EnumRegiones(String valor)
        {
            this.Value = valor;
        }
    }
}
