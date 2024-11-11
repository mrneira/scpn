using bce.util;
using core.componente;
using core.servicios;
using dal.cartera;
using dal.contabilidad;
using dal.monetario;
using dal.persona;
using modelo;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace cartera.comp.mantenimiento.devolucion {
    class PagoDevolucion : ComponenteMantenimiento {

        private static decimal montototal = Constantes.CERO;
        private static decimal montototalpago = Constantes.CERO;
        private static decimal montototalingreso = Constantes.CERO;

        /// <summary>
        /// Metodo que registra el pago de devolucion de valores a personas
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            // Datos de devolucion
            JArray a = (JArray)rqmantenimiento.Mdatos["PAGODEVOLUCION"];
            IList<Dictionary<string, object>> lregistros = a.ToObject<IList<Dictionary<string, object>>>();
            if (lregistros == null || lregistros.Count() <= 0) {
                return;
            }
            montototal = Constantes.CERO;
            montototalpago = Constantes.CERO;
            montototalingreso = Constantes.CERO;
            IList<tcardevolucion> devnuevas = new List<tcardevolucion>();
            // Pametro de monto minimo
            decimal montominimo = (decimal)TcarParametrosDal.GetValorNumerico("MONTO-MINIMO-SPI", rqmantenimiento.Ccompania);
            string ccomprobante = Secuencia.GetProximovalor("COMPROBANTE").ToString();
            // Registros de devolucion
            

            foreach (Dictionary<string, object> reg in lregistros) {
                long cpersona = long.Parse(reg["cpersona"].ToString());
                long cdevolucion = long.Parse(reg["cdevolucion"].ToString());
                ValidaReferenciaBancaria(cpersona, rqmantenimiento.Ccompania);
                tcardevolucion ldevolucion = TcarDevolucionDal.Findpk(cdevolucion);
                decimal montodevolucion = (decimal)ldevolucion.monto;
                decimal montopago = Constantes.CERO;
                decimal montoingreso = Constantes.CERO;

                // Control de montos
                if (montodevolucion >= montominimo) {
                    montopago = montodevolucion;
                    GeneraPago(rqmantenimiento, reg, cpersona, montopago, ccomprobante);
                    montototalpago += montopago;
                } else {
                    montoingreso = montodevolucion;
                    montototalingreso += montoingreso;
                }
                montototal += montodevolucion;

                // Actualiza devolucion
                ldevolucion.fmodificacion = rqmantenimiento.Freal;
                ldevolucion.cusuariomod = rqmantenimiento.Cusuario;
                ldevolucion.fdevolucion = rqmantenimiento.Fconatable;
                ldevolucion.montopago = (montopago > Constantes.CERO) ? ldevolucion.monto : Constantes.CERO;
                ldevolucion.montoingreso = (montoingreso > Constantes.CERO) ? ldevolucion.monto : Constantes.CERO;
                ldevolucion.mensaje = rqmantenimiento.Mensaje;
                ldevolucion.ccomprobante = ccomprobante;
                ldevolucion.Actualizar = true;
                ldevolucion.Esnuevo = false;                    
                    devnuevas.Add(ldevolucion);
                
            }

           

            rqmantenimiento.AdicionarTabla("tcardevolucion", devnuevas, false);
            // Contabilizar
            ContabilizarDevolucion(rqmantenimiento, ccomprobante);
        }

        /// <summary>
        /// Metodo que valida si la persona tiene referencia bancaria para transferencia
        /// </summary>
        /// <param name="cpersona">Codigo de persona.</param>
        /// <param name="ccompania">Codigo de compania.</param>
        private static void ValidaReferenciaBancaria(long cpersona, int ccompania)
        {
            tperreferenciabancaria cta = TperReferenciaBancariaDal.Find(cpersona, ccompania);
            if (cta == null) {
                throw new AtlasException("CAR-0064", "REFERENCIA BANCARIA NO EXISTE PARA CLIENTE: {0}", TperPersonaDetalleDal.Find(cpersona, ccompania).nombre);
            }
        }

        /// <summary>
        /// Metodo que registra pago via transferencia BCE 
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento</param>
        /// <param name="reg">Diccionario de datos.</param>
        /// <param name="cpersona">Codigo de persona.</param>
        /// <param name="monto">Monto de transferencia.</param>
        private static void GeneraPago(RqMantenimiento rq, Dictionary<string, object> reg, long cpersona, decimal monto, string ccomprobante)
        {
            GenerarBce.InsertarPagoBce(rq, reg["identificacion"].ToString(), reg["npersona"].ToString(), reg["numero"].ToString(),
                                      cpersona, int.Parse(reg["tipocuentaccatalogo"].ToString()), reg["tipocuentacdetalle"].ToString(),
                                      int.Parse(reg["tipoinstitucionccatalogo"].ToString()), reg["tipoinstitucioncdetalle"].ToString(),
                                      monto, reg["identificacion"].ToString(), null, ccomprobante);
        }

        /// <summary>
        /// Metodo que contabiliza la devolucion mediante el uso de plantilla contable
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento</param>
        public static void ContabilizarDevolucion(RqMantenimiento rq, string ccomprobante)
        {

            int cplantilla = (int)TconParametrosDal.FindXCodigo("PLANTILLA_CONTABLE_DEVOLUCION", rq.Ccompania).numero;
            if (cplantilla == 0) {
                throw new AtlasException("BCAR-0023", "VALOR NUMERICO PARA EL PARAMETRO NO DEFINIDO EN TCARPARAMETROS CODIGO: {0} COMPANIA: {1}", "PLANTILLA_CONTABLE_DEVOLUCION", rq.Ccompania);
            }

            List<tconplantilladetalle> plantillaDetalle = TconPlantillaDetalleDal.Find(cplantilla, rq.Ccompania);
            tconcomprobante comprobante = CompletarComprobante(rq, cplantilla, ccomprobante);
            List<tconcomprobantedetalle> comprobanteDetalle = CompletarComprobanteDetalle(rq, comprobante, plantillaDetalle);
            rq.Response["ccomprobante"] = comprobante.ccomprobante;
            rq.Response["numerocomprobantecesantia"] = comprobante.numerocomprobantecesantia;
            rq.AdicionarTabla("tconcomprobante", comprobante, false);
            rq.AdicionarTabla("tconcomprobantedetalle", comprobanteDetalle, false);
            rq.AddDatos("actualizarsaldosenlinea", true);
        }

        /// <summary>
        /// Metodo que completa el comprobante contable
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento</param>
        /// <param name="cplantilla">Codigo de plantilla contable</param>
        public static tconcomprobante CompletarComprobante(RqMantenimiento rq, int cplantilla, string ccomprobante)
        {
            string numerocomprobantecesantia = SecuenciaComprobanteContable.GetProximoValor(rq, "DIAGEN");
            tconcomprobante comprobante = TconComprobanteDal.CrearComprobante(ccomprobante, rq.Fconatable, Constantes.GetParticion((int)rq.Fconatable),
                1, 0, null, null, null, rq.Freal, rq.Fproceso, "DEVOLUCIÓN DE CARTERA", true, true, true, false, false, false, false,
                cplantilla, 3, 1, 1, rq.Ctransaccion, rq.Cmodulo, 1003, "DIAGEN", 1, 1, 0, numerocomprobantecesantia,
                null, null, null, null, null, null, rq.Cusuario, rq.Freal, null, null);
            comprobante.Esnuevo = true;
            return comprobante;
        }


        /// <summary>
        /// Metodo que completa el detalle del comprobante contable
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento</param>
        /// <param name="comprobante">Instancia de comprobante contable</param>
        /// <param name="plantillaDetalle">Lista detalle de plantilla contable</param>
        public static List<tconcomprobantedetalle> CompletarComprobanteDetalle(RqMantenimiento rq, tconcomprobante comprobante,
            List<tconplantilladetalle> plantillaDetalle)
        {
            decimal sumatorioDebitos = 0, sumatorioCreditos = 0;
            decimal valor = Constantes.CERO;
            List<tconcomprobantedetalle> comprobanteDetalle = new List<tconcomprobantedetalle>();

            foreach (tconplantilladetalle pd2 in plantillaDetalle) {
                tconcomprobantedetalle cd = new tconcomprobantedetalle();
                switch (pd2.campotablacdetalle) {
                    case "CXPDEV":
                        valor = montototal;
                        break;
                    case "CXPSPI":
                        valor = montototalpago;
                        break;
                    case "PYG":
                        valor = montototalingreso;
                        break;
                }

                if (valor <= 0)
                {
                    continue;
                }
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
                cd.cmoneda = rq.Cmoneda ?? "USD";
                cd.cmonedaoficial = rq.Cmoneda ?? "USD";
                cd.cusuario = comprobante.cusuarioing;
                cd.cmonedaoficial = rq.Cmoneda;
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
            comprobante.montocomprobante = montototal;
            return comprobanteDetalle;
        }

    }
}
