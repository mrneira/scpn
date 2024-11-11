using core.componente;
using core.servicios;
using modelo;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;

namespace inversiones.comp.mantenimiento.riesgos.plananual
{
    public class Generar : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rm)
        {
            if (!rm.Mdatos.ContainsKey("reg")){
                
                return;
            }
            var dlnomina = JsonConvert.DeserializeObject<tinvplananual>(@rm.Mdatos["reg"].ToString());
            

            

        }
    }
}
