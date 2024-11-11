using System;

namespace contabilidad.datos
{
    /// <summary>
    /// Conciliación Mayor
    /// </summary>
    public class ConciliacionBancariaPichinchaResultado
    {
        // Conciliación
        public long cconconciliacionbancariaextracto { get; set; }
        public int fcontablecash { get; set; }
        public int fcontablemayor { get; set; }
        public string ccomprobantemayor { get; set; }
        public int secuenciamayor { get; set; }
        public string ccomprobantecash { get; set; }
        public decimal valorcredito { get; set; }
        public decimal valordebito { get; set; }
        public string numerodocumentobancariocash { get; set; }
        public string numerodocumentobancarioextracto { get; set; }
        public long codigounico { get; set; }
        public bool automatico { get; set; }
        public bool conciliado { get; set; }
        public bool procesado { get; set; }
        public string concepto { get; set; }
        public string cuentabancaria { get; set; }
        public long crecaudaciondetalle { get; set; }
    }
}
