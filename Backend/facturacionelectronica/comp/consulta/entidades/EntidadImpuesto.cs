using System ;

namespace facturacionelectronica.comp.consulta.entidades
{
    /// <summary>
    /// Entidad de impuestos de documentos
    /// </summary>
    [Serializable]
    public class EntidadImpuesto
    {
        public EntidadImpuesto(int pTipoImpuesto, int pCodigoImpuesto, decimal pBaseImponible, decimal pValor,
            decimal pTarifa, decimal pDescuentoAdicional)
        {
            TipoImpuesto = pTipoImpuesto;
            CodigoImpuesto = pCodigoImpuesto;
            BaseImponible = pBaseImponible;
            Valor = pValor;
            Tarifa = pTarifa;
            DescuentoAdicional = pDescuentoAdicional;
        }

        public EntidadImpuesto()
        {
        }

        public int TipoImpuesto { get; set; }
        public int CodigoImpuesto { get; set; }
        public decimal BaseImponible { get; set; }
        public decimal Valor { get; set; }
        public decimal Tarifa { get; set; }
        public decimal DescuentoAdicional { get; set; }
    }
}
