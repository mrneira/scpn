using contabilidad.saldo;
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
using util.servicios.ef;
using util.thread;

namespace facturacion.util {

    /// <summary>
    /// Clase que se encarga de realizar contabilizacion de facturas consolidado.
    /// </summary>
    public class ContabilizaFacturaConsolidada {

        private int secuenia = 1;
        /// <summary>
        /// Ejecuta la contabilizacion de facturas de forma consolidada.
        /// </summary>
        /// <param name="rqMantenimiento">Request con el que se ejecuta la transaccion.</param>
        public void Ejecutar(RqMantenimiento rqMantenimiento) {
            ThreadNegocio.RemoveDatos();
            Datos d = new Datos();
            ThreadNegocio.FijarDatos(d);

            IList<Dictionary<string, object>> lfacturas = TfacFacturaDal.GetFacturasContabilizar(rqMantenimiento.Fconatable);
            foreach (Dictionary<string, object> mfactura in lfacturas) {
                this.Contabilizar(rqMantenimiento, mfactura);
            }

            // Marcar facturas como contabilizadas.
            TfacFacturaDal.MarcarContabilizados(rqMantenimiento.Fconatable);
        }

        /// <summary>
        /// Crea comprobante contable por sucursal, agencia, transaccion origen.
        /// </summary>
        /// <param name="rqMantenimiento">Request con el que se ejecuta la transaccion.</param>
        /// <param name="mfactura">Datos de la factura a contabilizar, por sucursal, agencia y transaccion origen.</param>
        private void Contabilizar(RqMantenimiento rqMantenimiento, Dictionary<string, object> mfactura) {
            int ccia = int.Parse(mfactura["ccompania"].ToString());
            int cagen = int.Parse(mfactura["cagencia"].ToString());
            int csuc = int.Parse(mfactura["csucursal"].ToString());
            int cmod = int.Parse(mfactura["cmoduloorg"].ToString());
            int ctran = int.Parse(mfactura["ctransaccionorg"].ToString());
            int ffactura = int.Parse(mfactura["ffactura"].ToString());

            List<tconcomprobantedetalle> lDetalle = new List<tconcomprobantedetalle>();
            tconcomprobante comprobante = this.CrearComprobante(rqMantenimiento, ccia, cagen, csuc, cmod, ctran, ffactura);

            // contabilizacion de detalle de la factura.
            IList<Dictionary<string, object>> lfacturasdet = TfacFacturaDal.GetFacturasDetContabilizar(ffactura, ccia, csuc, cagen, cmod, ctran);
            this.CreaComprobanteDetalleProductos(comprobante, lfacturasdet, lDetalle);

            // contabilizacion de detalle de forma de pago.
            IList<Dictionary<string, object>> lformapago = TfacFacturaDal.GetFacturasFormaPago(ffactura, ccia, csuc, cagen, cmod, ctran);
            this.CreaComprobanteDetalleFormaPago(comprobante, lformapago, lDetalle);
            this.TotalizarCabecera(comprobante, lDetalle);

            SaldoHelper sh = new SaldoHelper();
            sh.Actualizar(rqMantenimiento.Response, comprobante, lDetalle.ToList<IBean>());
            comprobante.actualizosaldo = true;

            // graba el comprobante en la base de datos.
            Sessionef.Save(comprobante);
            foreach (tconcomprobantedetalle detalle in lDetalle) {
                Sessionef.Save(detalle);
            }
        }

        /// <summary>
        /// Crea cabecera de un comprobante contable.
        /// </summary>
        /// <param name="rqMantenimiento">Request con el que se ejecuta la transaccion.</param>
        /// <param name="mfactura">Datos de la factura a contabilizar, por sucursal, agencia y transaccion origen.</param>
        /// <returns></returns>
        private tconcomprobante CrearComprobante(RqMantenimiento rqMantenimiento, int ccia, int cagen, int csuc, int cmod, int ctran, int ffactura) {
            string ccomprobante = Secuencia.GetProximovalor("COMPROBANTE").ToString();
            string numerocomprobantecesantia = SecuenciaComprobanteContable.GetProximoValor(rqMantenimiento, "DIAGEN");
            tconcomprobante comprobante = TconComprobanteDal.CrearComprobante(ccomprobante, ffactura, Constantes.GetParticion(ffactura),
                ccia, 0, null, null, null, rqMantenimiento.Freal, rqMantenimiento.Fproceso, "PUNTO DE VENTA", true, true, false, false, false, false, false,
                null, null, cagen, csuc, ctran, cmod, 1003, "DIAGEN", cagen,
                csuc, 0, numerocomprobantecesantia, null, null, null,
                null, null, null, rqMantenimiento.Cusuario, rqMantenimiento.Freal, null, null);
            comprobante.Esnuevo = true;
            comprobante.cconcepto = null;
            return comprobante;
        }

        /// <summary>
        /// Actualiza totales en la cabecera del comprobante contable.
        /// </summary>
        /// <param name="cabecra">Cabecera del comprobante contable.</param>
        /// <param name="lDetalle">Lista de asisentos del comprobante contable.</param>
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
        private void CreaComprobanteDetalleFormaPago(tconcomprobante comprobante, IList<Dictionary<string, object>> lformapago, List<tconcomprobantedetalle> lDetalle) {
            bool debito = true;
            foreach (Dictionary<string, object> mdet in lformapago) {
                String ccuenta = TfacFormaPagoDal.GetCodigoContable(mdet["cformapago"].ToString());
                tconcomprobantedetalle cd = TconComprobanteDetalleDal.CrearComprobanteDetalle(true, comprobante, 0, null, null, debito, null, "USD", "USD", 0, 0, null, null, 1002, "CCPC", null, null);
                this.CompletarDatosContables(cd, ccuenta, Convert.ToDecimal(mdet["monto"].ToString()));
                lDetalle.Add(cd);
            }
        }

        /// <summary>
        /// Crea asisto contable de cada producto de la factura.
        /// </summary>
        /// <param name="comprobante">Cabecera del comprobante contable.</param>
        /// <param name="lfactdetalle">Lista de productos facturados.</param>
        /// <param name="lDetalle">Lista de asisentos contables</param>
        private void CreaComprobanteDetalleProductos(tconcomprobante comprobante, IList<Dictionary<string, object>> lfactdetalle, List<tconcomprobantedetalle> lDetalle) {
            bool debito = false;
            foreach (Dictionary<string, object> mdet in lfactdetalle) {
                int cprod = int.Parse(mdet["cproducto"].ToString());
                tfacproducto p = TfacProductoDal.FindInDataBase(cprod);
                String ccuenta = TfacProductoDal.GetCodigoContable(cprod);
                tconcomprobantedetalle cd = TconComprobanteDetalleDal.CrearComprobanteDetalle(true, comprobante, 0, null, null, debito, null, "USD", "USD", 0, 0, null, null, 1002, "CCPC", null, null);
                this.CompletarDatosContables(cd, ccuenta, Convert.ToDecimal(mdet["subtotal"].ToString()) );
                lDetalle.Add(cd);                

                if(mdet["cimpuestoiva"] != null) {
                    this.CreaComprobanteImpuestos(comprobante, lDetalle, int.Parse(mdet["cimpuestoiva"].ToString()), Convert.ToDecimal(mdet["iva"].ToString()), debito);
                }
                if(mdet["cimpuestoice"] != null) {
                    this.CreaComprobanteImpuestos(comprobante, lDetalle, int.Parse(mdet["cimpuestoice"].ToString()), Convert.ToDecimal(mdet["ice"].ToString()), debito);
                }
                if(mdet["cimpuestoirbpnr"] != null) {
                    this.CreaComprobanteImpuestos(comprobante, lDetalle, int.Parse(mdet["cimpuestoirbpnr"].ToString()), Convert.ToDecimal(mdet["irbpnr"].ToString()), debito);
                }

                if(p.ccontablecompdebito != null && p.ccontablecompcredito != null) {
                    // contabilizacion de compensacion 
                    tconcomprobantedetalle cdeb = (tconcomprobantedetalle)cd.Clone();
                    cdeb.debito = true;
                    this.CompletarDatosContables(cdeb, p.ccontablecompdebito, Convert.ToDecimal(mdet["subtotal"].ToString()));
                    lDetalle.Add(cdeb);

                    tconcomprobantedetalle ccre = (tconcomprobantedetalle)cd.Clone();
                    ccre.debito = false;
                    this.CompletarDatosContables(ccre, p.ccontablecompcredito, Convert.ToDecimal(mdet["subtotal"].ToString()));
                    lDetalle.Add(ccre);
                }
                
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
        private void CreaComprobanteImpuestos(tconcomprobante comprobante, List<tconcomprobantedetalle> lDetalle, int? cimpuesto, decimal? monto, bool debito) {
            if (monto == null || monto <= 0) {
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
            if (catalogo == null) {
                throw new AtlasException("FAC-005", "CUENTA CONTABLE: [{0}] NO DEFINIDA EN EL PLAN DE CUENTAS", ccuenta);
            }
            cd.ccuenta = ccuenta;
            cd.cclase = catalogo.cclase;
            cd.suma = TmonClaseDal.Suma(cd.cclase, cd.debito);
            decimal valor = Math.Round(monto.Value, 2);
            cd.monto = valor;
            cd.montooficial = valor;
            cd.secuencia = this.secuenia;
            this.secuenia = this.secuenia + 1;
        }

    }
}
