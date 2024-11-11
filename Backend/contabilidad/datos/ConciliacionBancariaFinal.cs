using modelo;
using System;

namespace contabilidad.datos
{
    /// <summary>
    /// Conciliación Mayor
    /// </summary>
    public class ConciliacionBancariaFinal: tconconciliacionbancaria
    {
        public int? fcontable { get; set; }
        public bool mmayor { get; set; }
        public bool extracto { get; set; }
    }
}
