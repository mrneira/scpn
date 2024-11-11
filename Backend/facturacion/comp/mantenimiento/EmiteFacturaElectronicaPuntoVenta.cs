using System.Collections.Generic;
using System.Linq;
using System.Globalization;
using System.Threading;
using core.componente;
using util.dto.mantenimiento;
using util;
using dal.facturacion;
using dal.contabilidad;
using System;
using modelo;
using facturacionelectronica.comp.consulta.entidades;
using dal.persona;
using dal.generales;

namespace facturacion.comp.mantenimiento
{
    /// <summary>
    /// Clase que se encarga de completar los datos faltantes de una direccion
    /// </summary>
    public class EmiteFacturaElectronicaPuntoVenta : ComponenteMantenimiento
    {

        tfacfactura factura;

        tfaccliente cliente;

        /// <summary>
        /// Metodo que se encarga de completar los datos faltantes
        /// </summary>
        /// <param name="rm">Request del mantenimiento</param>
        public override void Ejecutar(RqMantenimiento rm)
        {
            long? cfactura = rm.GetLong("cfactura");
            this.factura = TfacFacturaDal.FindInDataBase(cfactura);
            this.cliente = TfacClienteDal.FindInDataBase(this.factura.ccliente??0);

            IList<tfacfacturadetalle> lrubros = TfacFacturaDetalleDal.FindInDataBase(cfactura);
            if (!lrubros.Any())
            {
                throw new AtlasException("FAC-001", "FACTURA [{0}] NO TIENE RUBROS");
            }
            IList<tfacfacturaformapago> lpagos = TfacFacturaFormaPagoDal.FindInDataBase(cfactura);

            EntidadComprobante entidad = new EntidadComprobante();
            entidad.FechaEmisionDocumento = Fecha.GetFechaSri(Fecha.IntToDate(factura.ffactura??0));
            entidad.Establecimiento = factura.numfactura.Substring(0, 3);
            entidad.PuntoEmision = factura.numfactura.Substring(4, 3);
            entidad.Secuencial = factura.numfactura.Substring(8, 9);
            entidad.Ccompania = rm.Ccompania;

            entidad.IdentificacionComprador = cliente.identificacion;
            entidad.RazonSocialComprador = cliente.razonsocial;

            entidad.ImporteTotal = factura.total??0;
            entidad.Moneda = "DOLAR";
            entidad.Propina = 0;
           
            entidad.TipoDocumento = TgenCatalogoDetalleDal.Find(1018, "FA").clegal;

            if (cliente.identificacion.Length == 13 && cliente.identificacion.CompareTo("9999999999999") == 0 || cliente.identificacion.Length == 10 && cliente.identificacion.CompareTo("9999999999") == 0)
            {
                entidad.TipoIdentificacionComprador = "07";
            }
            else if (cliente.identificacion.Length == 13 && cliente.identificacion.CompareTo("9999999999999") != 0)
            {
                entidad.TipoIdentificacionComprador = "04";
            }
            else if (cliente.identificacion.Length == 10 && cliente.identificacion.CompareTo("9999999999") != 0)
            {
                entidad.TipoIdentificacionComprador = "05";
            }
            else if (cliente.identificacion.Length == 7)
            {
                entidad.TipoIdentificacionComprador = "09";
            }
            else {
                entidad.TipoIdentificacionComprador = "06";
            }
            
            entidad.TotalDescuento = 0;
            entidad.TotalIce = 0;
            entidad.TotalIva = 0;
            entidad.TotalSinImpuestos = 0;
            entidad.CusuarioIng = rm.Cusuario;
            entidad.Fingreso = rm.Freal;

            this.CargaDetalleFactura(entidad, lrubros);
            this.CargaPagosFactura(entidad, lpagos);

            facturacionelectronica.comp.mantenimiento.GenerarDocumentoElectronico.GenerarDocumento(entidad);
            factura.claveaccesosri = entidad.ClaveAcceso;
            rm.Response.Add("claveacceso", entidad.ClaveAcceso);
            rm.Response.Add("numdocumento", factura.numfactura);
        }

        private void CargaDetalleFactura(EntidadComprobante entidad, IList<tfacfacturadetalle> lrubros) {
            int cantidad = lrubros.Count();
            entidad.Detalles = new EntidadDetalle[cantidad];
            int counter = 0;

            foreach (tfacfacturadetalle rubro in lrubros)
            {
                decimal? descuentorubro = rubro.descuento != null ? rubro.descuento : Decimal.Zero;
                entidad.TotalSinImpuestos = entidad.TotalSinImpuestos + rubro.subtotal ?? 0;
                entidad.TotalDescuento = entidad.TotalDescuento + descuentorubro ?? 0;
                entidad.TotalIva = entidad.TotalIva + rubro.iva ?? 0;
                entidad.TotalIce = entidad.TotalIce + rubro.ice ?? 0;

                this.AgregarDetalleFactura(entidad, rubro, counter);
                counter++;
            }

            tfacimpuesto iva = TfacImpuestoDal.FindInDataBase(lrubros.ElementAt(0).cimpuestoiva);
            entidad.ImporteTotal = entidad.TotalSinImpuestos - entidad.TotalDescuento + entidad.TotalIva + entidad.TotalIce;
            entidad.DetalleImpuestos = new EntidadImpuesto[1];
            entidad.DetalleImpuestos[0] = new EntidadImpuesto()
            {
                TipoImpuesto = int.Parse(iva.codimpuesto),
                CodigoImpuesto = int.Parse(iva.codporcentaje),
                BaseImponible = entidad.TotalSinImpuestos + entidad.TotalDescuento,
                Valor = entidad.TotalIva,
                Tarifa = iva.porcentaje??0,
                DescuentoAdicional = entidad.TotalDescuento
            };
        }

        private void AgregarDetalleFactura(EntidadComprobante entidad, tfacfacturadetalle rubro, int counter) {
                tfacproducto prod = TfacProductoDal.FindInDataBase(rubro.cproducto);
                entidad.Detalles[counter] = new EntidadDetalle()
                {
                    CodigoPrincipal = rubro.cproducto.ToString(),
                    CodigoAuxiliar = rubro.cproducto.ToString(),
                    PrecioUnitario = rubro.preciounitario??0,
                    Descripcion = prod.nombre,
                    Cantidad = rubro.cantidad??0,
                    Descuento = rubro.descuento??0,
                    PrecioTotalSinImpuesto = rubro.subtotal??0
                };

                tfacimpuesto iva = TfacImpuestoDal.FindInDataBase(rubro.cimpuestoiva);

                entidad.Detalles[counter].ImpuestosDetalle = new EntidadImpuestoDetalle[1];
                entidad.Detalles[counter].ImpuestosDetalle[0] = new EntidadImpuestoDetalle()
                {
                    TipoImpuesto = int.Parse(iva.codimpuesto),
                    CodigoImpuesto = int.Parse(iva.codporcentaje),
                    BaseImponible = rubro.subtotal,
                    Valor = rubro.iva,
                    Tarifa = iva.porcentaje
                };
        }


        private void CargaPagosFactura(EntidadComprobante entidad, IList<tfacfacturaformapago> lpagos)
        {
            int cantidad = lpagos.Count();
            entidad.Pagos = new EntidadPago[cantidad];
            int counter = 0;

            foreach (tfacfacturaformapago item in lpagos)
            {
                tgenunidadmedida um = TgenUnidadMedidaDal.FindInDataBase(item.cmedida);
                entidad.Pagos[counter] = new EntidadPago()
                {
                    FormaPago = item.cformapago,
                    Plazo = Decimal.Parse(item.valormedida.ToString()),
                    Total = item.monto ?? 0,
                    UnidadTiempo = um.nombre
                };
            }
        }

    }

}
