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
  public class PagosRubrosEgresos:ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {

            if (rqmantenimiento.Mdatos.ContainsKey("ldatos") && rqmantenimiento.Mdatos.ContainsKey("mescdetalle") && rqmantenimiento.Mdatos.ContainsKey("tipocdetalle") && rqmantenimiento.Mdatos.ContainsKey("comentario"))
            {
                string mes = rqmantenimiento.GetString("mescdetalle");
                string rubro = rqmantenimiento.GetString("tipocdetalle");
                string comentario = rqmantenimiento.GetString("comentario");

                var EGR = JsonConvert.DeserializeObject<List<tnomegreso>>(rqmantenimiento.Mdatos["ldatos"].ToString());
                IList<tnomrol> rolp = new List<tnomrol>();
                IList<Saldo> itm = new List<Saldo>();
                decimal totalpago = 0;
                foreach (tnomegreso egrs in EGR)
                {
                    tnomrol r = TnomRolDal.Find(egrs.crol);
                    rolp.Add(r);
                    egrs.estado = true;
                    egrs.Esnuevo = false;
                    egrs.Actualizar = true;
                    Saldo ob = new Saldo();
                    ob.saldo = egrs.tipocdetalle;
                    ob.valor = egrs.calculado.Value;
                    ob.centroCosto = r.centrocostocdetalle;
                    ob.debito = true;
                    itm.Add(ob);
                    totalpago += egrs.calculado.Value;

                }
                if (rubro.Equals("RETJUD")) {
                    //COSTO DE RECAUDACIÓN ASUMIDO POR EL EMPLEADOR
                    Saldo ob = new Saldo();
                    ob.saldo = "OTRDES";
                    decimal VALOR = TthParametrosDal.GetValorNumerico("VALORSUPARECAUDACION", rqmantenimiento.Ccompania);
                    ob.valor = VALOR;
                    string CCOSTOEMPLEADOR = TthParametrosDal.GetValorTexto("CENTROCOSTOEMPLEADOR", rqmantenimiento.Ccompania);
                    ob.centroCosto = CCOSTOEMPLEADOR;
                    ob.debito = true;
                    itm.Add(ob);
                    totalpago += ob.valor;
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
                decimal totalspi = 0;
                foreach (tgencatalogodetalle cc in centrocosto)
                {
                    Saldo salTotal = new Saldo();
                    salTotal.saldo = "SUEPAG";
                    salTotal.valor = Suma(itm, cc.cdetalle);
                    salTotal.centroCosto = cc.cdetalle;
                    salTotal.debito = false;
                    itm.Add(salTotal);
                }
                var json = JsonConvert.SerializeObject(itm);
                rqmantenimiento.Mdatos.Add("Saldos", json);
                tthparametros param = TthParametrosDal.Find("CONINGRESOSPENDIENTES", rqmantenimiento.Ccompania);
                if (param == null)
                {

                    throw new AtlasException("TTH-004", "NO SE HA DEFINIDO EL PARAMETRO {0}", "CONINGRESOSPENDIENTES");
                }

                //   tthparametros identificacion 
                rqmantenimiento.Mdatos.Add("tipodocumento", "DIAGEN");


                string nombremes = TgenCatalogoDetalleDal.Find(4, mes).nombre;

                string nrubro = TgenCatalogoDetalleDal.Find(1145, rubro).nombre;
                rqmantenimiento.Mdatos.Add("cconcepto", 3);//FINANCIERO
               // rqmantenimiento.Mdatos.Add("comentario",comentario);
                rqmantenimiento.Mdatos.Add("cplantilla", (int)param.numero);
                rqmantenimiento.Mdatos.Add("generarcomprobante", true);
                rqmantenimiento.Mdatos.Add("actualizarsaldosenlinea", true);
                RqMantenimiento rq = (RqMantenimiento)rqmantenimiento.Clone();
                rq.EncerarRubros();
                Mantenimiento.ProcesarAnidado(rq, 11, 430);
                string identificacion = TthParametrosDal.GetValorTexto("SUPA-IDENTIFICACION", rqmantenimiento.Ccompania);

                string num = rq.Response["ccomprobante"].ToString();
                string numreferencia = rq.Response["ccomprobante"].ToString();

                string nombre = TthParametrosDal.GetValorTexto("SUPA-NOMBRE", rqmantenimiento.Ccompania);
                string ncuenta = TthParametrosDal.GetValorTexto("SUPA-NCUENTA", rqmantenimiento.Ccompania);
                int TCUENTAC = (int)TthParametrosDal.GetValorNumerico("SUPA-TCUENTAC", rqmantenimiento.Ccompania);
                string TCUENTAD = TthParametrosDal.GetValorTexto("SUPA-TCUENTAD", rqmantenimiento.Ccompania);
                int TBANCOC = (int)TthParametrosDal.GetValorNumerico("SUPA-TBANCOC", rqmantenimiento.Ccompania);
                string TBANCOD = TthParametrosDal.GetValorTexto("SUPA-TBANCOD", rqmantenimiento.Ccompania);

                GenerarBce.InsertarPagoBce(rq, identificacion, nombre, ncuenta, null, TCUENTAC, TCUENTAD, TBANCOC, TBANCOD, totalpago, numreferencia, int.Parse(numreferencia), num);
                rqmantenimiento.AdicionarTabla("TNOMEGRESO", EGR, false);
                rq.Response["VALIDADO"] = true;

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

