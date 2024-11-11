using System;

namespace facturacionelectronica.comp.consulta.entidades
{
    /// <summary>
    /// Entidad de detalle de documentos
    /// </summary>
    [Serializable]
    public class EntidadDetalle
    {
        public string CodigoPrincipal { get; set; }

        public string CodigoAuxiliar { get; set; }
        public string Descripcion { get; set; }
        public decimal Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
        public decimal Descuento { get; set; }
        public decimal PrecioTotalSinImpuesto { get; set; }

        public string CuentaContable { get; set; }
        public string CodigoImpuestoIce { get; set; }
        public string CodigoImpuestoIva { get; set; }  //Este codigo permitirá identificar si un producto paga iva 12, 0 o es no objeto de iva

        public EntidadImpuestoDetalle[] ImpuestosDetalle;

        public string InformacionAdicional { get; set; }

        public EntidadDetalle()
        {
        }
    }
}
