using core.componente;
using modelo;
using System.Collections.Generic;
using System.Linq;
using util.dto.mantenimiento;
using dal.contabilidad;
using facturacionelectronica.comp.consulta.componentegeneracion;
using facturacionelectronica.comp.consulta.entidades;
using System.Globalization;
using System.Threading;
using dal.facturacionelectronica;
using dal.contabilidad.cuentasporpagar;
using dal.generales;
using modelo.interfaces;
using util;
using System;

namespace facturacionelectronica.comp.mantenimiento.logdocumento
{
    /// <summary>
    /// Clase que se encarga de completar los datos faltantes de una direccion
    /// </summary>
    /// <author>amerchan</author>
    public class Correccion : ComponenteMantenimiento
    {
        /// <summary>
        /// Metodo que se encarga de generar la corrección de comprobantes electrónicos no autorizados
        /// </summary>
        /// <param name="rm">Request del mantenimiento</param>
        public override void Ejecutar(RqMantenimiento rm)
        {
            if (string.IsNullOrEmpty(rm.Mdatos["claveacceso"].ToString()))
            {
                return;
            }
            string claveAcceso = rm.Mdatos["claveacceso"].ToString();
            string numeroDocumento = rm.Mdatos["numerodocumento"].ToString();
            string tipoDocumento = rm.Mdatos["tipodocumento"].ToString();
            Thread.CurrentThread.CurrentCulture = new CultureInfo("es-PE");
            EntidadComprobante entidad = new EntidadComprobante();
            switch (tipoDocumento)
            {
                case "FA":
                    tconcuentaporcobrar cxc = TconCuentaPorCobrarDal.FindXNumeroDocumento(numeroDocumento);

                    #region Armar entidad factura

                    entidad.FechaEmisionDocumento = cxc.fdocumento.Value.ToString("dd/MM/yyyy");
                    entidad.ClaveAcceso = claveAcceso;
                    entidad.Establecimiento = cxc.ccodfactura.Substring(0, 3);
                    entidad.PuntoEmision = cxc.ccodfactura.Substring(4, 3);
                    entidad.Secuencial = cxc.ccodfactura.Substring(8, 9);

                    tperproveedor proveedor = TperProveedorDal.Find(cxc.cpersona.Value, 1);
                    entidad.IdentificacionComprador = proveedor.identificacion;

                    entidad.ImporteTotal = cxc.total.Value;
                    entidad.Moneda = "DOLAR";
                    entidad.Propina = 0;
                    entidad.RazonSocialComprador = proveedor.nombre;

                    entidad.TipoDocumento = TgenCatalogoDetalleDal.Find(cxc.tipodocumentoccatalogo.Value, cxc.tipodocumentocdetalle).clegal;// "01"; //mejorar a catalogo

                    if (proveedor.identificacion.Length == 13)
                    {
                        entidad.TipoIdentificacionComprador = "04";
                    }
                    else if (proveedor.identificacion.Length == 10)
                    {
                        entidad.TipoIdentificacionComprador = "05";
                    }
                    else
                    {
                        entidad.TipoIdentificacionComprador = "06";
                    }
                    entidad.TotalDescuento = 0;
                    entidad.TotalIce = 0;
                    entidad.TotalIva = cxc.montoiva.Value;
                    entidad.TotalSinImpuestos = cxc.baseimponible.Value;
                    entidad.Detalles = new EntidadDetalle[1];

                    entidad.Detalles[0] = new EntidadDetalle()
                    {
                        CodigoPrincipal = "CP",
                        CodigoAuxiliar = "CA",
                        PrecioUnitario = cxc.baseimponible.Value,
                        Descripcion = cxc.concepto,
                        Cantidad = 1,
                        Descuento = 0,
                        PrecioTotalSinImpuesto = cxc.baseimponible.Value
                    };

                    entidad.Detalles[0].ImpuestosDetalle = new EntidadImpuestoDetalle[1];

                    entidad.Detalles[0].ImpuestosDetalle[0] = new EntidadImpuestoDetalle()
                    {
                        TipoImpuesto = 2, 
                        CodigoImpuesto = 2, 
                        BaseImponible = cxc.baseimponible.Value,
                        Valor = cxc.montoiva.Value,
                        Tarifa = 12 
                    };

                    entidad.Pagos = new EntidadPago[1];

                    entidad.Pagos[0] = new EntidadPago()
                    {
                        FormaPago = "01", 
                        Plazo = 1,
                        Total = cxc.total.Value,
                        UnidadTiempo = "días"
                    };

                    entidad.DetalleImpuestos = new EntidadImpuesto[1];

                    entidad.DetalleImpuestos[0] = new EntidadImpuesto()
                    {
                        TipoImpuesto = 2,
                        CodigoImpuesto = 2,
                        BaseImponible = cxc.baseimponible.Value,
                        Valor = cxc.montoiva.Value,
                        Tarifa = 12,
                        DescuentoAdicional = 0
                    };
                    entidad.CusuarioIng = rm.Cusuario;
                    entidad.Fingreso = rm.Freal;
                    #endregion
                    break;

                case "CR":
                    tconcuentaporpagar cxp = TconCuentaporpagarDal.FindXNumeroDocumento(numeroDocumento);
                    rm.Response["cctaporpagar"] = cxp.cctaporpagar;
                    List<IBean> ldetalle = DevolverDetalleImpuestosRenta(rm);

                    #region Armar entidad retención

                    entidad.ClaveAcceso = claveAcceso;
                    entidad.FechaEmisionDocumento = cxp.fingreso.Value.ToString("dd/MM/yyyy");
                    entidad.Establecimiento = cxp.numdocumento.Substring(0, 3);
                    entidad.PuntoEmision = cxp.numdocumento.Substring(4, 3);
                    entidad.Secuencial = cxp.numdocumento.Substring(8, 9);

                    tperproveedor proveedorC = TperProveedorDal.Find(cxp.cpersona.Value, rm.Ccompania);
                    entidad.IdentificacionComprador = proveedorC.identificacion;

                    entidad.Moneda = "DOLAR";
                    entidad.Propina = 0;
                    entidad.RazonSocialComprador = proveedorC.nombre;

                    if (proveedorC.identificacion.Length == 13)
                    {
                        entidad.TipoIdentificacionComprador = "04";
                    }
                    else if (proveedorC.identificacion.Length == 10)
                    {
                        entidad.TipoIdentificacionComprador = "05";
                    }
                    else
                    {
                        entidad.TipoIdentificacionComprador = "06";
                    }


                    entidad.TipoDocumento = TgenCatalogoDetalleDal.Find(cxp.tcomprobanteccatalogo.Value, cxp.tcomprobantecdetalle).clegal; //"07"; //mejorar a catalogo

                    int contadorImpuestosDetalle = 0;
                    if (cxp.montoivabienes != null) contadorImpuestosDetalle++;
                    if (cxp.montoivaservicios != null) contadorImpuestosDetalle++;
                    contadorImpuestosDetalle += ldetalle.Count;

                    entidad.DetalleImpuestosRetencion = new EntidadImpuestoRetencion[contadorImpuestosDetalle + 1];

                    if (cxp.montoivabienes != null)
                    {
                        entidad.DetalleImpuestosRetencion[0] = new EntidadImpuestoRetencion()
                        {
                            Codigo = 2,
                            CodigoRetencion = TgenCatalogoDetalleDal.Find(cxp.porretbienesccatalogo.Value, cxp.porretbienescdetalle).clegal,
                            BaseImponible = cxp.montoivabienes.Value,
                            PorcentajeRetenido = Decimal.Parse(TgenCatalogoDetalleDal.Find(cxp.porretbienesccatalogo.Value, cxp.porretbienescdetalle).nombre),
                            ValorRetenido = cxp.valorretbienes.Value,
                            CodigoDocumentoSustento = TgenCatalogoDetalleDal.Find(cxp.tcomprobanteccatalogo.Value, cxp.tcomprobantecdetalle).clegal,
                            DocumentoSustento = cxp.numdocumentosustento.Replace("-", ""),
                            FechaDocumentoSustento = cxp.ffacturasustento.Value.ToString("dd/MM/yyyy")
                        };
                    }

                    if (cxp.montoivaservicios != null)
                    {
                        entidad.DetalleImpuestosRetencion[1] = new EntidadImpuestoRetencion()
                        {
                            Codigo = 2,
                            CodigoRetencion = TgenCatalogoDetalleDal.Find(cxp.porretserviciosccatalogo.Value, cxp.porretservicioscdetalle).clegal,
                            BaseImponible = cxp.montoivaservicios.Value,
                            PorcentajeRetenido = Decimal.Parse(TgenCatalogoDetalleDal.Find(cxp.porretserviciosccatalogo.Value, cxp.porretservicioscdetalle).nombre),
                            ValorRetenido = cxp.valorretservicios.Value,
                            CodigoDocumentoSustento = TgenCatalogoDetalleDal.Find(cxp.tcomprobanteccatalogo.Value, cxp.tcomprobantecdetalle).clegal,
                            DocumentoSustento = cxp.numdocumentosustento.Replace("-", ""),
                            FechaDocumentoSustento = cxp.ffacturasustento.Value.ToString("dd/MM/yyyy")
                        };
                    }

                    int indice = 2;
                    foreach (tconretencionfuente obj in ldetalle)
                    {
                        entidad.DetalleImpuestosRetencion[indice] = new EntidadImpuestoRetencion()
                        {
                            Codigo = 1,
                            CodigoRetencion = obj.codigosri,
                            BaseImponible = obj.baseimpair.Value,
                            PorcentajeRetenido = obj.porcentaje.Value,
                            ValorRetenido = obj.valretair.Value,
                            CodigoDocumentoSustento = TgenCatalogoDetalleDal.Find(cxp.tcomprobanteccatalogo.Value, cxp.tcomprobantecdetalle).clegal,
                            DocumentoSustento = cxp.numdocumentosustento.Replace("-", ""),
                            FechaDocumentoSustento = cxp.ffacturasustento.Value.ToString("dd/MM/yyyy")
                        };
                        indice = indice + 1;
                    }

                    entidad.CusuarioIng = rm.Cusuario;
                    entidad.Fingreso = rm.Freal;
                    #endregion
                    break;
            }
            TcelLogDocumentosDal.UpdateDocumentoCorreccion(numeroDocumento, 3);
            CorreccionComprobante.GenerarEntidadDocumento(entidad);
        }

        public static List<IBean> DevolverDetalleImpuestosRenta(RqMantenimiento rqmantenimiento)
        {
            string cctaporpagar = rqmantenimiento.Response["cctaporpagar"].ToString();
            List<tconretencionfuente> lista = TconRetencionFuenteDal.Find(cctaporpagar);
            List<IBean> lbase = lista.ToList<IBean>();
            List<IBean> lmantenimiento = new List<IBean>();
            List<IBean> leliminar = new List<IBean>();

            if (rqmantenimiento.GetTabla("DETALLE") != null)
            {
                if (rqmantenimiento.GetTabla("DETALLE").Lregistros.Count > 0)
                {
                    lmantenimiento = rqmantenimiento.GetTabla("DETALLE").Lregistros;
                }
                if (rqmantenimiento.GetTabla("DETALLE").Lregeliminar.Count > 0)
                {
                    leliminar = rqmantenimiento.GetTabla("DETALLE").Lregeliminar;
                }
            }
            TconRetencionFuenteDal.Completar(rqmantenimiento, lmantenimiento);
            List<IBean> ldetalle = DtoUtil.GetMergedList(lbase, lmantenimiento, leliminar);
            return ldetalle;
        }
    }
}
