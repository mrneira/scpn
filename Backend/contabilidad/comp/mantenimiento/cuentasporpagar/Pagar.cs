using bce.util;
using contabilidad.saldo;
using core.componente;
using core.servicios;
using core.util;
using dal.contabilidad;
using dal.contabilidad.cuentasporpagar;
using dal.facturacionelectronica;
using dal.generales;
using dal.monetario;
using dal.persona;
using facturacionelectronica.comp.consulta.entidades;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using util;
using util.dto.mantenimiento;
using util.enums;

namespace contabilidad.comp.mantenimiento.cuentasporpagar
{

    /// <summary>
    /// Clase que se encarga de completar información ded detalle de un comprobante contable.
    /// </summary>
    public class Pagar : ComponenteMantenimiento
    {

        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            List<IBean> ldetalle = new List<IBean>();
            if (rqmantenimiento.GetTabla("tconcuentaporpagar").Lregistros.Count > 0)
            {
                ldetalle = rqmantenimiento.GetTabla("tconcuentaporpagar").Lregistros;
                rqmantenimiento.Mtablas["tconcuentaporpagar"] = null;
                CompletarAutorizacion(rqmantenimiento, ldetalle);
            }
        }

        /// <summary>
        /// completar autorización
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="ldetalle"></param>
        public static void CompletarAutorizacion(RqMantenimiento rqmantenimiento, List<IBean> ldetalle)
        {
            try
            {
                //bool autoriza;
                List<tconcuentaporpagar> lcuentaporpagar = new List<tconcuentaporpagar>();
                List<tconcomprobante> lcomprobante = new List<tconcomprobante>();
                List<tconcomprobantedetalle> lcomprobantedetalle = new List<tconcomprobantedetalle>();
                foreach (tconcuentaporpagar obj in ldetalle)
                {
                    tconcuentaporpagar cxp = TconCuentaporpagarDal.Find(obj.cctaporpagar);
                    tconcomprobante comprobante = TconComprobanteDal.FindComprobante(obj.ccompcontable);
                    List<tconcomprobantedetalle> comprobantedetalle = TconComprobanteDetalleDal.Find(comprobante.ccomprobante, comprobante.fcontable, comprobante.ccompania);
                    cxp.cusuarioautorizacion = rqmantenimiento.Cusuario;
                    comprobante.cusuarioing = cxp.cusuarioing;
                    cxp.fautorizacion = rqmantenimiento.Freal;
                    cxp.estadocxpcdetalle = "PAGADO";


                    bool periodoActivo;
                    periodoActivo = TconPeriodoContableDal.ValidarPeriodoContableActivo(Fecha.GetAnio(comprobante.fcontable), String.Format("{0:00}", Fecha.GetMes(comprobante.fcontable)));
                    if (!periodoActivo)
                    {
                        rqmantenimiento.Response["mayorizado"] = "ERROR: PERIODO INACTIVO O NO HA SIDO CREADO";
                        throw new AtlasException("CONTA-009", "ERROR: PERIODO INACTIVO O NO HA SIDO CREADO");
                    }

                    if (comprobante.cuadrado.Value && !comprobante.actualizosaldo.Value)
                    {
                        //mayorización de detalle del asiento contable
                        SaldoHelper sh = new SaldoHelper();
                        sh.Actualizar(rqmantenimiento.Response, comprobante, comprobantedetalle.ToList<IBean>());
                        comprobante.actualizosaldo = true;
                        lcomprobante.Add(comprobante);
                        //Actualización de saldos de presupuesto
                        if (comprobante.ruteopresupuesto && comprobante.aprobadopresupuesto)
                        {
                            SaldoPresupuesto.ActualizarSaldoPresupuesto(rqmantenimiento, comprobante, comprobantedetalle.ToList<IBean>());
                        }
                    }

                    //transaccion spi o pago por bce
                    tperreferenciabancaria referenciabancaria = TperReferenciaBancariaDal.Find(cxp.cpersona.Value, cxp.ccompania.Value);
                    if (referenciabancaria == null)
                    {
                        throw new AtlasException("BPROV-004", "PROVEEDOR NO POSEE REFERENCIA BANCARIA {0}", cxp.cpersona.Value);
                    }

                    tperproveedor proveedor = TperProveedorDal.Find(cxp.cpersona.Value, cxp.ccompania.Value);
                    if (proveedor.pagoporbce) //proveedor se paga por transferencia banco central
                    {
                        if (!cxp.exentoretencion.Value)
                        {
                            string csecuenciaSRI = Math.Truncate(double.Parse(TconParametrosDal.FindXCodigo("SEC_SRI_COMRET_CESANTIA", rqmantenimiento.Ccompania).numero.ToString())).ToString();
                            cxp.numdocumento = TcelSecuenciaSriDal.ObtenerSecuenciaDocumentoElectronico(csecuenciaSRI);
                            lcuentaporpagar.Add(cxp);
                            GenerarComprobanteRetencionElectronico(rqmantenimiento, cxp, DevolverDetalleImpuestosRenta(rqmantenimiento, cxp.cctaporpagar));
                        }
                    }
                    else // proveedor se paga por SPI
                    {
                        if (!cxp.exentoretencion.Value)
                        {
                            string csecuenciaSRI = Math.Truncate(double.Parse(TconParametrosDal.FindXCodigo("SEC_SRI_COMRET_CESANTIA", rqmantenimiento.Ccompania).numero.ToString())).ToString();
                            cxp.numdocumento = TcelSecuenciaSriDal.ObtenerSecuenciaDocumentoElectronico(csecuenciaSRI);
                            lcuentaporpagar.Add(cxp);
                            GenerarComprobanteRetencionElectronico(rqmantenimiento, cxp, DevolverDetalleImpuestosRenta(rqmantenimiento, cxp.cctaporpagar));
                        }

                        //Registro SPI
                        GenerarBce.InsertarPagoBce(rqmantenimiento, proveedor.identificacion, proveedor.nombre, referenciabancaria.numero, proveedor.cpersona, referenciabancaria.tipocuentaccatalogo.Value,
                            referenciabancaria.tipocuentacdetalle, referenciabancaria.tipoinstitucionccatalogo.Value, referenciabancaria.tipoinstitucioncdetalle,
                            Math.Round(Math.Abs(cxp.valorpagar.Value), 2), cxp.cctaporpagar, null, cxp.ccompcontable);
                        //fin transaccion spi
                    }
                }

                rqmantenimiento.AdicionarTabla("tconcuentaporpagar", lcuentaporpagar, false);
                rqmantenimiento.AdicionarTabla("tconcomprobante", lcomprobante, false);
                rqmantenimiento.AdicionarTabla("tconcomprobantedetalle", lcomprobantedetalle, false);
                rqmantenimiento.Response["mayorizado"] = "OK";
            }
            catch (Exception)
            {
                throw;
            }
        }


        public static void GenerarComprobanteRetencionElectronico(RqMantenimiento rqmantenimiento, tconcuentaporpagar cxp, List<IBean> ldetalle)
        {
            EntidadComprobante entidad = new EntidadComprobante();
            entidad.FechaEmisionDocumento = Fecha.GetFechaSri(rqmantenimiento.Freal);
            entidad.Establecimiento = cxp.numdocumento.Substring(0, 3);
            entidad.PuntoEmision = cxp.numdocumento.Substring(4, 3);
            entidad.Secuencial = cxp.numdocumento.Substring(8, 9);
            entidad.Ccompania = rqmantenimiento.Ccompania;
            tperproveedor proveedor = TperProveedorDal.Find(cxp.cpersona.Value, rqmantenimiento.Ccompania);
            entidad.IdentificacionComprador = proveedor.identificacion;

            entidad.Moneda = "DOLAR";
            entidad.Propina = 0;
            entidad.RazonSocialComprador = proveedor.nombre;

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


            entidad.TipoDocumento = "07";

            int contadorImpuestosDetalle = 0;
            if (cxp.montoivabienes != null) contadorImpuestosDetalle++;
            if (cxp.montoivaservicios != null) contadorImpuestosDetalle++;
            contadorImpuestosDetalle += ldetalle.Count;

            entidad.DetalleImpuestosRetencion = new EntidadImpuestoRetencion[contadorImpuestosDetalle];

            int indice = 0;
            if (cxp.montoivabienes != null && cxp.montoivabienes != 0)
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
                    FechaDocumentoSustento = Fecha.GetFechaSri(cxp.ffacturasustento.Value)
                };
                indice++;
            }

            if (cxp.montoivaservicios != null && cxp.montoivaservicios != 0)
            {
                entidad.DetalleImpuestosRetencion[0] = new EntidadImpuestoRetencion()
                {
                    Codigo = 2,
                    CodigoRetencion = TgenCatalogoDetalleDal.Find(cxp.porretserviciosccatalogo.Value, cxp.porretservicioscdetalle).clegal,
                    BaseImponible = cxp.montoivaservicios.Value,
                    PorcentajeRetenido = Decimal.Parse(TgenCatalogoDetalleDal.Find(cxp.porretserviciosccatalogo.Value, cxp.porretservicioscdetalle).nombre),
                    ValorRetenido = cxp.valorretservicios.Value,
                    CodigoDocumentoSustento = TgenCatalogoDetalleDal.Find(cxp.tcomprobanteccatalogo.Value, cxp.tcomprobantecdetalle).clegal,
                    DocumentoSustento = cxp.numdocumentosustento.Replace("-", ""),
                    FechaDocumentoSustento = Fecha.GetFechaSri(cxp.ffacturasustento.Value)
                };
                indice++;
            }


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
                    FechaDocumentoSustento = Fecha.GetFechaSri(cxp.ffacturasustento.Value)
                };
                indice = indice + 1;
            }

            entidad.CusuarioIng = rqmantenimiento.Cusuario;
            entidad.Fingreso = rqmantenimiento.Freal;
            facturacionelectronica.comp.mantenimiento.GenerarDocumentoElectronico.GenerarDocumento(entidad);
        }

        public static List<IBean> DevolverDetalleImpuestosRenta(RqMantenimiento rqmantenimiento, string cctaporpagar)
        {

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

            List<IBean> ldetalle = DtoUtil.GetMergedList(lbase, lmantenimiento, leliminar);
            return ldetalle;
        }
    }
}
