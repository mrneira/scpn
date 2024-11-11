using core.componente;
using core.servicios.mantenimiento;
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
using dal.contabilidad;
using bce.util;
using dal.generales;

namespace talentohumano.comp.mantenimiento.nomina.contabilidad
{
    public class LiquidacionCon : ComponenteMantenimiento
    {
        /// <summary>
        /// Clase que se encarga de realizar la contabilidad de la liquidación
        /// </summary>
        /// <param name="rm"></param>
        public override void Ejecutar(RqMantenimiento rm)
        {

            if (!rm.Mdatos.ContainsKey("cerrada"))
            {
                return;
            }
            if (bool.Parse(rm.GetDatos("cerrada").ToString()))
            {

                rm.Mdatos.Add("comentario", "LIQUIDACIÓN GENERADA DESDE EL MÓDULO DE TALENTO HUMANO");
                rm.Mdatos.Add("tipodocumento", "DIAGEN");
                rm.Mdatos.Add("cconcepto", 3);//FINANCIERO

                var ING = JsonConvert.DeserializeObject<List<tnomliquidaciondetalle>>(@rm.Mdatos["ING"].ToString());
                var EGR = JsonConvert.DeserializeObject<List<tnomliquidaciondetalle>>(@rm.Mdatos["EGR"].ToString());
                var LIQ = JsonConvert.DeserializeObject<tnomliquidacion>(@rm.Mdatos["registro"].ToString());
                tthfuncionariodetalle funs = TthFuncionarioDal.FindFuncionario(LIQ.cfuncionario.Value);

                tgencatalogodetalle centro = TgenCatalogoDetalleDal.Find(1002, funs.centrocostocdetalle);
                IList<tnomliquidaciondetalle> LIQD = new List<tnomliquidaciondetalle>();
                IList<Saldo> itm = new List<Saldo>();
                decimal suepp = 0, ings = 0, egs = 0;

                foreach (tnomliquidaciondetalle liq in ING)
                {
                    Saldo ob = new Saldo();
                    ob.saldo = liq.tipocdetalle;
                    ob.valor = liq.calculado.Value;
                    ob.centroCosto = centro.cdetalle;
                    suepp = suepp + ob.valor;
                    ings = ings + ob.valor;
                    itm.Add(ob);
                    if (!liq.Esnuevo && !liq.Actualizar)
                    {
                        liq.Actualizar = true;

                    }
                    else {
                        LIQD.Add(liq);
                    }
                }
                foreach (tnomliquidaciondetalle liq in EGR)
                {
                    Saldo ob = new Saldo();
                    ob.saldo = liq.tipocdetalle;
                    ob.valor = liq.calculado.Value;
                    ob.centroCosto = centro.cdetalle;
                    suepp = suepp - ob.valor;
                    egs = egs + ob.valor;
                    itm.Add(ob);
                    if (!liq.Esnuevo && !liq.Actualizar)
                    {
                        liq.Actualizar = true;

                    }
                    else
                    {
                        LIQD.Add(liq);
                    }
                }
                Saldo salTotal = new Saldo();
                salTotal.saldo = "SUEPAG";
                salTotal.centroCosto = centro.cdetalle;
                salTotal.valor = suepp;
                itm.Add(salTotal);
                Liquidacion liqN = new Liquidacion();
                tnomparametrodetalle paramd = TnomparametroDal.Find(LIQ.anio.Value);

                liqN = new Liquidacion(LIQ, paramd.anio, rm.Ccompania);
                liqN.datosGeneralesLiquidacion();
                liqN.IngresosDefecto();
                liqN.EgresosDefecto();
                liqN.getIessPatronalCalculado();

                string CODIGO = (liqN.acum.afondoreserva.Value) ? "CONLIQUIDACIONF" : "CONLIQUIDACION";
                if (liqN.acum.afondoreserva.Value) {
                    Saldo salfr = new Saldo();
                    salfr.saldo = "FONRES";
                    salfr.centroCosto = centro.cdetalle;
                    salfr.valor = liqN.getFondoReserva();

                    if (salfr.valor > 0)
                        itm.Add(salfr);

                }
                //VALIDAR SI SE PAGA EL SUELDO PAGAR APORTE PATRONAL
                tnomliquidaciondetalle sueld= ING.Find(X => X.tipocdetalle.Equals("SUELDO"));
                if (sueld!=null) {
                    Saldo salapo = new Saldo();
                    salapo.saldo = "APOPAT";
                    salapo.centroCosto = centro.cdetalle;
                    salapo.valor = liqN.getIessPatronalCalculado() + liqN.getCcc();
                    if(salapo.valor>0)
                    itm.Add(salapo);
                }


                tthparametros param = TthParametrosDal.Find(CODIGO, rm.Ccompania);
                if (param == null || param.numero.Value == 0)
                {
                    throw new AtlasException("TTH-012", "NO SE HA DEFINIDO EL PARÁMETRO {0}", CODIGO);

                }

                
                //OBJETO TIPO JSON DE SALDOS CON SU IDENTIFICADOR
                var json = JsonConvert.SerializeObject(itm);
                rm.Mdatos.Add("Saldos", json);
                rm.Mdatos.Add("cplantilla", (int)param.numero);
                rm.Mdatos.Add("generarcomprobante", true);
                //rm.Mdatos.Add("actualizarsaldosenlinea", true);
               
               
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

                DateTime FPromesa = Convert.ToDateTime("01/" + LIQ.fdesvinculacion.Value.Month + "/" + LIQ.fdesvinculacion.Value.Year);
                TimeSpan dias = LIQ.fdesvinculacion.Value.Subtract(FPromesa);
                int anios=  (LIQ.fvinculacion.Value.Year - LIQ.fdesvinculacion.Value.Year);
                LIQ.aniostrabajadosexacto = anios;
                LIQ.diastrabajadosultimomes = dias.Days;
                if (rq.Mtablas.ContainsKey("LIQUIDACION")) {
                    rq.Mtablas.Remove("LIQUIDACION");
                    rq.Lorden.Remove("LIQUIDACION");
                }
                rm.AdicionarTabla("tnomliquidaciondetalle", LIQD, false);
               
                rm.AdicionarTabla("tnomliquidacion", LIQ, false);
                rm.Response["cerrada"] = true;
            }
            else {
                return;
            }
        }
      
        }
    
}
