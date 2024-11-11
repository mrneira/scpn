using core.componente;
using core.servicios;
using dal.cartera;
using dal.contabilidad;
using dal.monetario;
using dal.tesoreria;
using modelo;
using System.Collections.Generic;
using System.Linq;
using tesoreria.enums;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.recaudacion {
    class PagoPrendario : ComponenteMantenimiento {

        public static decimal montototal = Constantes.CERO;

        /// <summary>
        /// Metodo que registra el pago mediante cash de la entrada de vehiculo
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            List<ttesrecaudacion> lrecaudacion = rqmantenimiento.GetTabla("AUTORIZARAPLICACION").Lregistros.Cast<ttesrecaudacion>().ToList();
            if (lrecaudacion == null || lrecaudacion.Count() <= 0) {
                return;
            }

            string ccomprobante = Secuencia.GetProximovalor("COMPROBANTE").ToString();
            foreach (ttesrecaudacion rec in lrecaudacion) {
                List<ttesrecaudaciondetalle> ldetalle = TtesRecaudacionDetalleDal.FindByCodigoCabecera(rec.crecaudacion, ((int)EnumTesoreria.EstadoRecaudacionCash.AutorizadoAplicar).ToString());

                foreach (ttesrecaudaciondetalle det in ldetalle) {
                    // Actualiza gasto liquidacion
                    TcarSolicitudGastosLiquidaDal.UpdatePagoSolicitudGastosLiquida(long.Parse(det.coperacion), rqmantenimiento.Fconatable, rqmantenimiento.Mensaje, ccomprobante);

                    // Monto total
                    montototal += (decimal)det.valorprocesado;
                }

                // Actualiza registro de recaudacion
                TtesRecaudacionDal.ActualizarCobrosModulo(rec, ldetalle, rqmantenimiento, ccomprobante);
            }

            // Contabilizar
            ContabilizarRecaudacion(rqmantenimiento, montototal, ccomprobante);
        }


        public static void ContabilizarRecaudacion(RqMantenimiento rqmantenimiento, decimal montototal, string ccomprobante)
        {

            int cplantilla = (int)TconParametrosDal.FindXCodigo("PLANTILLA_CONTABLE_PRENDARIO", rqmantenimiento.Ccompania).numero;
            if (cplantilla == 0) {
                throw new AtlasException("BCAR-0023", "VALOR NUMERICO PARA EL PARAMETRO NO DEFINIDO EN TCARPARAMETROS CODIGO: {0} COMPANIA: {1}", "PLANTILLA_CONTABLE_PRENDARIO", rqmantenimiento.Ccompania);
            }

            List<tconplantilladetalle> plantillaDetalle = TconPlantillaDetalleDal.Find(cplantilla, rqmantenimiento.Ccompania);
            tconcomprobante comprobante = CompletarComprobante(rqmantenimiento, cplantilla, ccomprobante);
            List<tconcomprobantedetalle> comprobanteDetalle = CompletarComprobanteDetalle(rqmantenimiento, comprobante, plantillaDetalle);
            rqmantenimiento.Response["ccomprobante"] = comprobante.ccomprobante;
            rqmantenimiento.Response["numerocomprobantecesantia"] = comprobante.numerocomprobantecesantia;
            rqmantenimiento.AdicionarTabla("tconcomprobante", comprobante, false);
            rqmantenimiento.AdicionarTabla("tconcomprobantedetalle", comprobanteDetalle, false);
            rqmantenimiento.AddDatos("actualizarsaldosenlinea", true);
        }

        public static tconcomprobante CompletarComprobante(RqMantenimiento rqmantenimiento, int cplantilla, string ccomprobante)
        {
            string numerocomprobantecesantia = SecuenciaComprobanteContable.GetProximoValor(rqmantenimiento, "INGRES");
            tconcomprobante comprobante = TconComprobanteDal.CrearComprobante(ccomprobante, rqmantenimiento.Fconatable, Constantes.GetParticion((int)rqmantenimiento.Fconatable),
                1, 0, null, null, null, rqmantenimiento.Freal, rqmantenimiento.Fproceso, "ANTICIPO PRENDARIO", true, true, true, false, false, false, false,
                cplantilla, 3, 1, 1, rqmantenimiento.Ctransaccion, rqmantenimiento.Cmodulo, 1003, "INGRES", 1, 1, 0, numerocomprobantecesantia,
                null, null, null, null, null, null, rqmantenimiento.Cusuario, rqmantenimiento.Freal, null, null);
            comprobante.Esnuevo = true;
            return comprobante;
        }


        public static List<tconcomprobantedetalle> CompletarComprobanteDetalle(RqMantenimiento rqmantenimiento, tconcomprobante comprobante,
            List<tconplantilladetalle> plantillaDetalle)
        {
            decimal sumatorioDebitos = 0, sumatorioCreditos = 0;
            decimal valor = montototal;
            List<tconcomprobantedetalle> comprobanteDetalle = new List<tconcomprobantedetalle>();

            foreach (tconplantilladetalle pd2 in plantillaDetalle) {
                tconcomprobantedetalle cd = new tconcomprobantedetalle();
                cd.monto = valor;
                cd.montooficial = valor;
                cd.Esnuevo = true;
                cd.ccomprobante = comprobante.ccomprobante;
                cd.fcontable = comprobante.fcontable;
                cd.particion = comprobante.particion;
                cd.ccompania = comprobante.ccompania;
                cd.optlock = 0;
                cd.cagencia = 1;
                cd.csucursal = 1;
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
