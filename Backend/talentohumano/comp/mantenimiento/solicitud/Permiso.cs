using core.componente;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;
using modelo;
using Newtonsoft.Json;
using util.servicios.ef;
using core.servicios;
using dal.talentohumano;
namespace talentohumano.comp.mantenimiento.solicitud
{
     public class Permiso : ComponenteMantenimiento
    {


        public override void Ejecutar(RqMantenimiento rm)
        {
            if (!rm.Mdatos.ContainsKey("csolicitud")) {
                return;
            }
            long csolicitud = long.Parse(rm.Mdatos["csolicitud"].ToString());
            long cfuncionario = long.Parse(rm.Mdatos["cfuncionario"].ToString());


            var dlregistros = JsonConvert.DeserializeObject<tnompermiso>(@rm.Mdatos["registro"].ToString());
            tnompermiso ob = dlregistros;
            ob.csolicitud = csolicitud;
            long cpermiso = Secuencia.GetProximovalor("CPERMISO");
            ob.cpermiso = cpermiso;
           
            Sessionef.Grabar(ob);
            
            rm.Response["FINALIZADA"] = "OK";
        }


    }

}
