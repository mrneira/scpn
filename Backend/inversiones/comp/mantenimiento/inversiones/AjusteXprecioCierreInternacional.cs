using core.componente;
using core.servicios.mantenimiento;
using dal.generales;
using dal.inversiones.inversiones;
using dal.inversiones.parametros;
using modelo;
using modelo.helper;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;
using dal;
using dal.inversiones.precioscierre;
using util.servicios.ef;

namespace inversiones.comp.mantenimiento.inversiones
{
    public class AjusteXprecioCierreInternacional : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            if (rqmantenimiento.Mdatos["cargaarchivo"].ToString() == "read")
            {

                var tinvprecioscierre = JsonConvert.DeserializeObject<IList<tinvprecioscierre>>(rqmantenimiento.Mdatos["ldatos"].ToString());

                //List<tinvprecioscierre> tinvprecioscierre = rqmantenimiento.GetTabla("TINVPRECIOSCIERRE").Lregistros.Cast<tinvprecioscierre>().ToList();
                //  IList<tinvprecioscierre> tinvprecioscierre = TinvInversionDal.FindOldPreciosCierre();
                IList<tinvinversion> respcob = new List<tinvinversion>();
                IList<tinvprecioscierrehistoria> resp = new List<tinvprecioscierrehistoria>();


                foreach (tinvprecioscierre invc in tinvprecioscierre)
                {
                    invc.Esnuevo = true;
                    invc.Actualizar = false;
                    IList<tinvinversion> tinvinversion = TinvInversionDal.FindInversiones(invc.emisorcdetalle, "APR");
                    tinvprecioscierre pc = TinvPrecioCierreDal.UltimoprecioEmisor(invc.emisorcdetalle, invc.fvaloracion.Value);


                    if (tinvinversion.Count() > 0)
                    {

                        foreach (tinvinversion inv in tinvinversion)
                        {

                            tinvprecioscierrehistoria his = new tinvprecioscierrehistoria();


                            if (invc.preciocierre != pc.preciocierre)
                            {
                                EntityHelper.SetActualizar(inv);
                                his.cinversion = inv.cinversion;
                                his.cemisorccatalogo = 1213;
                                his.cemisorcdetalle = inv.emisorcdetalle;
                                his.fcompraant = (int)pc.fvaloracion;
                                his.fcompranuev = (int)invc.fvaloracion;
                                his.sector = inv.sectorcdetalle;
                                his.valorcierreant = pc.preciocierre;
                                his.valorcierrenuev = invc.preciocierre;

                                if (inv.tasaclasificacioncdetalle.Equals("FIJA") && inv.emisorcdetalle != "ODEBRE") //CCA 20220629 modificacion para que Odebrech no /100
                                {
                                    his.valoraccionesant = inv.valornominal * (pc.preciocierre / 100);
                                    his.valoraccionesnuev = inv.valornominal * (invc.preciocierre / 100);
                                    his.nacciones = (int)((inv.numeroacciones == null) ? 0 : inv.numeroacciones);
                                    inv.numeroacciones = his.nacciones;
                                }
                                else
                                {
                                    if (inv.numeroacciones == 0)
                                    {
                                        his.nacciones = (int)inv.numeroacciones;
                                        his.valoraccionesant = pc.preciocierre * inv.valornominal;
                                        his.valoraccionesnuev = invc.preciocierre * inv.valornominal;
                                    }
                                    else
                                    {
                                        his.nacciones = (int)inv.numeroacciones;
                                        his.valoraccionesant = pc.preciocierre * inv.numeroacciones;
                                        his.valoraccionesnuev = invc.preciocierre * inv.numeroacciones;
                                    }


                                }
                                //his.valoraccionesant = pc.preciocierre * inv.numeroacciones;
                                //his.valoraccionesnuev = invc.preciocierre * inv.numeroacciones;
                                his.tipoccatalogo = inv.tasaclasificacionccatalogo;
                                his.tipocdetalle = inv.tasaclasificacioncdetalle;
                                his.contabilizado = false;
                                his.Esnuevo = true;
                                his.Actualizar = false;
                                invc.fultimocierre = invc.fvaloracion;
                                inv.preciounitarioaccion = pc.preciocierre;
                                inv.valoracciones = inv.numeroacciones * inv.preciounitarioaccion;
                                inv.fmodificacion = rqmantenimiento.Freal;
                                inv.cusuariomod = rqmantenimiento.Cusuario;
                                inv.Esnuevo = false;
                                inv.Actualizar = true;
                                respcob.Add(inv);
                                resp.Add(his);
                            }

                        }

                    }
                    Sessionef.Grabar(invc);
                }
                var json = JsonConvert.SerializeObject(resp);
                rqmantenimiento.AdicionarTablaExistente("TINVPRECIOSCIERREHISTORIA", resp, false);
                rqmantenimiento.AdicionarTabla("tinvinversion", respcob, false);

                this.saldosContabilizar(rqmantenimiento);
            }
        }
        public void saldosContabilizar(RqMantenimiento rqmantenimiento)
        {

            if (!rqmantenimiento.Mtablas.ContainsKey("TINVPRECIOSCIERREHISTORIA"))
            {

                return;
            }
            List<tinvprecioscierrehistoria> tlistaemisorescontables = rqmantenimiento.GetTabla("TINVPRECIOSCIERREHISTORIA").Lregistros.Cast<tinvprecioscierrehistoria>().ToList();

            IList<tinvcontabilizacion> ltinvcontabilizacion = new List<tinvcontabilizacion>();
            IList<tgencatalogodetalle> emisores = TgenCatalogoDetalleDal.Find(1213);


            var emisorespc = tlistaemisorescontables.GroupBy(Saldo => Saldo.cemisorcdetalle)
                     .Select(Saldogby => Saldogby.First())
                     .ToList();

            tgencatalogodetalle proceso = TgenCatalogoDetalleDal.Find(1220, "VARPRE");
            //LISTA DE EMISORES TINVPRECIOSCIERREHISTORIA            tlistaemisorescontables
            //BUSQUEDA DE TIPOS DE CALIFICACIÓN DE TASAS : FIJA/VARIABLE

            IList<tgencatalogodetalle> tipoinv = TgenCatalogoDetalleDal.Find(1210);

            foreach (tgencatalogodetalle rforv in tipoinv)
            {
                foreach (tinvprecioscierrehistoria emi in emisorespc)
                {

                    tgencatalogodetalle tgc = TgenCatalogoDetalleDal.Find(emi.cemisorccatalogo, emi.cemisorcdetalle);


                    //TOTALES AGRUPADOS POR EMISOR Y TIPO RENTA FIJA O VARIABLE
                    decimal vaccnuev = tlistaemisorescontables.Where(x => x.cemisorcdetalle.Equals(emi.cemisorcdetalle) && x.tipocdetalle.Equals(rforv.cdetalle)).Sum(x => x.valoraccionesnuev.Value);
                    decimal vaccant = tlistaemisorescontables.Where(x => x.cemisorcdetalle.Equals(emi.cemisorcdetalle) && x.tipocdetalle.Equals(rforv.cdetalle)).Sum(x => x.valoraccionesant.Value);

                    decimal diferencia = vaccnuev - vaccant;
                    diferencia = decimal.Round(diferencia, 2, MidpointRounding.AwayFromZero);
                    decimal valor = 0;


                    //BUSQUEDA DE CUENTAS DE ORDEN RENTA FIJA Y VARIABLE PARA DEUDORA O ACREEDORA
                    if (diferencia == 0 || rforv.cdetalle.Equals("TM"))
                    {
                        continue;
                    }
                    string ccuentaacc = "", ccuentaade = "";
                    if (rforv.cdetalle.Equals("FIJA"))
                    {
                        ccuentaacc = TinvParametrosDal.GetValorTexto("CCUENTA-ORDEN-D-INTER-RF", rqmantenimiento.Ccompania);
                        ccuentaade = TinvParametrosDal.GetValorTexto("CCUENTA-ORDEN-H-INTER-RF", rqmantenimiento.Ccompania);

                    }
                    else if (rforv.cdetalle.Equals("VAR"))
                    {
                        ccuentaacc = TinvParametrosDal.GetValorTexto("CCUENTA-ORDEN-D-INTER-RV", rqmantenimiento.Ccompania);
                        ccuentaade = TinvParametrosDal.GetValorTexto("CCUENTA-ORDEN-H-INTER-RV", rqmantenimiento.Ccompania);
                    }
                    else
                    {
                        tgencatalogodetalle tip = TgenCatalogoDetalleDal.Find(1210, rforv.cdetalle);
                        throw new AtlasException("INV-007", "NO SE HA PARAMETRIZADO LAS CUENTAS DE ORDEN PARA ESTE TIPO DE INVERSIÓN: {0}", tip.nombre);
                    }
                    //CREACIÓN DE SALDOS PARA CUENTA DE CAP-ING-DEUD-ACRE POR GANANCIA

                    if (diferencia > 0)
                    {
                        valor = Math.Abs(diferencia);
                        tinvplantillacontable CAP = TinvInversionDal.FindOperacionRubro(emi.cemisorcdetalle, "VARPRE", "CAP");
                        tinvcontabilizacion caps = completar(CAP.ccuenta, true, valor);
                        ltinvcontabilizacion.Add(caps);
                        tinvplantillacontable ING = TinvInversionDal.FindOperacionRubro(emi.cemisorcdetalle, "VARPRE", "ING");
                        tinvcontabilizacion ings = completar(ING.ccuenta, false, valor);
                        ltinvcontabilizacion.Add(ings);
                        //CUENTAS DE ORDEN
                        tinvcontabilizacion ordde = completar(ccuentaacc, true, valor);
                        ltinvcontabilizacion.Add(ordde);
                        tinvcontabilizacion ordacc = completar(ccuentaade, false, valor);
                        ltinvcontabilizacion.Add(ordacc);


                    }

                    //CREACIÓN DE SALDOS PARA CUENTA DE GAS-CAP-ACRE-DEU POR PERDIDA

                    else
                    {
                        valor = Math.Abs(diferencia);
                        tinvplantillacontable CAP = TinvInversionDal.FindOperacionRubro(emi.cemisorcdetalle, "VARPRE", "CAP");
                        tinvcontabilizacion caps = completar(CAP.ccuenta, false, valor);
                        ltinvcontabilizacion.Add(caps);
                        tinvplantillacontable ING = TinvInversionDal.FindOperacionRubro(emi.cemisorcdetalle, "VARPRE", "PERDID");
                        tinvcontabilizacion ings = completar(ING.ccuenta, true, valor);
                        ltinvcontabilizacion.Add(ings);
                        //CUENTAS DE ORDEN
                        tinvcontabilizacion ordde = completar(ccuentaacc, false, valor);
                        ltinvcontabilizacion.Add(ordde);
                        tinvcontabilizacion ordacc = completar(ccuentaade, true, valor);
                        ltinvcontabilizacion.Add(ordacc);


                    }





                }




            }



            // rqmantenimiento.Mdatos.Add("cplantilla", (int)paramt.numero);
            rqmantenimiento.Mdatos.Add("tipodocumento", "DIAGEN");
            //rqmantenimiento.Mdatos.Add("comentario","COMPROBANTE CONTABLE POR PRECIOS DE CIERRE "+ rqmantenimiento.Freal +" GENERADO DESDE EL MÓDULO DE INVERSIONES" );

            rqmantenimiento.Mdatos.Add("cconcepto", 3);//FINANCIERO
            var json = JsonConvert.SerializeObject(ltinvcontabilizacion);
            rqmantenimiento.Mdatos.Add("saldos", json);
            rqmantenimiento.Mdatos.Add("actualizarsaldosenlinea", true);
            rqmantenimiento.Mdatos.Add("generarcomprobante", true);

            RqMantenimiento rq = (RqMantenimiento)rqmantenimiento.Clone();
            rq.EncerarRubros();
            Mantenimiento.ProcesarAnidado(rq, 12, 4111);
        }
        /// <summary>
        ///   Método para completar solo con campos necesarios para enviar a contabilidad
        /// </summary>
        /// <param name="ccuenta"></param>
        /// <param name="debito"></param>
        /// <param name="valor"></param>
        /// <returns></returns>
        public tinvcontabilizacion completar(string ccuenta, bool debito, decimal valor)
        {
            tinvcontabilizacion obj = new tinvcontabilizacion();
            obj.ccuenta = ccuenta;
            obj.debito = debito;
            obj.valor = valor;
            return obj;
        }
    }
}
