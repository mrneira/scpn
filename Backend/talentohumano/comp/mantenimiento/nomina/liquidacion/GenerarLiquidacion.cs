using core.componente;
using dal.talentohumano;
using dal.talentohumano.nomina;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;
using talentohumano.datos;
using talentohumano.helper;
using util;
using Newtonsoft.Json;
using core.servicios;
using dal.talentohumano.liquidacion;

namespace talentohumano.comp.mantenimiento.nomina.liquidacion
{
    /// <summary>
    /// Clase que se encarga de generar los saldos de liquidación
    /// </summary>
    public class GenerarLiquidacion : ComponenteMantenimiento
    {
        /// <summary>
        /// Clase que se encarga de generar los saldos para enviar al componente de Contabilizar
        /// </summary>
        /// <param name="rm">Request con el que se ejecuta la transaccion.</param>

        public override void Ejecutar(RqMantenimiento rm)
        {
            if (rm.GetTabla("LIQUIDACION") == null || !rm.GetTabla("LIQUIDACION").Lregistros.Any())
            {
                return;
            }

            decimal ings = 0;
            decimal egrs = 0;
            tnomliquidacion lliq = rm.GetTabla("LIQUIDACION").Lregistros.Cast<tnomliquidacion>().Single();
          
        
            if (rm.Mdatos.ContainsKey("nuevo"))
            {
                if (!bool.Parse(rm.Mdatos["nuevo"].ToString()))
                {
                    return;
                }

                long cliquidacion = Secuencia.GetProximovalor("SLIQUIDACION");
                tnomparametrodetalle paramd = TnomparametroDal.Find(lliq.anio.Value);
                
                IList<tnomliquidaciondetalle> ltipos = new List<tnomliquidaciondetalle>();
                
                Liquidacion liq = new Liquidacion();
               
                liq = new Liquidacion(lliq,paramd.anio,rm.Ccompania);
                liq.datosGeneralesLiquidacion();
                liq.IngresosDefecto();
                liq.EgresosDefecto();
                
                List<tnomliquidaciondetalle> resp = new List<tnomliquidaciondetalle>();
                IList<tnompagoliquidacion> pagliq = TnomPagoLiquidacionDal.Find();
                foreach (tnomliquidaciondetalle ld in liq.lidetalle)
                    {
                    ld.Esnuevo = true;
                    ld.Actualizar = false;
                    ld.cliquidacion = cliquidacion;
                    ld.fingreso = Fecha.GetFechaSistema();
                    ld.cusuarioing = rm.Cusuario;
                    ld.valor = decimal.Round(ld.valor.Value, 2, MidpointRounding.AwayFromZero);
                    ld.calculado = decimal.Round(ld.calculado.Value, 2, MidpointRounding.AwayFromZero);
                   bool calcular= buscarpagos(ld.tipocdetalle, pagliq);
                    if (calcular)
                    {
                        long cliq = Secuencia.GetProximovalor("SLIQUID");
                        ld.cliquidaciondetalle = cliq;
                        resp.Add(ld);
                    }
                    if (ld.ingreso.Value)
                    {
                        ings += ld.calculado.Value;
                    }
                    else {
                        egrs += ld.calculado.Value;
                    }
                    
                }
                
                if (lliq.Esnuevo)
                {
                    
                    lliq.cliquidacion = cliquidacion;
                    lliq.ultimaremuneracion = liq.ultimaRemuneracion;
                }
                lliq.totalegresos = egrs;
                lliq.totalingresos = ings;
                decimal total = ings - egrs;
                if (total < 0) {
                    throw new AtlasException("TTH-029", "EL VALOR DE LA LIQUIDACIÓN {0} DEBE SER MAYOR A CERO, LOS VALORES SON: INGRESOS {1} Y EGRESOS {2}", total, ings, egrs);
                }
                rm.AdicionarTabla("tnomliquidacion", lliq, false);
                rm.AdicionarTabla("tnomliquidaciondetalle", resp, false);
                //RESPONSE CON EL


                rm.Response["LIQUIDACIOND"] = lliq;

                rm.Response["nuevo"] = false;
                rm.Response["INGRESOS"] = "OK";

            }
        }
        private bool buscarpagos(string buscado,IList<tnompagoliquidacion> saldos) {
            foreach (tnompagoliquidacion pag in saldos) {
                if (pag.saldocdetalle.Equals(buscado)) {
                    return true;

                }
            }
            return false;
        }
    }
}
