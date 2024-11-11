using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace talentohumano.enums
{
    class EnumSolicitud
    {

        /// <summary>
        /// Enumeracion que almacena estatus de nomina.
        /// </summary>
        public static readonly EnumSolicitud PERMISO = new EnumSolicitud("PER");
        public static readonly EnumSolicitud VACACION = new EnumSolicitud("VAC");
        public static readonly EnumSolicitud HORAEXTRA = new EnumSolicitud("HOR");



        /// <summary>
        /// Código que entrega un tipo de solicitud.
        /// </summary>
        private String valor;

        /// <summary>
        /// Entrega o fija el valor de: valor
        /// </summary>
        public string Value { get => valor; set => valor = value; }

        /// <summary>
        /// Crea una instancia de EnumsIngreso.
        /// </summary>
        /// <param name="cestatus">Codigo de tipo de solicitud.</param>
        private EnumSolicitud(String valor)
        {
            this.Value = valor;
        }
    }
}
