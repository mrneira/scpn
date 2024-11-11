using bce.util;
using core.componente;
using core.servicios;
using dal.contabilidad;
using dal.monetario;
using dal.seguros;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace seguros.comp.mantenimiento.pago {
    /// <summary>
    /// Metodo que se encarga de registrar los pagos realizados
    /// </summary>
    public class PagarSeguros : ComponenteMantenimiento {

        int cpago = Constantes.CERO;
        decimal totalpago = Constantes.CERO;
        Dictionary<String, decimal> lrubros = new Dictionary<String, decimal>();

        /// <summary>
        /// Registra los pagos de seguros
        /// </summary>
        /// <param name="rm">Request del mantenimiento</param>
        public override void Ejecutar(RqMantenimiento rm)
        {
            if (rm.GetTabla("POLIZAS") == null) {
                throw new AtlasException("SGS-0003", "NO EXISTEN PÓLIZAS PARA PROCESAR PAGO");
            }

            if (!rm.Mdatos.ContainsKey("caseguradora")) {
                throw new AtlasException("SGS-0004", "NO EXISTE ASEGURADORA PARA PROCESA PAGO");
            }
            totalpago = Constantes.CERO;
            cpago = Constantes.CERO;
            // Aseguradora
            tsgsaseguradora aseguradora = TsgsAseguradoraDal.Find(int.Parse(rm.Mdatos["caseguradora"].ToString()));
            string ccomprobante = Secuencia.GetProximovalor("COMPROBANTE").ToString();

            // Completar datos
            CompletarPago(rm, ccomprobante, aseguradora);
            CompletarSPI(rm, aseguradora, ccomprobante);

            // Contabilizar
            ContabilizarPago(rm, ccomprobante, aseguradora, lrubros, totalpago);
            rm.Response["FINALIZADO"] = true;
        }

        /// <summary>
        /// Completa la informacion de pago
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        /// <param name="ccomprobante">Numero de comprobante contable.</param>
        /// <param name="aseguradora">Datos de aseguradora.</param>
        public void CompletarPago(RqMantenimiento rqmantenimiento, string ccomprobante, tsgsaseguradora aseguradora)
        {
            // Secuencia de pago
            cpago = int.Parse(Secuencia.GetProximovalor("PAGOSEGURO").ToString());

            // Datos pago
            List<tsgspago> lpagos = new List<tsgspago>();
            tsgspago pago = new tsgspago();
            pago.cpago = cpago;
            pago.caseguradora = aseguradora.caseguradora;
            pago.numeroreferencia = int.Parse(ccomprobante); // Referencia comprobante contable
            pago.cusuarioing = rqmantenimiento.Cusuario;
            pago.freal = rqmantenimiento.Freal;
            pago.fingreso = rqmantenimiento.Fconatable;
            pago.mensaje = rqmantenimiento.Mensaje;
            lpagos.Add(pago);

            // Agrega codigo de pago
            List<tsgstiposeguro> ltiposeguro = new List<tsgstiposeguro>();
            IList<tsgspoliza> lpolizas = rqmantenimiento.GetTabla("POLIZAS").Lregistros.Cast<tsgspoliza>().ToList();
            foreach (tsgspoliza pol in lpolizas) {
                pol.cpago = cpago;
                totalpago += (decimal)pol.valorfactura;

                // Diccionario de cuentas contables
                string codigocontable = TmonSaldoDal.Find(TsgsTipoSeguroDetalleDal.Find((int)pol.ctiposeguro).csaldo).codigocontable;
                if (lrubros.ContainsKey(codigocontable)) {
                    lrubros[codigocontable] = decimal.Add(lrubros[codigocontable], (decimal)pol.valorfactura);
                } else {
                    lrubros.Add(codigocontable, (decimal)pol.valorfactura);
                }
            }

            // Adiciona tablas al request
            rqmantenimiento.AdicionarTabla(typeof(tsgspago).Name.ToUpper(), lpagos, false);
        }

        /// <summary>
        /// Completa la informacion de pago
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        /// <param name="referenciaspi">Numero de referencia SPI.</param>
        /// <param name="aseguradora">Datos de aseguradora.</param>
        public void CompletarSPI(RqMantenimiento rqmantenimiento, tsgsaseguradora aseguradora, string ccomprobante)
        {
            GenerarBce.InsertarPagoBce(rqmantenimiento, aseguradora.ruc, aseguradora.nombre, aseguradora.numerocuentabancaria, aseguradora.caseguradora, aseguradora.tipocuentaccatalogo.Value, aseguradora.tipocuentacdetalle,
                aseguradora.tipoinstitucionccatalogo.Value, aseguradora.tipoinstitucioncdetalle, totalpago, cpago.ToString(), null, ccomprobante);
        }

        /// <summary>
        /// Realiza la contabilizacion de pago a la aseguradora
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        /// <param name="montototal">Monto de pago SPI.</param>
        public static void ContabilizarPago(RqMantenimiento rqmantenimiento, string ccomprobante, tsgsaseguradora aseguradora, Dictionary<String, decimal> lrubros, decimal montototal)
        {
            int cplantilla = (int)TconParametrosDal.FindXCodigo("PLANTILLA_CONTABLE_ASEGURADORA", rqmantenimiento.Ccompania).numero;
            if (cplantilla == 0) {
                throw new AtlasException("BCAR-0023", "VALOR NUMERICO PARA EL PARAMETRO NO DEFINIDO EN TCARPARAMETROS CODIGO: {0} COMPANIA: {1}", "PLANTILLA_CONTABLE_ASEGURADORA", rqmantenimiento.Ccompania);
            }

            List<tconplantilladetalle> plantillaDetalle = TconPlantillaDetalleDal.Find(cplantilla, rqmantenimiento.Ccompania);
            tconcomprobante comprobante = CompletarComprobante(rqmantenimiento, ccomprobante, aseguradora, cplantilla);
            List<tconcomprobantedetalle> comprobanteDetalle = CompletarComprobanteDetalle(rqmantenimiento, comprobante, plantillaDetalle, lrubros, montototal);
            rqmantenimiento.Response["ccomprobante"] = comprobante.ccomprobante;
            rqmantenimiento.Response["numerocomprobantecesantia"] = comprobante.numerocomprobantecesantia;
            rqmantenimiento.AdicionarTabla("tconcomprobante", comprobante, false);
            rqmantenimiento.AdicionarTabla("tconcomprobantedetalle", comprobanteDetalle, false);
            rqmantenimiento.AddDatos("actualizarsaldosenlinea", true);
        }

        /// <summary>
        /// Completa cabecera de comprobante
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        /// <param name="cplantilla">Codigo de plantilla a contabilizar.</param>
        public static tconcomprobante CompletarComprobante(RqMantenimiento rqmantenimiento, string ccomprobante, tsgsaseguradora aseguradora, int cplantilla)
        {
            string numerocomprobantecesantia = SecuenciaComprobanteContable.GetProximoValor(rqmantenimiento, "DIAGEN");
            tconcomprobante comprobante = TconComprobanteDal.CrearComprobante(ccomprobante, rqmantenimiento.Fconatable, Constantes.GetParticion((int)rqmantenimiento.Fconatable),
                1, 0, null, null, null, rqmantenimiento.Freal, rqmantenimiento.Fproceso, "PAGO ASEGURADORA: " + aseguradora.nombre, true, true, true, false, false, false, false,
                cplantilla, 3, 1, 1, rqmantenimiento.Ctransaccion, rqmantenimiento.Cmodulo, 1003, "DIAGEN", 1, 1, 0, numerocomprobantecesantia,
                null, null, null, null, null, null, rqmantenimiento.Cusuario, rqmantenimiento.Freal, null, null);
            comprobante.Esnuevo = true;
            return comprobante;
        }

        /// <summary>
        /// Completa detalle de comprobante
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        /// <param name="comprobante">Instancia de tconcomprobante.</param>
        /// <param name="plantillaDetalle">Lista de detalle de plantilla contable.</param>
        /// <param name="valor">Monto de comprobante detalle.</param>
        public static List<tconcomprobantedetalle> CompletarComprobanteDetalle(RqMantenimiento rqmantenimiento, tconcomprobante comprobante,
                                                                               List<tconplantilladetalle> plantillaDetalle, Dictionary<String, decimal> lrubros, decimal valor)
        {
            decimal sumatorioDebitos = 0, sumatorioCreditos = 0;
            List<tconcomprobantedetalle> comprobanteDetalle = new List<tconcomprobantedetalle>();

            foreach (tconplantilladetalle pd2 in plantillaDetalle) {
                if ((bool)pd2.debito && !lrubros.ContainsKey(pd2.ccuenta)) {
                    continue;
                }

                tconcomprobantedetalle cd = new tconcomprobantedetalle();
                cd.monto = (bool)pd2.debito ? lrubros[pd2.ccuenta] : valor;
                cd.montooficial = (bool)pd2.debito ? lrubros[pd2.ccuenta] : valor;
                cd.Esnuevo = true;
                cd.ccomprobante = comprobante.ccomprobante;
                cd.fcontable = comprobante.fcontable;
                cd.particion = comprobante.particion;
                cd.ccompania = comprobante.ccompania;
                cd.optlock = Constantes.CERO;
                cd.cagencia = Constantes.UNO;
                cd.csucursal = Constantes.UNO;
                cd.ccuenta = pd2.ccuenta;
                cd.debito = pd2.debito;
                cd.cpartida = pd2.cpartida;
                cd.numerodocumentobancario = "";
                cd.cclase = TconCatalogoDal.Find(comprobante.ccompania, cd.ccuenta).cclase;
                cd.cmoneda = rqmantenimiento.Cmoneda ?? "USD";
                cd.cmonedaoficial = rqmantenimiento.Cmoneda ?? "USD";
                cd.cusuario = comprobante.cusuarioing;
                cd.cmonedaoficial = rqmantenimiento.Cmoneda;
                cd.suma = TmonClaseDal.Suma(cd.cclase, cd.debito);
                cd.centrocostosccatalogo = pd2.centrocostosccatalogo;
                cd.centrocostoscdetalle = pd2.centrocostoscdetalle;
                comprobanteDetalle.Add(cd);
                if (cd.debito.Value) sumatorioDebitos += cd.monto.Value;
                else sumatorioCreditos += cd.monto.Value;
            }

            if (sumatorioCreditos != sumatorioDebitos) {
                throw new AtlasException("CONTA-011", "ERROR: NO ES POSIBLE GENERAR COMPROBANTE CONTABLE, VALORES INGRESADOS NO CUADRAN DEBITOS Y CREDITOS");
            }
            comprobante.montocomprobante = valor;
            return comprobanteDetalle;
        }

    }
}
