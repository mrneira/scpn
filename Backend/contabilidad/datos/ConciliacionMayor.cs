using modelo;
using System;

namespace contabilidad.datos
{
    /// <summary>
    /// Conciliación Mayor
    /// </summary>
    public class ConciliacionMayor : tconlibrobancos
    {
        public long lclibrobanco { get; set; }
        public string lccomprobante { get; set;}
        public string ldocumento { get; set; }
        public int lfcontable { get; set; }
        public decimal lmontocredito { get; set; }
        public decimal lmontodebito { get; set; }
        public string lmodulo { get; set; }
    }
}
