using System;

namespace facturacionelectronica.comp.consulta.entidades
{
    /// <summary>
    /// Entidad de detalle retención de documentos
    /// </summary>
    [Serializable]
    public class EntidadImpuestoRetencion
    {
        public int Codigo { get; set; }
        public string CodigoRetencion { get; set; }
        public decimal BaseImponible { get; set; }
        public decimal ValorRetenido { get; set; }
        public string CodigoDocumentoSustento { get; set; }
        public string DocumentoSustento { get; set; }
        public string FechaDocumentoSustento { get; set; }
        public decimal PorcentajeRetenido { get; set; }
        public string DescripcionRetencion { get; set; }
     
    }
}
