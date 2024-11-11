using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using core.componente;
using core.servicios;
using dal.contabilidad;
using modelo;
using System.Linq;
using util.dto.mantenimiento;
using modelo.interfaces;
using dal.contabilidad.cuentasporpagar;
using System.Reflection;
using util;
using dal.monetario;
using facturacionelectronica.comp.consulta.entidades;
using dal.facturacionelectronica;
using dal.generales;

namespace contabilidad.comp.mantenimiento.cuentasporcobrar
{
    class Comprobante : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {

            if (!(bool)rqmantenimiento.Mdatos["generarcomprobante"])
            {
                return;
            }

            tconcuentaporcobrar cxp = new tconcuentaporcobrar();
            if (rqmantenimiento.GetTabla("CABECERA").Lregistros.Count > 0)
            {
                cxp = (tconcuentaporcobrar)rqmantenimiento.GetTabla("CABECERA").Lregistros[0];
            }

        }

        /// <summary>
        /// completar comprobante
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="cxc"></param>
        /// <param name="csecuenciacomprobante"></param>
        /// <param name="comprobante"></param>
        /// <returns></returns>
        public static tconcomprobante CompletarComprobante(RqMantenimiento rqmantenimiento, tconcuentaporcobrar cxc, string csecuenciacomprobante, tconcomprobante comprobante)
        {

            comprobante = TconComprobanteDal.CrearComprobante(comprobante.ccomprobante, rqmantenimiento.Fconatable, Constantes.GetParticion((int)rqmantenimiento.Fconatable), rqmantenimiento.Ccompania, 0,
                null, null, null, rqmantenimiento.Freal, rqmantenimiento.Fproceso, rqmantenimiento.Mdatos["comentario"].ToString(), true, true, true, false, false, false, false,
                cxc.cplantilla, 3, 1, 1, rqmantenimiento.Ctransaccion, rqmantenimiento.Cmodulo, 1003, "DIAGEN", 1, 1, 0, "", "", "", "", "", "", "", rqmantenimiento.Cusuario, rqmantenimiento.Freal, null, null);

            comprobante.numerocomprobantecesantia = SecuenciaComprobanteContable.GetProximoValor(rqmantenimiento, csecuenciacomprobante);
            //comprobante.anulado = false;
            //comprobante.automatico = true;
            //comprobante.cagencia = 1;
            //comprobante.cagenciaingreso = 1;
            //comprobante.ccompania = cxc.ccompania.Value;
            
            //comprobante.freal = rqmantenimiento.Freal;
            //comprobante.fproceso = rqmantenimiento.Fproceso;
            //comprobante.comentario = ;
            //comprobante.cplantilla = cxc.cplantilla; 
            //comprobante.csucursal = 1;
            //comprobante.csucursalingreso = 1;
            //comprobante.cuadrado = true;
            //comprobante.actualizosaldo = true;
            //comprobante.cusuarioing = rqmantenimiento.Cusuario;
            //comprobante.eliminado = false;
            //comprobante.fcontable = rqmantenimiento.Fconatable;
            //comprobante.fingreso = rqmantenimiento.Freal;
            //comprobante.optlock = 0;
            //comprobante.particion =
            //comprobante.tipodocumentoccatalogo = 1003;
            //comprobante.tipodocumentocdetalle = "DIAGEN";
            //comprobante.cconcepto = 3;
            comprobante.Esnuevo = true;
            //comprobante.cmodulo = rqmantenimiento.Cmodulo;
            //comprobante.ctransaccion = rqmantenimiento.Ctransaccion;
            return comprobante;
        }

        /// <summary>
        /// completar autorización
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="cxc"></param>
        /// <param name="csecuenciacomprobante"></param>
        /// <param name="comprobante"></param>
        /// <param name="ltotalporcaja"></param>
        internal static void CompletarAutorizacion(RqMantenimiento rqmantenimiento, tconcuentaporcobrar cxc, string csecuenciacomprobante,
            tconcomprobante comprobante, Dictionary<string,decimal?> ltotalporcaja)
        {
            if (cxc.cplantilla != null)
            {
                List<tconplantilladetalle> plantillaDetalle = TconPlantillaDetalleDal.Find(cxc.cplantilla.Value, cxc.ccompania.Value);
                comprobante = CompletarComprobante(rqmantenimiento, cxc, csecuenciacomprobante, comprobante);
                List<tconcomprobantedetalle> comprobanteDetalle = CompletarComprobanteDetalle(rqmantenimiento, cxc, comprobante, plantillaDetalle, ltotalporcaja);

                rqmantenimiento.Response["cctaporcobrar"] = cxc.cctaporcobrar;

                cxc.ccompcontable = comprobante.ccomprobante;
                rqmantenimiento.Response["ccompcontable"] = comprobante.ccomprobante;

                string csecuenciaSRI = Math.Round(double.Parse(TconParametrosDal.FindXCodigo("SEC_SRI_FAC_PARQ", rqmantenimiento.Ccompania).numero.ToString()), 0).ToString();
                cxc.ccodfactura = TcelSecuenciaSriDal.ObtenerSecuenciaDocumentoElectronico(csecuenciaSRI);

                rqmantenimiento.Response["numerocomprobantecesantia"] = comprobante.numerocomprobantecesantia;

                rqmantenimiento.AdicionarTabla("tconcomprobante", comprobante, false);
                rqmantenimiento.AdicionarTabla("tconcomprobantedetalle", comprobanteDetalle, false);
            }
            cxc.Actualizar = true;
            cxc.estadocdetalle = "CONTAB";
        }


        /// <summary>
        /// completar comprobante detalle
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="cxc"></param>
        /// <param name="comprobante"></param>
        /// <param name="plantillaDetalle"></param>
        /// <param name="ltotalporcaja"></param>
        /// <returns></returns>
        public static List<tconcomprobantedetalle> CompletarComprobanteDetalle(RqMantenimiento rqmantenimiento, tconcuentaporcobrar cxc,
            tconcomprobante comprobante, List<tconplantilladetalle> plantillaDetalle, Dictionary<string, decimal?> ltotalporcaja) {
            decimal valorCampo = 0;
            string cuentaproveedor = "";
            decimal sumatorioDebitos = 0, sumatorioCreditos = 0;
            string cctacajaparqueadero = rqmantenimiento.Mdatos.ContainsKey("cctacajaparqueadero") ? (string)rqmantenimiento.Mdatos["cctacajaparqueadero"] : "";

            List<tconcomprobantedetalle> comprobanteDetalle = new List<tconcomprobantedetalle>();
            foreach (tconplantilladetalle pd in plantillaDetalle) {
                tconcomprobantedetalle cd = new tconcomprobantedetalle();
                cd.monto = 0;
                cd.montooficial = 0;
                cd.Esnuevo = true;
                cd.ccomprobante = comprobante.ccomprobante;
                cd.fcontable = comprobante.fcontable;
                cd.particion = comprobante.particion;
                cd.ccompania = comprobante.ccompania;
                cd.optlock = 0;
                cd.cagencia = 1;
                cd.csucursal = 1;
                cd.debito = pd.debito;
                cd.cpartida = pd.cpartida;
                cd.cmoneda = rqmantenimiento.Cmoneda == null ? "USD" : rqmantenimiento.Cmoneda;
                cd.cmonedaoficial = rqmantenimiento.Cmoneda == null ? "USD" : rqmantenimiento.Cmoneda;
                cd.cusuario = comprobante.cusuarioing;
                cd.cmonedaoficial = rqmantenimiento.Cmoneda;
                cd.ccuenta = pd.ccuenta;
                cd.centrocostosccatalogo = pd.centrocostosccatalogo;
                cd.centrocostoscdetalle = pd.centrocostoscdetalle;
                cd.ccuenta = pd.ccuenta;
                cd.cclase = TconCatalogoDal.Find(comprobante.ccompania, cd.ccuenta).cclase;
                cd.suma = TmonClaseDal.Suma(cd.cclase, cd.debito);

                if (ltotalporcaja != null) {   //servicio diario de parqueo
                    if (pd.campotablacdetalle.Equals("C3") ) {//TOTAL
                        cd.monto = cxc.baseimponible;
                        cd.montooficial = cxc.baseimponible;
                    } else if (pd.campotablacdetalle.Equals("C2")) { //BASE IMPONIBLE
                        if (ltotalporcaja.ContainsKey(cd.ccuenta)) {
                            cd.monto = (decimal)ltotalporcaja[cd.ccuenta];
                            cd.montooficial = (decimal)ltotalporcaja[cd.ccuenta];
                        } else continue;
                    } else if (pd.campotablacdetalle.Equals("C4")) { // MONTO IVA
                        cd.monto = cxc.montoiva;
                        cd.montooficial = cxc.montoiva;
                    } else continue;
                } else {   //servicio mensual
                    if (pd.campotablacdetalle.Equals("C2") ) {//TOTAL
                        cd.monto = cxc.total;
                        cd.montooficial = cxc.total;
                    } else if (pd.campotablacdetalle.Equals("C3")) { //BASE IMPONIBLE
                        cd.monto = cxc.baseimponible;
                        cd.montooficial = cxc.baseimponible;
                    } else if (pd.campotablacdetalle.Equals("C4")) { // MONTO IVA
                        cd.monto = cxc.montoiva;
                        cd.montooficial = cxc.montoiva;
                    } else continue;
                }



                if (cd.debito.Value) sumatorioDebitos += cd.monto.Value;
                else sumatorioCreditos += cd.monto.Value;
                comprobanteDetalle.Add(cd);
            }
            comprobante.montocomprobante = sumatorioCreditos;
            if (sumatorioCreditos != sumatorioDebitos) {
                throw new AtlasException("CONTA-011", "ERROR: NO ES POSIBLE GENERAR COMPROBANTE CONTABLE, VALORES INGRESADOS NO CUADRAN DEBITOS Y CREDITOS");
            }
            return comprobanteDetalle;
        }


        /// <summary>
        /// generar factura electrónica
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="cxc"></param>
        public static void GenerarFacturaElectronica(RqMantenimiento rqmantenimiento, tconcuentaporcobrar cxc)
        {
            EntidadComprobante entidad = new EntidadComprobante();
            entidad.FechaEmisionDocumento = Fecha.GetFechaSri(cxc.fdocumento.Value);
            entidad.Establecimiento = cxc.ccodfactura.Substring(0, 3);
            entidad.PuntoEmision = cxc.ccodfactura.Substring(4, 3);
            entidad.Secuencial = cxc.ccodfactura.Substring(8, 9);
            entidad.Ccompania = rqmantenimiento.Ccompania;

            tperproveedor proveedor = TperProveedorDal.Find(cxc.cpersona.Value, 1);
            entidad.IdentificacionComprador = proveedor.identificacion;

            entidad.ImporteTotal = cxc.total.Value;
            entidad.Moneda = "DOLAR";
            entidad.Propina = 0;
            entidad.RazonSocialComprador = proveedor.nombre;

            entidad.TipoDocumento = TgenCatalogoDetalleDal.Find(cxc.tipodocumentoccatalogo.Value, cxc.tipodocumentocdetalle).clegal;// "01"; //mejorar a catalogo

            if (proveedor.identificacion.Length == 13) // buscar de catalogo
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
                FormaPago = TgenCatalogoDetalleDal.Find(cxc.formapagoccatalogo.Value, cxc.formapagocdetalle).clegal,
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
            entidad.CusuarioIng = rqmantenimiento.Cusuario;
            entidad.Fingreso = rqmantenimiento.Freal;

            facturacionelectronica.comp.mantenimiento.GenerarDocumentoElectronico.GenerarDocumento(entidad);
        }
    }
}
