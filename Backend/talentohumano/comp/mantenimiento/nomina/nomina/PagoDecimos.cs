using bce.util;
using core.componente;
using core.servicios.mantenimiento;
using dal.generales;
using dal.talentohumano;
using dal.talentohumano.nomina;
using modelo;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using talentohumano.datos;
using util;
using util.dto.mantenimiento;

namespace talentohumano.comp.mantenimiento.nomina.nomina
{
    public class PagoDecimos : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            if (rqmantenimiento.Mdatos.ContainsKey("ldatos")  && rqmantenimiento.Mdatos.ContainsKey("tipocdetalle") && rqmantenimiento.Mdatos.ContainsKey("comentario"))
            {
             
                string rubro = rqmantenimiento.GetString("tipocdetalle");
                //string comentario = rqmantenimiento.GetString("comentario");
                IList<tnomdecimotercero> DTER = new List<tnomdecimotercero>();

                var ING = JsonConvert.DeserializeObject<List<ListadoDecimo>>(rqmantenimiento.Mdatos["ldatos"].ToString());
                IList<tnomrol> rolp = new List<tnomrol>();
                IList<Saldo> itm = new List<Saldo>();
                foreach (ListadoDecimo ingr in ING)
                {
                    IList<tnomdecimotercero> dter = TnomDecimoTerceroDal.Find(ingr.cfuncionario);
                    foreach (tnomdecimotercero d in dter) {
                        d.Actualizar = true;
                        d.Esnuevo = false;
                        d.contabilizado = true;
                        DTER.Add(d);
                    }
                   
                    Saldo ob = new Saldo();
                    ob.saldo = rubro;
                    ob.valor = ingr.total;
                    ob.centroCosto = ingr.centrocostocdetalle;
                    ob.debito = true;
                    itm.Add(ob);

                }
                tthparametros ccatalogo = TthParametrosDal.Find("CATALOGOCCOSTO", rqmantenimiento.Ccompania);

                if (ccatalogo == null || ccatalogo.numero == null)
                {
                    throw new AtlasException("TTH-004", "NO SE HA DEFINIDO EL PARAMETRO {0} ", "CATALOGOCCOSTO");

                }
                int ccatalogocentrocosto = 0;
                try
                {
                    ccatalogocentrocosto = (int)ccatalogo.numero;
                    if (ccatalogocentrocosto == 0)
                    {
                        throw new AtlasException("TTH-004", "NO SE HA DEFINIDO EL PARAMETRO {0} ", "CATALOGOCCOSTO");
                    }
                }
                catch (Exception ex)
                {
                    throw new AtlasException("TTH-004", "NO SE HA DEFINIDO EL PARAMETRO {0} ", "CATALOGOCCOSTO");
                }

                IList<tgencatalogodetalle> centrocosto = TgenCatalogoDetalleDal.FindInDataBase(ccatalogocentrocosto);

                foreach (tgencatalogodetalle cc in centrocosto)
                {
                    Saldo salTotal = new Saldo();
                    salTotal.saldo = "SUEPAG";
                    salTotal.valor = Suma(itm, cc.cdetalle);
                    salTotal.centroCosto = cc.cdetalle;
                    salTotal.debito = false;
                    if(salTotal.valor>0)
                    itm.Add(salTotal);
                }
                var json = JsonConvert.SerializeObject(itm);
                rqmantenimiento.Mdatos.Add("Saldos", json);
                int cplantilla = TthParametrosDal.GetInteger("CPLANTILLADECIMOS", rqmantenimiento.Ccompania);
               
                rqmantenimiento.Mdatos.Add("tipodocumento", "DIAGEN");

                rqmantenimiento.Mdatos.Add("cconcepto", 3);//FINANCIERO
                //rqmantenimiento.Mdatos.Add("comentario", comentario);
                rqmantenimiento.Mdatos.Add("cplantilla", cplantilla);
                rqmantenimiento.Mdatos.Add("generarcomprobante", true);
                rqmantenimiento.Mdatos.Add("actualizarsaldosenlinea", true);
                RqMantenimiento rq = (RqMantenimiento)rqmantenimiento.Clone();
                rq.EncerarRubros();
                Mantenimiento.ProcesarAnidado(rq, 11, 430);
                

                string ccomprobante = rq.Response["ccomprobante"].ToString();
                foreach (ListadoDecimo ingr in ING)
                {

                    tthfuncionariodetalle fun = TthFuncionarioDal.Find(ingr.cfuncionario.Value);
                    String nombre = ((fun.primernombre != null) ? fun.primernombre : "") + " " + ((fun.primerapellido != null) ? fun.primerapellido : "");
                    decimal totalspi = 0;
                    totalspi = ingr.total;
                    totalspi = decimal.Round(totalspi, 2, MidpointRounding.AwayFromZero);

                    GenerarBce.InsertarPagoBce(rqmantenimiento, fun.documento, nombre, fun.ncuenta,
                                     fun.cpersona, fun.tipocuentaccatalogo.Value, fun.tipocuentacdetalle, fun.bancoccatalago.Value,
                                     fun.bancocdetalle, totalspi, fun.documento, (int)ingr.cfuncionario, ccomprobante);

                }

                rqmantenimiento.AdicionarTabla("tnomdecimotercero", DTER, false);
                rqmantenimiento.Response["VALIDADO"] = true;

            }
            else
            {
                return;
            }
        }
        public static decimal Suma(IList<Saldo> sal, string centrocostocdetalle)
        {
            decimal total = 0;
            foreach (Saldo ingreso in sal)
            {
                if (ingreso.centroCosto.Equals(centrocostocdetalle))
                {

                    total = total +
                        ingreso.valor;


                }
            }
            return total;
        }


    }
}
