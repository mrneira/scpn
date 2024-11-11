using facturacionelectronica.comp.consulta.esquemasri.documentos.comprobanteRetencion;
using facturacionelectronica.comp.consulta.entidades;
using modelo;
using System;
using dal.contabilidad;

namespace facturacionelectronica.comp.consulta.generaxml
{
    /// <summary>
    /// Gnerar xml
    /// </summary> 
    /// 
    class ComprobanteRetencionModel
    {
        public static string ObtenerXml(tcelinfoempresa informacionEmpresa, EntidadComprobante informacionComprobante, int cantidadDecimales)
        {
            comprobanteRetencion informacionRetencion =new comprobanteRetencion();
            informacionRetencion.version = "1.0.0";
            informacionRetencion.id = id.comprobante;

            #region informacion tributario

            informacionRetencion.infoTributaria = new infoTributaria();
            informacionRetencion.infoTributaria.ambiente = Math.Truncate(TconParametrosDal.FindXCodigo("SRI_AMBIENTE", informacionComprobante.Ccompania).numero.Value).ToString();
            informacionRetencion.infoTributaria.tipoEmision = Math.Truncate(TconParametrosDal.FindXCodigo("SRI_EMISION", informacionComprobante.Ccompania).numero.Value).ToString();
            informacionRetencion.infoTributaria.razonSocial = informacionEmpresa.razonsocial;
            informacionRetencion.infoTributaria.nombreComercial = informacionEmpresa.nombrecomercial;
            informacionRetencion.infoTributaria.ruc = informacionEmpresa.ruc;
            informacionRetencion.infoTributaria.claveAcceso = informacionComprobante.ClaveAcceso;
            informacionRetencion.infoTributaria.codDoc = informacionComprobante.TipoDocumento;
            informacionRetencion.infoTributaria.estab = informacionComprobante.Establecimiento;
            informacionRetencion.infoTributaria.ptoEmi = informacionComprobante.PuntoEmision;
            informacionRetencion.infoTributaria.secuencial = informacionComprobante.Secuencial;
            informacionRetencion.infoTributaria.dirMatriz = informacionEmpresa.dirmatriz;

            #endregion

            #region Información del comprobante de retención

            informacionRetencion.infoCompRetencion.fechaEmision = informacionComprobante.FechaEmisionDocumento;
            informacionRetencion.infoCompRetencion.dirEstablecimiento = informacionComprobante.DireccionEstablecimiento;
            if (!string.IsNullOrEmpty(informacionEmpresa.contribuyenteespecial))
            {
                informacionRetencion.infoCompRetencion.contribuyenteEspecial = informacionEmpresa.contribuyenteespecial;
            }
            if (informacionEmpresa.obligadocontabilidad == true)
            {
                informacionRetencion.infoCompRetencion.obligadoContabilidad = obligadoContabilidad.SI;
            }
            else
            {
                informacionRetencion.infoCompRetencion.obligadoContabilidad = obligadoContabilidad.NO;
            }
            informacionRetencion.infoCompRetencion.tipoIdentificacionSujetoRetenido = informacionComprobante.TipoIdentificacionComprador;
            informacionRetencion.infoCompRetencion.razonSocialSujetoRetenido = informacionComprobante.RazonSocialComprador;
            informacionRetencion.infoCompRetencion.identificacionSujetoRetenido = informacionComprobante.IdentificacionComprador;
            informacionRetencion.infoCompRetencion.periodoFiscal = informacionComprobante.PeriodoFiscal;
            
            #endregion

            #region informacion informacionRetencion

            foreach (EntidadImpuestoRetencion impuesto in informacionComprobante.DetalleImpuestosRetencion)
            {
                if (impuesto!=null)
                {
                    impuesto totalConImpuesto = new impuesto();
                    totalConImpuesto.codigo = impuesto.Codigo.ToString();
                    totalConImpuesto.codigoRetencion = impuesto.CodigoRetencion;
                    totalConImpuesto.baseImponible = Math.Round(impuesto.BaseImponible, cantidadDecimales,MidpointRounding.AwayFromZero);
                    totalConImpuesto.porcentajeRetener = Math.Round(impuesto.PorcentajeRetenido, cantidadDecimales, MidpointRounding.AwayFromZero);
                    totalConImpuesto.valorRetenido = Math.Round(impuesto.ValorRetenido, cantidadDecimales, MidpointRounding.AwayFromZero);
                    totalConImpuesto.codDocSustento = impuesto.CodigoDocumentoSustento;
                    totalConImpuesto.numDocSustento = impuesto.DocumentoSustento;
                    totalConImpuesto.fechaEmisionDocSustento = impuesto.FechaDocumentoSustento;
                    informacionRetencion.impuestos.Add(totalConImpuesto);
                }
            }

            #endregion

            #region informacion informacionAdicional

            campoAdicional campoAdicional = new campoAdicional();
            campoAdicional.nombre = "AGENTE DE RETENCION";
            campoAdicional.Value = "AGENTE DE RETENCION";
            informacionRetencion.infoAdicional.Add(campoAdicional);

            #endregion

            return informacionRetencion.SerializeToXml();
        }
    }
}
