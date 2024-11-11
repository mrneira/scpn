using System ;

namespace facturacionelectronica.comp.consulta.entidades
{
    /// <summary>
    /// Entidad de detalle e impuestos de documentos
    /// </summary>
    [Serializable]
    public class EntidadImpuestoDetalle
    {
        public EntidadImpuestoDetalle(int pTipoImpuesto, int pCodigoImpuesto, decimal? pBaseImponible, decimal? pValor, decimal? pTarifa)
        {
            TipoImpuesto = pTipoImpuesto;
            CodigoImpuesto = pCodigoImpuesto;
            BaseImponible = pBaseImponible;
            Valor = pValor;
            Tarifa = pTarifa;
        }

        public EntidadImpuestoDetalle()
        {
        }

        public int TipoImpuesto { get; set; }
        public int CodigoImpuesto { get; set; }
        public decimal? BaseImponible { get; set; }
        public decimal? Valor { get; set; }
        public decimal? Tarifa { get; set; }
    }
}
