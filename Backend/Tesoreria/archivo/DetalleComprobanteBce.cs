using System;

namespace tesoreria.archivo
{
    /// <summary>
    /// Detalle Comprobante BCE
    /// </summary>
    public class DetalleComprobanteBce
    {
        public string numerocomprobante { get; set; }
        public string descripcioncomprobante { get; set; }
        public decimal valorpago { get; set; }
    }
}
