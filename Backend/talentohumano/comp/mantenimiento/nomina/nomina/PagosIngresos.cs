using core.componente;
using dal.talentohumano;
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
using dal.talentohumano.nomina;
using dal.generales;
using core.servicios.mantenimiento;
using bce.util;

namespace talentohumano.comp.mantenimiento.nomina.nomina
{
    public class PagosIngresos : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {

            if (rqmantenimiento.Mdatos.ContainsKey("ldatos") && rqmantenimiento.Mdatos.ContainsKey("mescdetalle") && rqmantenimiento.Mdatos.ContainsKey("tipocdetalle") && rqmantenimiento.Mdatos.ContainsKey("comentario"))
            {
                string mes = rqmantenimiento.GetString("mescdetalle");
                string rubro = rqmantenimiento.GetString("tipocdetalle");
                string comentario = rqmantenimiento.GetString("comentario");


                var ING = JsonConvert.DeserializeObject<List<tnomingreso>>(rqmantenimiento.Mdatos["ldatos"].ToString());
                IList<tnomrol> rolp = new List<tnomrol>();
                IList<Saldo> itm = new List<Saldo>();
                foreach (tnomingreso ingr in ING)
                {
                    tnomrol r = TnomRolDal.Find(ingr.crol);
                    rolp.Add(r);
                    ingr.estado = true;
                    ingr.Esnuevo = false;
                    ingr.Actualizar = true;
                    Saldo ob = new Saldo();
                    ob.saldo = ingr.tipocdetalle;
                    ob.valor = ingr.calculado.Value;
                    ob.centroCosto = r.centrocostocdetalle;
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
                    itm.Add(salTotal);
                }
                var json = JsonConvert.SerializeObject(itm);
                rqmantenimiento.Mdatos.Add("Saldos", json);
                tthparametros param = TthParametrosDal.Find("CONINGRESOSPENDIENTES", rqmantenimiento.Ccompania);
                if (param == null)
                {

                    throw new AtlasException("TTH-004", "NO SE HA DEFINIDO EL PARAMETRO {0}", "CONINGRESOSPENDIENTES");
                }
                rqmantenimiento.Mdatos.Add("tipodocumento", "DIAGEN");

                rqmantenimiento.Mdatos.Add("cconcepto", 3);//FINANCIERO
                //rqmantenimiento.Mdatos.Add("comentario", comentario);
                rqmantenimiento.Mdatos.Add("cplantilla", (int)param.numero);
                rqmantenimiento.Mdatos.Add("generarcomprobante", true);
                rqmantenimiento.Mdatos.Add("actualizarsaldosenlinea", true);
                RqMantenimiento rq = (RqMantenimiento)rqmantenimiento.Clone();
                rq.EncerarRubros();
                Mantenimiento.ProcesarAnidado(rq, 11, 430);
                foreach (tnomrol rol in rolp)
                {
                    decimal ting = ING.Where(x => x.estado == true && x.crol == rol.crol).Sum(x => x.calculado).Value;
                    decimal totalspi = 0 + ting;
                    if (totalspi > 0) { 

                    tthfuncionariodetalle fun = TthFuncionarioDal.Find(rol.cfuncionario.Value);
                        String nombre = ((fun.primernombre != null) ? fun.primernombre : "") + " " + ((fun.primerapellido != null) ? fun.primerapellido : "");

                        totalspi=decimal.Round(totalspi, 2, MidpointRounding.AwayFromZero);
                        
                        GenerarBce.InsertarPagoBce(rqmantenimiento, fun.documento, nombre , fun.ncuenta,
                                         fun.cpersona, fun.tipocuentaccatalogo.Value, fun.tipocuentacdetalle, fun.bancoccatalago.Value,
                                         fun.bancocdetalle, totalspi, fun.documento, (int)rol.crol, null); //validar juanito
                }

                }
                rqmantenimiento.AdicionarTabla("TNOMINGRESO", ING, false);
                rqmantenimiento.Response["VALIDADO"] = true;

            }
            else {
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
