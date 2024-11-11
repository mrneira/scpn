using System;

namespace facturacionelectronica.comp.consulta.entidades
{
    /// <summary>
    /// Entidad de detalle de pagos
    /// </summary>
    [Serializable]
    public class EntidadPago
    {
        public string FormaPago { get; set; }
        public decimal Total { get; set; }
        public decimal Plazo { get; set; }
        public string UnidadTiempo { get; set; }

        public EntidadPago()
        {
        }
    }
}
