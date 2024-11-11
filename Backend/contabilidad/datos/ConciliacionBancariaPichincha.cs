using System;

namespace contabilidad.datos
{
    /// <summary>
    /// Conciliación Mayor
    /// </summary>
    public class ConciliacionBancariaPichincha
    {
        // Conciliación
        public long rconciliacionbancariaid { get; set; }
        public long rcodigounico { get; set; }
        public bool rautomatico { get; set; }
        public bool rconciliado { get; set; }
        public long crecaudaciondetalle { get; set; }
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
        public long conconciliacionbancariaextracto { get; set; }
        public int? fecha { get; set; }
        public string numerodocumentobancario { get; set; }
        public Nullable<decimal> valordebito { get; set; }
        public Nullable<decimal> valorcredito { get; set; }
        public string concepto { get; set; }
        public string cuentabancaria { get; set; }
        public bool extracto { get; set; }

    }
}
