using System;
using System.Globalization;

namespace util.enums
{
    public class EnumEstadoPagoBce
    {

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
            AutorizacionCobro = 8
        }

        [Serializable]
        public enum RespuestaPagoBce
        {
            Pagado = 1,
            Rechazado = 2
        }
    }
}
