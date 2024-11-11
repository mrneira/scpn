using core.componente;
using modelo;
using System.Collections.Generic;
using util.dto.mantenimiento;
using System;
using System.Threading;
using System.Globalization;
using util;
using dal.contabilidad;
using core.servicios;
using dal.monetario;
using System.Linq;
using tesoreria.enums;
using dal.tesoreria;
using tesoreria.util;
using modelo.interfaces;
using dal.inversiones.inversiones;

using dal.inversiones.plantillacontable;
//using inversiones.comp.mantenimiento.inversiones;
//using inversiones.comp.mantenimiento.inversiones.contabilizar;


namespace tesoreria.comp.mantenimiento.bce.transferencia
{
    /// <summary>
    /// Permite actualizar el pago a la base
    /// </summary>
    /// <param name="rm"></param>
    public class AplicarPago : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rm)
        {
            Thread.CurrentThread.CurrentCulture = new CultureInfo("es-PE");
            if (rm.GetTabla("APLICARPAGOTRANSFERENCIA") == null || !rm.GetTabla("APLICARPAGOTRANSFERENCIA").Lregistros.Any())
            {
                return;
            }
            try
            {
                string tipotransaccion = (string)rm.Mdatos["tipotransaccion"];
                List<ttestransaccion> ltransaccion = new List<ttestransaccion>();
                List<ttesenvioarchivo> lenvio = new List<ttesenvioarchivo>();
                List<IBean> pagos = rm.GetTabla("APLICARPAGOTRANSFERENCIA").Lregistros;

                foreach (IBean pag in pagos)
                {
                    ttestransaccion tra = (ttestransaccion)pag;
                    tra.cestado = ((int)EnumTesoreria.EstadoPagoBce.Pagado).ToString();
                    ltransaccion.Add(tra);
                    ttesenvioarchivo envio = TtesEnvioArchivoDal.FindByNumeroReferencia(tra.numeroreferencia, tipotransaccion);
                    envio.estado = ((int)EnumTesoreria.EstadoPagoBce.Pagado).ToString();
                    envio.cantidadpago = ltransaccion.Count();
                    envio.valorpago = tra.valorpago;
                    lenvio.Add(envio);
                }
                rm.AdicionarTabla("ttestransaccion", ltransaccion, false);
                rm.AdicionarTabla("ttesenvioarchivo", lenvio, false);

                long lblnEsInversion = ActualizarInversiones(pagos, rm);

                if (lblnEsInversion != 0)
                {
                    tinvinversion Inv = TinvInversionDal.Find(lblnEsInversion);
                    if (!(Inv.instrumentocdetalle.ToString() == "CDP" || Inv.instrumentocdetalle.ToString() == "PA") && Inv.tasaclasificacioncdetalle.ToString() == "FIJA")
                    {
                        decimal totalPagosCarga = ltransaccion.Sum(x => x.valorpago);
                        rm.Monto = totalPagosCarga;
                        rm.Comentario = string.Format("PAGO TRANSFERENCIA");

                        if (totalPagosCarga > 0)
                        {
                            

                            ContabilizarInv(rm, Inv, "EGRESO", totalPagosCarga);

                        }
                    }


                }



            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        // INI

        public static void ContabilizarInv(RqMantenimiento rqmantenimiento, tinvinversion Inv, string itipodocumentocdetalle = "INGRES", decimal valor = 0)
        {
            //List<tconplantilladetalle> plantillaDetalle = TconPlantillaDetalleDal.Find(cplantilla, rqmantenimiento.Ccompania);
            tconcomprobante comprobante = CompletarComprobanteInv(rqmantenimiento, Inv, itipodocumentocdetalle); // lblnCompra, lblnReajuste);

            decimal montoComprobante = 0;

            List<tconcomprobantedetalle> comprobanteDetalle = CompletarComprobanteDetalleInv(rqmantenimiento, Inv, comprobante, ref montoComprobante, valor);

            comprobante.montocomprobante = montoComprobante;

            rqmantenimiento.Response["ccomprobante"] = comprobante.ccomprobante;
            rqmantenimiento.Response["numerocomprobantecesantia"] = comprobante.numerocomprobantecesantia;
            rqmantenimiento.AdicionarTabla("tconcomprobante", comprobante, false);
            rqmantenimiento.AdicionarTabla("tconcomprobantedetalle", comprobanteDetalle, false);
            rqmantenimiento.AdicionarTabla("tinviversion", Inv, false);
            rqmantenimiento.Mdatos.Add("actualizarsaldosenlinea", true);

            //SaldoEnLinea lSaldoLinea = new SaldoEnLinea();
            //lSaldoLinea.Ejecutar(rqmantenimiento);

            //tconcomprobante comprobante = CompletarComprobanteInv(rqmantenimiento, cplantilla, itipodocumentocdetalle);

            /*
            List<tconcomprobantedetalle> comprobanteDetalle = CompletarComprobanteDetalleInv(rqmantenimiento, cplantilla, comprobante, plantillaDetalle);
            rqmantenimiento.Response["ccomprobante"] = comprobante.ccomprobante;
            rqmantenimiento.Response["numerocomprobantecesantia"] = comprobante.numerocomprobantecesantia;
            foreach (ttestransaccion transaccion in lSpiPagosCorrectos)
            {
                transaccion.ccomprobante = comprobante.ccomprobante;
                transaccion.numerocomprobantecesantia = comprobante.numerocomprobantecesantia;
            }
            rqmantenimiento.AdicionarTabla("tconcomprobante", comprobante, false);
            rqmantenimiento.AdicionarTabla("tconcomprobantedetalle", comprobanteDetalle, false);
            */
        }



        public static void ContabilizarRespuestaBce(RqMantenimiento rqmantenimiento, int cplantilla, List<ttestransaccion> lSpiPagosCorrectos, string itipodocumentocdetalle = "INGRES")
        {
            List<tconplantilladetalle> plantillaDetalle = TconPlantillaDetalleDal.Find(cplantilla, rqmantenimiento.Ccompania);
            tconcomprobante comprobante = CompletarComprobante(rqmantenimiento, cplantilla, itipodocumentocdetalle);
            List<tconcomprobantedetalle> comprobanteDetalle = CompletarComprobanteDetalle(rqmantenimiento, cplantilla, comprobante, plantillaDetalle);
            rqmantenimiento.Response["ccomprobante"] = comprobante.ccomprobante;
            rqmantenimiento.Response["numerocomprobantecesantia"] = comprobante.numerocomprobantecesantia;
            foreach (ttestransaccion transaccion in lSpiPagosCorrectos)
            {
                transaccion.ccomprobante = comprobante.ccomprobante;
                transaccion.numerocomprobantecesantia = comprobante.numerocomprobantecesantia;
            }
            rqmantenimiento.AdicionarTabla("tconcomprobante", comprobante, false);
            rqmantenimiento.AdicionarTabla("tconcomprobantedetalle", comprobanteDetalle, false);
        }

        private static tconcomprobante CompletarComprobanteInv(RqMantenimiento rqmantenimiento, tinvinversion inversion, string itipodocumentocdetalle)
        {

            string operacion = itipodocumentocdetalle;

            tconcomprobante comprobante = new tconcomprobante();
            comprobante.anulado = false;
            comprobante.automatico = true;
            comprobante.cagencia = (int)(rqmantenimiento.Cagencia);
            comprobante.cagenciaingreso = comprobante.cagencia;
            comprobante.ccompania = (int)(rqmantenimiento.Ccompania);
            comprobante.ccomprobante = Secuencia.GetProximovalor("COMPROBANTE").ToString();
            comprobante.numerocomprobantecesantia = SecuenciaComprobanteContable.GetProximoValor(rqmantenimiento, operacion);
            comprobante.freal = rqmantenimiento.Freal;
            comprobante.fproceso = rqmantenimiento.Fproceso;
            comprobante.cmodulo = 12;

            comprobante.comentario = inversion.observaciones;

            comprobante.csucursal = comprobante.cagencia;
            comprobante.csucursalingreso = comprobante.cagencia;
            comprobante.cuadrado = true;
            comprobante.actualizosaldo = true;

            comprobante.ctransaccion = 12;

            //comprobante.ctransaccion = rqmantenimiento.Ctransaccion;

            comprobante.cusuarioing = rqmantenimiento.Cusuario;
            comprobante.eliminado = false;
            comprobante.fcontable = rqmantenimiento.Fconatable;
            comprobante.fingreso = rqmantenimiento.Freal;
            comprobante.optlock = 0;
            comprobante.particion = Constantes.GetParticion((int)rqmantenimiento.Fconatable);
            comprobante.tipodocumentoccatalogo = 1003;
            comprobante.tipodocumentocdetalle = operacion;
            comprobante.Esnuevo = true;
            comprobante.cconcepto = 3;
            rqmantenimiento.Response["fcontable"] = rqmantenimiento.Fconatable;
            rqmantenimiento.Response["ccompania"] = comprobante.ccompania;

            return comprobante;
        }



        public static tconcomprobante CompletarComprobante(RqMantenimiento rqmantenimiento, int cplantilla, string itipodocumentocdetalle = "INGRES")
        {
            tconcomprobante comprobante = new tconcomprobante();
            comprobante.anulado = false;
            comprobante.automatico = true;
            comprobante.cagencia = rqmantenimiento.Cagencia;
            comprobante.cagenciaingreso = comprobante.cagencia;
            comprobante.ccompania = rqmantenimiento.Ccompania;
            comprobante.ccomprobante = Secuencia.GetProximovalor("COMPROBANTE").ToString();
            comprobante.numerodocumentobancario = rqmantenimiento.Documento;
            comprobante.numerocomprobantecesantia = SecuenciaComprobanteContable.GetProximoValor(rqmantenimiento, itipodocumentocdetalle);
            comprobante.freal = rqmantenimiento.Freal;
            comprobante.fproceso = rqmantenimiento.Fproceso;
            comprobante.cmodulo = 10;
            comprobante.ruteopresupuesto = false;
            comprobante.aprobadopresupuesto = false;
            comprobante.comentario = rqmantenimiento.Comentario;
            comprobante.cplantilla = cplantilla;
            comprobante.csucursal = rqmantenimiento.Csucursal;
            comprobante.csucursalingreso = rqmantenimiento.Csucursal;
            comprobante.cuadrado = true;
            comprobante.actualizosaldo = true;
            comprobante.cusuarioing = rqmantenimiento.Cusuario;
            comprobante.eliminado = false;
            comprobante.fcontable = rqmantenimiento.Fconatable;
            comprobante.fingreso = rqmantenimiento.Freal;
            comprobante.optlock = 0;
            comprobante.particion = Constantes.GetParticion((int)rqmantenimiento.Fconatable);
            comprobante.tipodocumentoccatalogo = 1003;
            comprobante.tipodocumentocdetalle = itipodocumentocdetalle;
            comprobante.Esnuevo = true;
            return comprobante;
        }

        public static List<tconcomprobantedetalle> CompletarComprobanteDetalle(RqMantenimiento rqmantenimiento, decimal valor,
            tconcomprobante comprobante, List<tconplantilladetalle> plantillaDetalle)
        {
            decimal sumatorioDebitos = 0, sumatorioCreditos = 0;
            List<tconcomprobantedetalle> comprobanteDetalle = new List<tconcomprobantedetalle>();

            foreach (tconplantilladetalle pd2 in plantillaDetalle)
            {
                tconcomprobantedetalle cd = new tconcomprobantedetalle();
                cd.monto = 0;
                cd.montooficial = 0;
                cd.Esnuevo = true;
                cd.ccomprobante = comprobante.ccomprobante;
                cd.fcontable = comprobante.fcontable;
                cd.particion = comprobante.particion;
                cd.ccompania = comprobante.ccompania;
                cd.optlock = 0;
                cd.cagencia = comprobante.cagencia;
                cd.csucursal = comprobante.csucursal;
                cd.ccuenta = pd2.ccuenta;
                cd.debito = pd2.debito;
                cd.numerodocumentobancario = null;
                cd.cclase = TconCatalogoDal.Find(comprobante.ccompania, cd.ccuenta).cclase;
                cd.cmoneda = rqmantenimiento.Cmoneda == null ? "USD" : rqmantenimiento.Cmoneda;
                cd.cmonedaoficial = rqmantenimiento.Cmoneda == null ? "USD" : rqmantenimiento.Cmoneda;
                cd.cusuario = comprobante.cusuarioing;
                cd.cmonedaoficial = rqmantenimiento.Cmoneda;
                cd.suma = TmonClaseDal.Suma(cd.cclase, cd.debito);
                cd.centrocostosccatalogo = pd2.centrocostosccatalogo;
                cd.centrocostoscdetalle = pd2.centrocostoscdetalle;
                cd.monto = rqmantenimiento.Monto;
                cd.montooficial = rqmantenimiento.Monto;
                comprobanteDetalle.Add(cd);
                if (cd.debito.Value) sumatorioDebitos += cd.monto.Value;
                else sumatorioCreditos += cd.monto.Value;
            }

            if (sumatorioCreditos != sumatorioDebitos)
            {
                throw new AtlasException("CONTA-011", "ERROR: NO ES POSIBLE GENERAR COMPROBANTE CONTABLE, VALORES INGRESADOS NO CUADRAN DEBITOS Y CREDITOS");
            }
            return comprobanteDetalle;
        }

        public static List<tconcomprobantedetalle> CompletarComprobanteDetalleInv(
            RqMantenimiento rqmantenimiento,
            tinvinversion inversion,
            tconcomprobante comprobante,
            ref decimal montoComprobante, decimal valor)
        {

            List<tconcomprobantedetalle> comprobanteDetalle = new List<tconcomprobantedetalle>();

            List<tinvplantillacontable> tinvPlaConCXP = TinvPlantillaContableDal.FindPorCDetalle("BCFSPI", (int)1219);

            List<tinvplantillacontable> tinvPlaConCXC = TinvPlantillaContableDal.FindBancos("BANCOS", (int)1219, (int)1224, "BC");

            decimal lmonto = valor;

            montoComprobante = lmonto;

            int secuencia = 1;

            tconcomprobantedetalle detalleContable1 = new tconcomprobantedetalle();
            detalleContable1.monto = lmonto;
            detalleContable1.montooficial = lmonto;
            detalleContable1.Esnuevo = true;
            detalleContable1.ccomprobante = comprobante.ccomprobante;
            detalleContable1.fcontable = comprobante.fcontable;
            detalleContable1.particion = comprobante.particion;
            detalleContable1.ccompania = comprobante.ccompania;
            detalleContable1.optlock = 0;
            detalleContable1.cagencia = comprobante.cagencia;
            detalleContable1.csucursal = comprobante.csucursal;
            detalleContable1.ccuenta = tinvPlaConCXP[0].ccuenta;
            detalleContable1.debito = true;
            detalleContable1.cclase = TconCatalogoDal.Find(comprobante.ccompania, detalleContable1.ccuenta).cclase;
            detalleContable1.cmoneda = inversion.monedacdetalle;
            detalleContable1.cmonedaoficial = "USD";
            detalleContable1.cusuario = comprobante.cusuarioing;
            detalleContable1.cmonedaoficial = rqmantenimiento.Cmoneda;
            detalleContable1.suma = TmonClaseDal.Suma(detalleContable1.cclase, detalleContable1.debito);
            detalleContable1.centrocostosccatalogo = inversion.centrocostoccatalogo;
            detalleContable1.centrocostoscdetalle = inversion.centrocostocdetalle;
            comprobanteDetalle.Add(detalleContable1);

            secuencia++;

            tconcomprobantedetalle detalleContable = new tconcomprobantedetalle();
            detalleContable.monto = lmonto;
            detalleContable.montooficial = lmonto;
            detalleContable.Esnuevo = true;
            detalleContable.ccomprobante = comprobante.ccomprobante;
            detalleContable.fcontable = comprobante.fcontable;
            detalleContable.particion = comprobante.particion;
            detalleContable.ccompania = comprobante.ccompania;
            detalleContable.optlock = 0;
            detalleContable.cagencia = comprobante.cagencia;
            detalleContable.csucursal = comprobante.csucursal;
            detalleContable.ccuenta = tinvPlaConCXC[0].ccuenta;
            detalleContable.debito = false;
            detalleContable.cclase = TconCatalogoDal.Find(comprobante.ccompania, detalleContable.ccuenta).cclase;
            detalleContable.cmoneda = inversion.monedacdetalle;
            detalleContable.cmonedaoficial = "USD";
            detalleContable.cusuario = comprobante.cusuarioing;
            detalleContable.cmonedaoficial = rqmantenimiento.Cmoneda;
            detalleContable.suma = TmonClaseDal.Suma(detalleContable.cclase, detalleContable.debito);
            detalleContable.centrocostosccatalogo = inversion.centrocostoccatalogo;
            detalleContable.centrocostoscdetalle = inversion.centrocostocdetalle;
            comprobanteDetalle.Add(detalleContable);

            return comprobanteDetalle;
        }



        private long ActualizarInversiones(List<IBean> pagos, RqMantenimiento rm)
        {
            long lblnControl = 0;
            foreach (IBean pag in pagos)
            {
                ttestransaccion tra = (ttestransaccion)pag;
                if (tra.cmodulo == 12)
                {
                    TinvInversionDal.actualizaEstadoPagada(long.Parse(tra.referenciainterna));
                    lblnControl = long.Parse(tra.referenciainterna);
                    //lblnControl = true;
                }
            }
            return lblnControl;
        }
    }
}
