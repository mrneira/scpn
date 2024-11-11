using System;

namespace contabilidad.datos
{
    /// <summary>
    /// Conciliación Mayor
    /// </summary>
    public class ConciliacionBancariaResultado
    {
        // Conciliación
        public long rconciliacionbancariaid { get; set; }
        public int rfcontable { get; set; }
        public string rccomprobante { get; set; }
        public long rcconconciliacionbancariaextracto { get; set; }
        public Nullable<decimal> rvalorcredito { get; set; }
        public Nullable<decimal> rvalordebito { get; set; }
        public string rnumerodocumentobancario { get; set; }
        public string rcuentabancaria { get; set; }
        public long rcodigounico { get; set; }
        public bool rautomatico { get; set; }
        public bool rconciliado { get; set; }
        public int rsecuencia { get; set; }
        public long rclibrobanco { get; set; }
        // Mayor
        public int mfcontable { get; set; }
        public string mccomprobante { get; set; }
        public string mnumerodocumentobancario { get; set; }
        public decimal mvalordebito { get; set; }
        public decimal mvalorcredito { get; set; }
        public string mmodulo { get; set; }
        public string mcomentario { get; set; }
        public bool mmayor { get; set; }
        public int msecuencia { get; set; }
        // Extracto
        public int? fecha { get; set; }
        public string numerodocumentobancario { get; set; }
        public Nullable<decimal> valordebito { get; set; }
        public Nullable<decimal> valorcredito { get; set; }
        public string concepto { get; set; }
        public string cuentabancaria { get; set; }
        public bool extracto { get; set; }

    }
}
