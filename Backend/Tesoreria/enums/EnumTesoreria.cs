using System;
using System.ComponentModel;
using System.Globalization;

namespace tesoreria.enums
{
    /// <summary>
    /// Enumeracion que almacena estatus de cartera.
    /// </summary>
    public class EnumTesoreria
    {
        public static readonly EnumTesoreria PAGO = new EnumTesoreria("P");

        public static readonly EnumTesoreria TRANSFERENCIA = new EnumTesoreria("I");

        public static readonly EnumTesoreria COBRO = new EnumTesoreria("C");

        public static readonly EnumTesoreria SPL = new EnumTesoreria("S");

        public const string LocalHost = "127.0.0.1";

        public const string UserDefault = "System";

        public static CultureInfo Cultura = new CultureInfo("es-PE");

        /// <summary>
        /// Codigo de estatus de una operacion.
        /// </summary>
        private string cpago;

        /// <summary>
        /// Entrega o fija el valor de: cestatus
        /// </summary>
        public string Cpago { get => cpago; set => cpago = value; }

        /// <summary>
        /// Crea una instancia de EnumEstatus.
        /// </summary>
        /// <param name="cestatus">Codigo de estatus de la cartera.</param>
        private EnumTesoreria(String cpago)
        {
            this.cpago = cpago;
        }

        //Cash

        [Serializable]
        public enum CodigoOrientacionCash
        {
            CO = 1,
            PA = 2
        }

        [Serializable]
        public enum FormaPagoCash
        {
            REC = 1,
            CTA = 2,
            CHQ = 3,
            EFE = 4
        }

        [Serializable]
        public enum EstadoRecaudacionCash
        {
            Registrado = 1,
            Generado = 2,
            Cobrado = 3,
            Autorizado = 4,
            AutorizadoAplicar = 5,
            NoCobrado = 6
        }

        //BCE 

        [Serializable]
        public enum RespuestaPagoBce
        {
            Pagado = 1,
            Rechazado = 2
        }

        [Serializable]
        public enum EstadoPagoBce
        {
            Registrado = 1,
            Generado = 2,
            Pagado = 3,
            Anulado = 4,
            Rechazado = 5,
            Rotativo = 6,
            Autorizacion = 7,
            Aprobar = 8
        }

        [Serializable]
        public enum RespuestaCobroBce
        {
            Cobrado = 12,
            Rechazado = 2
        }

        [Serializable]
        public enum EstadoCobroBce
        {
            Registrado = 1,
            Generado = 2,
            Cobrado = 12,
            Anulado = 4,
            Rechazado = 5,
            Rotativo = 6,
            Autorizacion = 7
        }
    }
}
