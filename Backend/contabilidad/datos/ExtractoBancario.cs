using modelo;
using System;

namespace contabilidad.datos
{
    /// <summary>
    /// Conciliación Mayor
    /// </summary>
    public class ExtractoBancario : tconextractobancario
    {
        public bool conciliado { get; set; }
        public string ccomprobante { get; set; }
        public string mnumerodocumentobancario { get; set; }
        public int fcontable { get; set; }
        public bool debito { get; set; }
        public decimal monto { get; set; }
        public string comentario { get; set; }
        public int secuencia { get; set; }
        public bool procesado { get; set; }
        public bool extracto { get; set; }
        public decimal mvalorcredito { get; set; }
        public decimal mvalordebito { get; set; }
        //Pichincha
        public string encash { get; set; }
    }
}
