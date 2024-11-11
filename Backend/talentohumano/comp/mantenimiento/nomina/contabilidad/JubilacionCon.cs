using core.componente;
using core.servicios;
using core.servicios.mantenimiento;
using dal.generales;
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

namespace talentohumano.comp.mantenimiento.nomina.contabilidad
{
    class JubilacionCon : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rm)
        {

            if (!rm.Mdatos.ContainsKey("cerrada"))
            {
                return;
            }
            if (bool.Parse(rm.GetDatos("cerrada").ToString()))
            {
                var LIQ = JsonConvert.DeserializeObject<tnomjubilacion>(@rm.Mdatos["registro"].ToString());

                rm.Mdatos.Add("comentario",LIQ.descripcion );
                rm.Mdatos.Add("tipodocumento", "DIAGEN");
                rm.Mdatos.Add("cconcepto", 3);//FINANCIERO

                var ING = JsonConvert.DeserializeObject<List<tnomjubilaciontotal>>(@rm.Mdatos["ING"].ToString());
                var EGR = JsonConvert.DeserializeObject<List<tnomjubilaciontotal>>(@rm.Mdatos["EGR"].ToString());
                tthfuncionariodetalle funs = TthFuncionarioDal.FindFuncionario(LIQ.cfuncionario.Value);
                
                tgencatalogodetalle centro = TgenCatalogoDetalleDal.Find(1002, funs.centrocostocdetalle);
                IList<tnomjubilaciontotal> LIQD = new List<tnomjubilaciontotal>();
                IList<Saldo> itm = new List<Saldo>();
                decimal suepp = 0, ings = 0, egs = 0;
                AtlasContexto x = new AtlasContexto();
                foreach (tnomjubilaciontotal liq in ING)
                {
                    Saldo ob = new Saldo();
                    liq.ctotal =Secuencia.GetProximovalor("TNOMJUBTOT");
                    liq.cjubilacion = LIQ.cjubilacion;
                    liq.cjubilaciondetalle = 1;
                    ob.saldo = liq.tipocdetalle;
                    ob.valor = liq.calculado.Value;
                    ob.centroCosto = centro.cdetalle;
                    liq.fingreso = 0;
                    
                    suepp = suepp + ob.valor;
                    ings = ings + ob.valor;
                    itm.Add(ob);
                    LIQD.Add(liq);
                    
                }
                foreach (tnomjubilaciontotal liq in EGR)
                {
                    Saldo ob = new Saldo();
                    liq.ctotal = Secuencia.GetProximovalor("TNOMJUBTOT");
                    ob.saldo = liq.tipocdetalle;
                    liq.cjubilaciondetalle = 1;
                    liq.cjubilacion = LIQ.cjubilacion;
                    ob.valor = liq.calculado.Value;
                    ob.centroCosto = centro.cdetalle;
                    liq.fingreso = 0;  
                    suepp = suepp - ob.valor;
                    egs = egs + ob.valor;
                    itm.Add(ob);
                    LIQD.Add(liq);
                    
                }
                Saldo salTotal = new Saldo();
                salTotal.saldo = "SUEPAG";
                salTotal.centroCosto = centro.cdetalle;
                salTotal.valor = suepp;
                itm.Add(salTotal);             
              
                tthparametros param = TthParametrosDal.Find("CPLANTILLAJUBILACION", rm.Ccompania);
                if (param == null || param.numero.Value == 0)
                {
                    throw new AtlasException("TTH-012", "NO SE HA DEFINIDO EL PARÁMETRO {0}", "CPLANTILLAJUBILACION");

                }


                //OBJETO TIPO JSON DE SALDOS CON SU IDENTIFICADOR
                var json = JsonConvert.SerializeObject(itm);
                rm.Mdatos.Add("Saldos", json);
                rm.Mdatos.Add("cplantilla", (int)param.numero);
                rm.Mdatos.Add("generarcomprobante", true);
                rm.Mdatos.Add("cpersona", funs.cpersona);


                //GENERAR SPI



                RqMantenimiento rq = (RqMantenimiento)rm.Clone();
                rq.EncerarRubros();
                Mantenimiento.ProcesarAnidado(rq, 11, 430);
                tconcomprobante ldatos = (tconcomprobante)rm.GetTabla("TCONCOMPROBANTE").Registro;
                ldatos.automatico = true;
                ldatos.cuadrado = true;
                ldatos.actualizosaldo = false;
                ldatos.ruteopresupuesto = true;
                LIQ.ccomprobante = ldatos.ccomprobante;
                LIQ.cerrada = true;
                LIQ.Actualizar = true;
                LIQ.Esnuevo = false;
                LIQ.fmodificacion = rm.Freal;
                LIQ.cusuariomod = rm.Cusuario;
                LIQ.totalingresos = ings;
                LIQ.totalegresos = egs;              
                rm.AdicionarTabla("tnomjubilaciontotal", LIQD, false);
                rm.Mtablas["JUBILACION"] = null;
                rm.AdicionarTabla("tnomjubilacion", LIQ, false);
                rm.Response["cerrada"] = true;
            }
            else
            {
                return;
            }
        }
    }
}
