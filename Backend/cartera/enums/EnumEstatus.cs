using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace cartera.enums {

    /// <summary>
    /// Enumeracion que almacena estatus de cartera.
    /// </summary>
    public class EnumEstatus {

        public static readonly EnumEstatus INGRESADA = new EnumEstatus("ING");

        public static readonly EnumEstatus APROVADA = new EnumEstatus("APR");

        public static readonly EnumEstatus ANULADA = new EnumEstatus("ANU");

        public static readonly EnumEstatus VIGENTE = new EnumEstatus("VIG");

        public static readonly EnumEstatus VENCIDA = new EnumEstatus("VEN");

        public static readonly EnumEstatus JUDICIAL = new EnumEstatus("JUD");

        public static readonly EnumEstatus CASTIGADA = new EnumEstatus("CAS");

        public static readonly EnumEstatus CANCELADA = new EnumEstatus("CAN");

        public static readonly EnumEstatus NEGADA = new EnumEstatus("NEG");

        public static readonly EnumEstatus NO_DEVENGA = new EnumEstatus("NDV");

        public static readonly EnumEstatus PRE_APROBADA = new EnumEstatus("PAP");

        public static readonly EnumEstatus PAGADO = new EnumEstatus("PAG");

        public static readonly EnumEstatus REPETIDA = new EnumEstatus("REP");

        public static readonly EnumEstatus SIMULACION = new EnumEstatus("SIM");
        

        /// <summary>
        /// Codigo de estatus de una operacion.
        /// </summary>
        private String cestatus;

        /// <summary>
        /// Entrega o fija el valor de: cestatus
        /// </summary>
        public string Cestatus { get => cestatus; set => cestatus = value; }

        /// <summary>
        /// Crea una instancia de EnumEstatus.
        /// </summary>
        /// <param name="cestatus">Codigo de estatus de la cartera.</param>
        private EnumEstatus(String cestatus)
        {
            this.cestatus = cestatus;
        }
    }
}
