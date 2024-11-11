using facturacionelectronica.comp.consulta.esquemasri.documentos.factura;
using facturacionelectronica.comp.consulta.entidades;
using modelo;
using System;
using dal.contabilidad;

namespace facturacionelectronica.comp.consulta.generaxml
{
    /// <summary>
    /// obtener xml factura
    /// </summary>
    /// 
    public class FacturaModel
    {
        public static string ObtenerXml(tcelinfoempresa informacionEmpresa, EntidadComprobante informacionComprobante, int cantidadDecimales)
        {
            factura informacionFactura = new factura();
            informacionFactura.version = "1.1.0";
            informacionFactura.id = id.comprobante;

            #region infoTributaria

            informacionFactura.infoTributaria = new infoTributaria();
            informacionFactura.infoTributaria.ambiente = Math.Truncate(TconParametrosDal.FindXCodigo("SRI_AMBIENTE", informacionComprobante.Ccompania).numero.Value).ToString();
            informacionFactura.infoTributaria.tipoEmision = Math.Truncate(TconParametrosDal.FindXCodigo("SRI_EMISION", informacionComprobante.Ccompania).numero.Value).ToString();
            informacionFactura.infoTributaria.razonSocial = informacionEmpresa.razonsocial;
            informacionFactura.infoTributaria.nombreComercial = informacionEmpresa.nombrecomercial;
            informacionFactura.infoTributaria.ruc = informacionEmpresa.ruc;
            informacionFactura.infoTributaria.claveAcceso = informacionComprobante.ClaveAcceso;
            informacionFactura.infoTributaria.codDoc = informacionComprobante.TipoDocumento;
            informacionFactura.infoTributaria.estab = informacionComprobante.Establecimiento;
            informacionFactura.infoTributaria.ptoEmi = informacionComprobante.PuntoEmision;
            informacionFactura.infoTributaria.secuencial = informacionComprobante.Secuencial;
            informacionFactura.infoTributaria.dirMatriz = informacionEmpresa.dirmatriz;

            #endregion

            #region infoFactura

            informacionFactura.infoFactura = new infoFactura();
            informacionFactura.infoFactura.fechaEmision = informacionComprobante.FechaEmisionDocumento;
            informacionFactura.infoFactura.dirEstablecimiento = informacionComprobante.DireccionEstablecimiento;
            if (!string.IsNullOrEmpty(informacionEmpresa.contribuyenteespecial))
            {
                informacionFactura.infoFactura.contribuyenteEspecial = informacionEmpresa.contribuyenteespecial;
            }
            if (informacionEmpresa.obligadocontabilidad == true)
            {
                informacionFactura.infoFactura.obligadoContabilidad = "SI";
            }
            else
            {
                informacionFactura.infoFactura.obligadoContabilidad = "NO";
            }
            informacionFactura.infoFactura.tipoIdentificacionComprador = informacionComprobante.TipoIdentificacionComprador;
            informacionFactura.infoFactura.razonSocialComprador = informacionComprobante.RazonSocialComprador;
            informacionFactura.infoFactura.identificacionComprador = informacionComprobante.IdentificacionComprador;

            informacionFactura.infoFactura.totalSinImpuestos = Math.Round(informacionComprobante.TotalSinImpuestos,cantidadDecimales,MidpointRounding.AwayFromZero);
            informacionFactura.infoFactura.totalDescuento = Math.Round(informacionComprobante.TotalDescuento, cantidadDecimales, MidpointRounding.AwayFromZero);
            informacionFactura.infoFactura.propina = Math.Round(informacionComprobante.Propina, cantidadDecimales, MidpointRounding.AwayFromZero);
            informacionFactura.infoFactura.importeTotal = Math.Round(informacionComprobante.ImporteTotal, cantidadDecimales, MidpointRounding.AwayFromZero);
            informacionFactura.infoFactura.moneda = informacionComprobante.Moneda;

            #endregion

            #region totalConImpuestos

            informacionFactura.infoFactura.totalConImpuestos = new totalConImpuestos();

            foreach (EntidadImpuesto impuesto in informacionComprobante.DetalleImpuestos)
            {
                if (impuesto != null)
                {
                    totalImpuesto totalConImpuesto = new totalImpuesto();
                    totalConImpuesto.codigo = impuesto.TipoImpuesto.ToString();
                    totalConImpuesto.codigoPorcentaje = impuesto.CodigoImpuesto.ToString();
                    totalConImpuesto.descuentoAdicional = Math.Round(impuesto.DescuentoAdicional , cantidadDecimales, MidpointRounding.AwayFromZero);
                    totalConImpuesto.baseImponible = Math.Round(impuesto.BaseImponible, cantidadDecimales, MidpointRounding.AwayFromZero);
                    totalConImpuesto.valor = Math.Round(impuesto.Valor, cantidadDecimales, MidpointRounding.AwayFromZero);
                    informacionFactura.infoFactura.totalConImpuestos.Add(totalConImpuesto);
                }
            }

            #endregion

            #region Entidad de pagos

            if (informacionComprobante.Pagos != null)
            {
                informacionFactura.infoFactura.pagos = new pagos();

                foreach (EntidadPago pago in informacionComprobante.Pagos)
                {
                    if (pago != null)
                    {
                        pago formaPago = new pago();
                        formaPago.formaPago = pago.FormaPago;
                        formaPago.total = Math.Round(pago.Total , cantidadDecimales, MidpointRounding.AwayFromZero);
                        formaPago.plazo = pago.Plazo ;
                        formaPago.unidadTiempo = pago.UnidadTiempo;
                        informacionFactura.infoFactura.pagos.Add(formaPago);
                    }
                }
            }

            #endregion

            #region detalles

            informacionFactura.detalles = new detalles();

            foreach (EntidadDetalle detalle in informacionComprobante.Detalles)
            {
                detalle detalleFactura = new detalle();
                detalleFactura.codigoPrincipal = detalle.CodigoPrincipal;
                detalleFactura.codigoAuxiliar = detalle.CodigoAuxiliar;
                detalleFactura.descripcion = detalle.Descripcion;
                detalleFactura.cantidad = decimal.Round(detalle.Cantidad, cantidadDecimales, MidpointRounding.AwayFromZero);
                detalleFactura.precioUnitario = decimal.Round(detalle.PrecioUnitario, cantidadDecimales, MidpointRounding.AwayFromZero);
                detalleFactura.descuento = decimal.Round(detalle.Descuento, cantidadDecimales, MidpointRounding.AwayFromZero);
                detalleFactura.precioTotalSinImpuesto = decimal.Round(detalle.PrecioTotalSinImpuesto, cantidadDecimales, MidpointRounding.AwayFromZero);

                #region Incluir impuestos en los detalles

                detalleFactura.impuestos = new impuestos();
                foreach (EntidadImpuestoDetalle detalleImpuesto in detalle.ImpuestosDetalle)
                {
                    detalleFactura.impuestos.Add(
                        new impuesto
                        {
                            codigo = detalleImpuesto.TipoImpuesto.ToString(),
                            codigoPorcentaje = detalleImpuesto.CodigoImpuesto.ToString(),
                            tarifa = Math.Round(detalleImpuesto.Tarifa.Value, cantidadDecimales, MidpointRounding.AwayFromZero),
                            baseImponible = Math.Round(detalleImpuesto.BaseImponible.Value, cantidadDecimales, MidpointRounding.AwayFromZero),
                            valor = Math.Round(detalleImpuesto.Valor.Value, cantidadDecimales, MidpointRounding.AwayFromZero)
                        });
                }

                informacionFactura.detalles.Add(detalleFactura);

                #endregion
            }

            #endregion

            return informacionFactura.SerializeToXml();
        }        
    }
}
