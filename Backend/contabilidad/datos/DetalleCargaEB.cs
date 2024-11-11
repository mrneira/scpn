using System;

namespace contabilidad.datos
{
    /// <summary>
    /// Detalle Comprobante BCE
    /// </summary>
    public class DetalleCargaEB
    {
        public int fecha { get; set; }
        public string numeroComprobante { get; set; }
        public string numeroDocumento { get; set; }
        public decimal valorDebito { get; set; }
        public decimal valorCredito { get; set; }
        public decimal saldo { get; set; }
        public string concepto { get; set; }
        public int numeroLinea { get; set; }
        public string estado { get; set; }
        public long optlock { get; set; }
    }
}
