using modelo.helper;
using modelo.interfaces;
using System;

namespace facturacionelectronica.comp.consulta.entidades
{
    /// <summary>
    /// Entidad de comprobante de documentos
    /// </summary>
    [Serializable]
        public partial class EntidadComprobante: AbstractDto, IBean
    {
        public string NumeroDetalles;
        public string TipoDocumento;
        public string IdentificacionComprador;
        public string RazonSocialComprador;
        public string Moneda;
        public decimal TotalSinImpuestos;
        public decimal Propina;
        public decimal TotalDescuento;
        public decimal ImporteTotal;
        public decimal TotalIva;
        public decimal TotalIce;
        public string CodigoDocumentoReferenciaNc;
        public string MotivoDevolucion;
        public string NumeroDocumentoDevolucion;
        public string DireccionComprador;
        public string PeriodoFiscal;
        public string FechaEmisionDocumento;
        public string FechaEmisionComprobante;
        public int Ccompania;

        public string TipoDocumentoModificado;
        public string TipoIdentificacionComprador;
        public string ParametroGeneracionComprobante;
        public string ClaveAcceso;
        public string TipoEmision;
        public string Ambiente;

        #region información establecimiento, punto emisión, secuencial y dirección

        public string Establecimiento;
        public string PuntoEmision;
        public string Secuencial;
        public string DireccionEstablecimiento;
        public string CusuarioIng;
        public DateTime Fingreso;

        #endregion

        public DateTime? FechaDocumentoDevolucion;

        public bool ShouldSerializeFechaDocumentoDevolucion()
        {
            return FechaDocumentoDevolucion.HasValue;
        }

        #region Información para notas de crédito

        public string NumeroDocumentoSustentoNc;

        public bool ShouldSerializeNumeroDocumentoSustentoNc()
        {
            return !string.IsNullOrEmpty(NumeroDocumentoSustentoNc);
        }

        public string FechaEmisionDocumentoSustentoNc { get; set; }

        public string CodigoDocumentoSustentoNc;

        public bool ShouldSerializeCodigoDocumentoSustentoNc()
        {
            return !string.IsNullOrEmpty(CodigoDocumentoSustentoNc);
        }

        #endregion

        public EntidadDetalle[] Detalles;

        public EntidadImpuesto[] DetalleImpuestos;

        public EntidadImpuestoRetencion[] DetalleImpuestosRetencion;

        public EntidadPago[] Pagos;

        public EntidadComprobante()
        {
        }

        public virtual object Clone()
        {
            return this.MemberwiseClone();
        }
    }
}
