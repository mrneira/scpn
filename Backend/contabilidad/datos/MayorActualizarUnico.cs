using modelo;
using System;

namespace contabilidad.datos
{
    /// <summary>
    /// Conciliación Mayor
    /// </summary>
    public class MayorActualizarUnico
    {
        public string iccomprobante { get; set; }
        public int ifcontable { get; set; }
        public int isecuencia { get; set; }
        public long codigounico {get; set;}
        public bool procesado { get; set; }
        public string iccomsec { get; set; }
    }
}
