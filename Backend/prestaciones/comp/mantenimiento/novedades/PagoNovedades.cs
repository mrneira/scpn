using bce.util;
using core.componente;
using core.servicios.mantenimiento;
using dal.generales;
using dal.prestaciones;
using dal.socio;
using dal.talentohumano;
using modelo;
using modelo.helper;
using Newtonsoft.Json;
using prestaciones.dto;
using System;
using System.Collections.Generic;
using util;
using util.dto.mantenimiento;
namespace prestaciones.comp.mantenimiento.novedades
{
    public class PagoNovedades : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            if (rqmantenimiento.Mdatos.ContainsKey("ldatos") && rqmantenimiento.Mdatos.ContainsKey("cpersona") && rqmantenimiento.Mdatos.ContainsKey("comentario"))
            {

                long cpersona = rqmantenimiento.GetLong("cpersona").Value;
                var ING = JsonConvert.DeserializeObject<List<tsocnovedadades>>(rqmantenimiento.Mdatos["ldatos"].ToString());
                if (rqmantenimiento.Mtablas.ContainsKey("NOVEDADES"))
                {
                    rqmantenimiento.Mtablas["NOVEDADES"] = null;
                }
                IList<tsocnovedadades> socnovedades = new List<tsocnovedadades>();
                tsoccesantia SOC = TsocCesantiaDal.Find(cpersona, rqmantenimiento.Ccompania);
                IList<Saldo> itm = new List<Saldo>();
                tsoccesantiahistorico h = TsocCesantiaHistoricoDal.Find(SOC.cpersona, SOC.ccompania, SOC.secuenciahistorico);
                tsoctipogrado gr = TsocTipoGradoDal.Find(h.cgradoactual.Value);
                string TIPO = gr.cdetallejerarquia;


                foreach (tsocnovedadades nov in ING)
                {
                    EntityHelper.SetActualizar(nov);
                    nov.Esnuevo = false;
                    nov.Actualizar = true;
                    nov.pagado = false;
                    nov.mensaje = rqmantenimiento.Mensaje;
                    nov.cdetallenovedad = (TIPO.Equals("CLA")) ? "ANTCLA" : "ANTOFI"; //CCA 20210426
                    Saldo ob = new Saldo();
                    ob.saldo = nov.cdetallenovedad;
                    ob.valor = nov.valor.Value;
                    //INCLUIR EN CLASE SALDOS SI SE NECESITA CENTRO DE COSTOS 
                    itm.Add(ob);
                    ob.ingreso = true;
                    if (nov != null && nov.supa.Value) {
                        Saldo supa = new Saldo();
                        supa.saldo = "CTRANS";
                        supa.valor = TthParametrosDal.GetValorNumerico("VALORSUPARECAUDACION", rqmantenimiento.Ccompania);
                        itm.Add(supa);
                    }
                    

                }


                Saldo salTotal = new Saldo();
                salTotal.saldo = "SPI";
                salTotal.valor = Suma(itm);
                //salTotal.centroCosto = cc.cdetalle;
                salTotal.ingreso = false;
                itm.Add(salTotal);

                var json = JsonConvert.SerializeObject(itm);
                rqmantenimiento.Mdatos.Add("Saldos", json);
                int plantillaretenciones = TpreParametrosDal.GetInteger("COD-PLANTILLA-PAGO-NOVEDADES");
                string tipo = TpreParametrosDal.GetValorTexto("COD-PLANTILLA-PAGO-NOVEDADES");
              
                rqmantenimiento.Mdatos.Add("tipodocumento", tipo);
                rqmantenimiento.Mdatos.Add("cconcepto", 3);//FINANCIERO
                rqmantenimiento.Mdatos.Add("cplantilla", plantillaretenciones);
                rqmantenimiento.Mdatos.Add("generarcomprobante", true);
                rqmantenimiento.Mdatos.Add("actualizarsaldosenlinea", true);               
                RqMantenimiento rq = (RqMantenimiento)rqmantenimiento.Clone();
                rq.EncerarRubros();
                Mantenimiento.ProcesarAnidado(rq, 28, 48);
                foreach (tsocnovedadades nov in ING)
                {

                    if (nov.valor > 0)
                    {

                       

                        string nombre = nov.beneficiario;
                        string documento = nov.identificacion;
                        string supa = TthParametrosDal.GetValorTexto("SUPA-IDENTIFICACION", rqmantenimiento.Ccompania);
                        if (documento.Equals(supa) && nov.supa==false) {
                            tgencatalogodetalle c = TgenCatalogoDetalleDal.Find(nov.ccatalogonovedad.Value, nov.cdetallenovedad);
                            throw new AtlasException("PRE-030", "LA IDENTIFICACIÓN DE PAGO GENERADA PARA LA NOVEDAD {0} PERTENECE A SUPA PERO NO SE APLICO EL PAGO A LA ENTIDAD, SELECCIONELA PARA ASUMIR COSTOS DE TRANSFERENCIA", c.nombre);

                        }
                        decimal montosupa = 0;
                        if (nov.supa.Value)
                        {
                            montosupa = TthParametrosDal.GetValorNumerico("VALORSUPARECAUDACION", rqmantenimiento.Ccompania);

                        }
                        else {
                            montosupa = 0;
                        }
                        decimal totalspi = decimal.Round(nov.valor.Value, 2, MidpointRounding.AwayFromZero);
                        totalspi = totalspi + montosupa;

                        GenerarBce.InsertarPagoBce(rqmantenimiento, documento, nombre, nov.cuenta,
                                         nov.cpersona, nov.ccatalogotipocuenta.Value, nov.cdetalletipocuenta, nov.ccatalogobanco.Value,
                                         nov.cdetallebanco, totalspi, documento, (int)nov.cnovedad, rq.GetString("ccomprobante")); //validar juanito
                    }

                }
                rqmantenimiento.Mtablas["NOVEDADES"] = null;
                rqmantenimiento.AdicionarTabla("tsocnovedadades", ING, false);
                rqmantenimiento.Response["VALIDADO"] = true;
            }

            else
            {
                return;
            }
        }
        public static decimal Suma(IList<Saldo> sal)
        {
            decimal total = 0;
            foreach (Saldo ingreso in sal)
            {
                total += ingreso.valor;

            }
            return total;
        }
    }

}