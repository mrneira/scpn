using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace talentohumano.enums
{
    
    class EnumEstadoContrato
    {
        public static readonly EnumEstadoContrato ACTIVO = new EnumEstadoContrato("ACT");

        public static readonly EnumEstadoContrato INACTIVO = new EnumEstadoContrato("INC");

        public static readonly EnumEstadoContrato FINALIZADO = new EnumEstadoContrato("FIN");


        /// <summary>
        /// Codigo de estatus de nomina.
        /// </summary>
        private String cestatus;

        /// <summary>
        /// Entrega o fija el valor de: cestatus
        /// </summary>
        public string Cestatus { get => cestatus; set => cestatus = value; }

        /// <summary>
        /// Crea una instancia de EnumEstadoContrato.
        /// </summary>
        /// <param name="valor">Codigo de estatus de nomina.</param>
        private EnumEstadoContrato(String cestatus)
        {
            this.cestatus = cestatus;
        }
    }
}
