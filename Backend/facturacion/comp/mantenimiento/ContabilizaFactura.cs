using contabilidad.saldo;
using core.componente;
using core.servicios;
using dal.contabilidad;
using dal.facturacion;
using dal.monetario;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;

namespace facturacion.comp.mantenimiento {
    public class ContabilizaFactura : ComponenteMantenimiento {
        /// <summary>
        /// Clase que se encarga de generar comprobante contables de unaa factura, genera un registro de detalle por cada registro de productos de la factura.
        /// </summary>
        /// <param name="rm">Request del mantenimiento</param>
        public override void Ejecutar(RqMantenimiento rm) {
            if(rm.Ccompania == 1) {
                return; // se contabiza en batch.
            }
            
            tfacfactura factura = (tfacfactura)rm.GetTabla("TFACFACTURA").Lregistros.ElementAt(0);
            List<tfacfacturadetalle> lfactdetalle = rm.GetTabla("TFACFACTURADETALLE").Lregistros.Cast<tfacfacturadetalle>().ToList();
            List<tfacfacturaformapago> lfacfpago = rm.GetTabla("TFACFACTURAFORMAPAGO").Lregistros.Cast<tfacfacturaformapago>().ToList();
            List<tconcomprobantedetalle> lDetalle = new List<tconcomprobantedetalle>();

            tconcomprobante cabecra = this.CrearComprobante(rm, factura);
            this.CreaComprobanteDetalleFormaPago(cabecra, lfacfpago, lDetalle);
            this.CreaComprobanteDetalleProductos(cabecra, lfactdetalle, lDetalle);

            // Actualiza saldos contables.
            SaldoHelper sh = new SaldoHelper();
            sh.Actualizar(rm.Response, cabecra, lDetalle.ToList<IBean>());
            cabecra.actualizosaldo = true;
            factura.contabilizado = true;
            rm.AdicionarTabla("COMPROBANTE", cabecra, false);
            rm.AdicionarTabla("COMPDETALLE", lDetalle, false);
        }

        /// <summary>
        /// Crea cabecera de un comprobante contable.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        /// <param name="factura">Objeto que contiene la cabera de un factura.</param>
        /// <returns></returns>
        private tconcomprobante CrearComprobante(RqMantenimiento rqmantenimiento, tfacfactura factura) {
            string ccomprobante = Secuencia.GetProximovalor("COMPROBANTE").ToString();
            string numerocomprobantecesantia = SecuenciaComprobanteContable.GetProximoValor(rqmantenimiento, "DIAGEN");
            tconcomprobante comprobante = TconComprobanteDal.CrearComprobante(ccomprobante, (int)factura.ffactura, Constantes.GetParticion((int)factura.ffactura),
                (int)factura.ccompania, 0, null, null, null, rqmantenimiento.Freal, rqmantenimiento.Fproceso, "PUNTO DE VENTA", true, true, false, false, false, false, false,
                null, null, factura.cagencia, factura.csucursal, factura.ctransaccionorg, factura.cmoduloorg, 1003, "DIAGEN", factura.cagencia,
                factura.csucursal, 0, numerocomprobantecesantia, null, null, null,
                null, null, null, rqmantenimiento.Cusuario, rqmantenimiento.Freal, null, null);
            comprobante.Esnuevo = true;
            comprobante.cconcepto = null;
            return comprobante;
        }

        private void TotalizarCabecera(tconcomprobante cabecra, List<tconcomprobantedetalle> lDetalle) {
            decimal total = 0;
            decimal totalofi = 0;
            foreach (tconcomprobantedetalle obj in lDetalle) {
                total = total + (decimal)obj.monto;
                totalofi = totalofi + (decimal)obj.montooficial;
            }
            cabecra.montocomprobante = total;
        }

        /// <summary>
        /// Crea asisto contable de cada forma de pago de la factura.
        /// </summary>
        /// <param name="comprobante">Cabecera del comprobante contable.</param>
        /// <param name="lfpago">Lista de formas de pago con los que cancela la factura.</param>
        /// <param name="lDetalle">Lista de asisentos contables</param>
        private void CreaComprobanteDetalleFormaPago(tconcomprobante comprobante, List<tfacfacturaformapago> lfpago, List<tconcomprobantedetalle> lDetalle) {
            bool debito = true;
            foreach(tfacfacturaformapago obj in lfpago) {
                String ccuenta = TfacFormaPagoDal.GetCodigoContable(obj.cformapago);
                tconcomprobantedetalle cd = TconComprobanteDetalleDal.CrearComprobanteDetalle(true, comprobante, 0, null, null, debito, null, "USD", "USD", 0, 0, null, null, 1002, "CCPC", null, null);
                this.CompletarDatosContables(cd, ccuenta, obj.monto);
                lDetalle.Add(cd);
            }
        }

        /// <summary>
        /// Crea asisto contable de cada producto de la factura.
        /// </summary>
        /// <param name="comprobante">Cabecera del comprobante contable.</param>
        /// <param name="lfactdetalle">Lista de productos facturados.</param>
        /// <param name="lDetalle">Lista de asisentos contables</param>
        private void CreaComprobanteDetalleProductos(tconcomprobante comprobante, List<tfacfacturadetalle> lfactdetalle, List<tconcomprobantedetalle> lDetalle) {
            bool debito = false;
            foreach (tfacfacturadetalle obj in lfactdetalle) {
                String ccuenta = TfacProductoDal.GetCodigoContable(obj.cproducto);
                tconcomprobantedetalle cd = TconComprobanteDetalleDal.CrearComprobanteDetalle(true, comprobante, 0, null, null, debito, null, "USD", "USD", 0, 0, null, null, 1002, "CCPC", null, null);
                this.CompletarDatosContables(cd, ccuenta, obj.subtotal);
                lDetalle.Add(cd);

                this.CreaComprobanteImpuestos(comprobante, obj, lDetalle, obj.cimpuestoiva, obj.iva, debito);
                this.CreaComprobanteImpuestos(comprobante, obj, lDetalle, obj.cimpuestoice, obj.ice, debito);
                this.CreaComprobanteImpuestos(comprobante, obj, lDetalle, obj.cimpuestoirbpnr, obj.irbpnr, debito);
            }
        }

        /// <summary>
        /// Crea asiento contable de impuestos.
        /// </summary>
        /// <param name="comprobante">Cabecera del comprobante contable.</param>
        /// <param name="factdetalle">Datos de un producto de la factura.</param>
        /// <param name="lDetalle">Lista de asisentos contables</param>
        /// <param name="cimpuesto">Codigo de impuesto</param>
        /// <param name="monto">Valor del impuesto</param>
        /// <param name="debito">true, crea un asiento de debto, false crea el asiento como credito.</param>
        private void CreaComprobanteImpuestos(tconcomprobante comprobante, tfacfacturadetalle factdetalle, List<tconcomprobantedetalle> lDetalle, int? cimpuesto, decimal? monto, bool debito) {
            if(monto == null || monto <= 0) {
                return;
            }
            String ccuenta = TfacImpuestoDal.GetCodigoContable(cimpuesto);
            tconcomprobantedetalle cd = TconComprobanteDetalleDal.CrearComprobanteDetalle(true, comprobante, 0, null, null, debito, null, "USD", "USD", 0, 0, null, null, 1002, "CCPC", null, null);
            this.CompletarDatosContables(cd, ccuenta, monto);
            lDetalle.Add(cd);
        }

        /// <summary>
        /// Completa datos del comprobante contable.
        /// </summary>
        /// <param name="cd">Objero que tiene un registro de detalle del comprobante contable.</param>
        /// <param name="ccuenta">Numero de cuenta contable</param>
        /// /// <param name="ccuenta">Monto del asietnto contable.</param>
        private void CompletarDatosContables(tconcomprobantedetalle cd, string ccuenta, decimal? monto) {
            tconcatalogo catalogo = TconCatalogoDal.Find(cd.ccompania, ccuenta);
            if (catalogo == null ) {
                throw new AtlasException("FAC-005", "CUENTA CONTABLE: [{0}] NO DEFINIDA EN EL PLAN DE CUENTAS", ccuenta);
            }
            cd.ccuenta = ccuenta;
            cd.cclase = catalogo.cclase;
            cd.suma = TmonClaseDal.Suma(cd.cclase, cd.debito);
            decimal valor = Math.Round(monto.Value, 2);
            cd.monto = valor;
            cd.montooficial = valor;
        }

    }
}