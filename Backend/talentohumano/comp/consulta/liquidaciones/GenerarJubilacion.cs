using core.componente;
using modelo;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using talentohumano.datos;
using util.dto.consulta;

namespace talentohumano.comp.consulta.liquidaciones
{
   public class GenerarJubilacion : ComponenteConsulta
    {
        public override void Ejecutar(RqConsulta rm)
        {
            
             var detalle = JsonConvert.DeserializeObject<List<tnomjubilaciondetalle>>(rm.Mdatos["ldetalle"].ToString());
             var tnomjub = JsonConvert.DeserializeObject<tnomjubilacion>(rm.Mdatos["registro"].ToString());
              if (detalle.Count == 0)
                return;
            

            Jubilacion jubilacion = new Jubilacion(rm.Ccompania, detalle, tnomjub.sbucalculo.Value, tnomjub.anio.Value, tnomjub.cfuncionario.Value, tnomjub.fjubilacion.Value);
            jubilacion.getDatosGenerales();
            rm.Response["INGRESO"] = jubilacion.ing;
            rm.Response["EGRESO"] = jubilacion.egr;
            rm.Response["SINGRESOS"] = jubilacion.getSumaIngresos();
            rm.Response["SEGRESOS"] = jubilacion.getSumaEgresos();
            rm.Response["STOTAL"] = jubilacion.getSumaIngresos() - jubilacion.getSumaEgresos();


        }
    }
}
