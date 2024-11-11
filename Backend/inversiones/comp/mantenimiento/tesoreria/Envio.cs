
using System;
using core.componente;
using util.dto.mantenimiento;
using dal.inversiones.inversiones;
using modelo;
using util.servicios.ef;
using bce.util;
using dal.generales;
using util;
using System.Globalization;

namespace inversiones.comp.mantenimiento.tesoreria
{
    /// <summary>
    /// Clase que encapsula los procedimientos funcionales para efectuar el envío de la transacción de compra a Tesorería..
    /// </summary>
    public class Envio : ComponenteMantenimiento
    {
        /// <summary>
        /// Envía la transacción de compra de la inversión a Tesorería.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        /// <returns></returns>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {


            tinvinversion inversion = TinvInversionDal.Find(long.Parse(rqmantenimiento.Mdatos["cinversion"].ToString()));

            inversion.comentariosingreso = null;
            inversion.comentariosaprobacion = null;
            inversion.comentariosdevolucion = null;
            inversion.comentariosanulacion = null;
            inversion.comentariospago = null;

            switch (rqmantenimiento.Mdatos["estadocdetalle"].ToString())

            {
                case "ENVAPR":
                    inversion.comentariosingreso = rqmantenimiento.Mdatos["comentario"].ToString().Trim();
                    inversion.estadocdetalle = rqmantenimiento.Mdatos["estadocdetalle"].ToString();
                    Sessionef.Actualizar(inversion);

                    break;
                default:

                    inversion.comentariosdevolucion = rqmantenimiento.Mdatos["comentario"].ToString().Trim();

                    if (inversion.bancopagocdetalle != null && inversion.bancopagoccatalogo != null)
                    {

                        string lConcepto = "INVERSIÓN: ";

                        if (inversion.instrumentocdetalle == "CDP" ||
                            inversion.instrumentocdetalle == "PA" ||
                            inversion.instrumentocdetalle == "CASHEQ" ||
                            inversion.instrumentocdetalle == "CASHFP" ||
                            inversion.instrumentocdetalle == "CASHFS" ||
                            inversion.instrumentocdetalle == "BONO" ||
                            inversion.instrumentocdetalle == "BONEST" ||
                            inversion.instrumentocdetalle == "PC" ||
                            inversion.instrumentocdetalle == "PCCERO" ||
                            inversion.instrumentocdetalle == "CAJA")
                        {

                            //string A = inversion.tasa.ToString("0.00", CultureInfo.InvariantCulture);

                            //string A = ;

                            lConcepto = lConcepto + " A " + inversion.plazo.ToString().Trim() + " DÍAS Y AL " + string.Format("{0:#.0000}", inversion.tasa).Trim() + "% INTERÉS";
                        }
                        else
                        {
                            tgencatalogodetalle tCatalogodetalleConcepto = new tgencatalogodetalle();

                            tCatalogodetalleConcepto = TgenCatalogoDetalleDal.Find((int)inversion.instrumentoccatalogo, inversion.instrumentocdetalle);

                            tgencatalogodetalle tCatalogoEmisor = new tgencatalogodetalle();

                            tCatalogoEmisor = TgenCatalogoDetalleDal.Find((int)inversion.emisorccatalogo, inversion.emisorcdetalle);

                            lConcepto = lConcepto + "COMPRA DE " + tCatalogodetalleConcepto.nombre + ' ' + tCatalogoEmisor.nombre;
                        }

                        tgencatalogodetalle tCatalogodetalle = new tgencatalogodetalle();

                        tCatalogodetalle = TgenCatalogoDetalleDal.Find((int)inversion.bancopagoccatalogo, inversion.bancopagocdetalle);

                        decimal lValorPago = 0;

                        if (inversion.instrumentocdetalle == "CDP" ||
                            inversion.instrumentocdetalle == "PA")
                        {
                            lValorPago = Math.Round((decimal)inversion.valorefectivo, 2, MidpointRounding.AwayFromZero);
                        }
                        else
                        {
                            lValorPago = Math.Round((decimal)inversion.valorefectivo, 2, MidpointRounding.AwayFromZero) +
                                Math.Round((decimal)inversion.interestranscurrido, 2, MidpointRounding.AwayFromZero) +
                                Math.Round((decimal)inversion.comisionbolsavalores, 2, MidpointRounding.AwayFromZero) +
                                Math.Round((decimal)inversion.comisionoperador, 2, MidpointRounding.AwayFromZero) -
                                Math.Round((decimal)inversion.comisionretencion, 2, MidpointRounding.AwayFromZero);
                        }



                        tinvbancodetalle tInvBancodetalle = new tinvbancodetalle();

                        tInvBancodetalle = TinvInversionDal.FindBancoDetalle((int)inversion.bancopagoccatalogo, inversion.bancopagocdetalle);

                        if (tInvBancodetalle == null)
                        {

                            throw new AtlasException("INV-0025", @"DEBE REGISTRAR LA INSTITUCIÓN FINANCIERA EN INVERSIONES\PARÁMETROS\DETALLE INSTITUCIONES FINANCIERAS.  PROCESO CANCELADO.");

                        }


                        Sessionef.Actualizar(inversion);

                        GenerarBce.InsertarPagoTransferenciaBce(rqmantenimiento,
                            rqmantenimiento.Mdatos["cinversion"].ToString(),
                            tCatalogodetalle.nombre,
                            tCatalogodetalle.clegal,
                            null,
                            306,
                            "2",
                            (int)inversion.bancopagoccatalogo,
                            inversion.bancopagocdetalle,
                            lValorPago,
                            rqmantenimiento.Mdatos["cinversion"].ToString(),
                            null,
                            lConcepto,
                            tInvBancodetalle.cuentabancariabce);

                    }

                    break;


            }

            Sessionef.Actualizar(inversion);

        }
    }
}