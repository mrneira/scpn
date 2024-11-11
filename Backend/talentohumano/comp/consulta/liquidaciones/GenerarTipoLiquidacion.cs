using core.componente;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using talentohumano.datos;
using util.dto.consulta;
using modelo;
using talentohumano.helper;
using Newtonsoft.Json;
using util;
using core.servicios;

namespace talentohumano.comp.consulta.liquidaciones
{
    class GenerarTipoLiquidacion : ComponenteConsulta
    {
        public override void Ejecutar(RqConsulta rq)
        {
            tnomliquidacion liq = new tnomliquidacion();

            if (!rq.Mdatos.ContainsKey("registro")) {
                rq.Response["DATOS"]= null;
                return;
            }
            var tnom = JsonConvert.DeserializeObject<tnomliquidacion>(@rq.Mdatos["registro"].ToString());

            var dlregistros = JsonConvert.DeserializeObject<TiposLiquidacion>(@rq.Mdatos["consulta"].ToString());

            Liquidacion dtoliquidacion = new Liquidacion(tnom,tnom.anio.Value,rq.Ccompania);
            dtoliquidacion.datosGeneralesLiquidacion();
            dtoliquidacion.calcularTiposLiquidacion(dlregistros);
            IList<tnomliquidaciondetalle> res = new List<tnomliquidaciondetalle>();
            foreach (tnomliquidaciondetalle li in dtoliquidacion.lidetalle) {
                tnomliquidaciondetalle ob = li;
                ob.Esnuevo = true;
                ob.Actualizar = false;
                ob.fingreso = Fecha.GetFechaSistema();
                ob.cusuarioing = rq.Cusuario;
                ob.cliquidacion = tnom.cliquidacion;
                ob.cliquidaciondetalle= Secuencia.GetProximovalor("SLIQUID");

                ob.valor = decimal.Round(ob.valor.Value, 2, MidpointRounding.AwayFromZero);

                ob.calculado = decimal.Round(ob.calculado.Value, 2, MidpointRounding.AwayFromZero);

                res.Add(ob);
            }
            rq.Response["DATOS"]= res;
           

        }
    }
}
