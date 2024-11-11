using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace talentohumano.enums
{

    /// <summary>
    /// Enumeracion que almacena estatus de nomina.
    /// </summary>
    public class EnumEstatus
    {

        public static readonly EnumEstatus GENERADA = new EnumEstatus("GEN");

        public static readonly EnumEstatus APROBADA = new EnumEstatus("APR");

        public static readonly EnumEstatus CERRADA = new EnumEstatus("CER");
        public static readonly EnumEstatus CONTABILIZADA = new EnumEstatus("CON");


        /// <summary>
        /// Codigo de estatus de nomina.
        /// </summary>
        private String cestatus;

        /// <summary>
        /// Entrega o fija el valor de: estadoNomina
        /// </summary>
        public string Cestatus { get => cestatus; set => cestatus = value; }

        /// <summary>
        /// Crea una instancia de EnumEstatus.
        /// </summary>
        /// <param name="cestatus">Codigo de estatus de nomina.</param>
        private EnumEstatus(String cestatus)
        {
            this.cestatus = cestatus;
        }
    }
}