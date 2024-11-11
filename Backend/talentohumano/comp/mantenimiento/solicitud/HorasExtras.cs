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
    public class HorasExtras : ComponenteMantenimiento
    {


        public override void Ejecutar(RqMantenimiento rm)
        {
            if (!rm.Mdatos.ContainsKey("csolicitud"))
            {
                return;
            }
             long csolicitud = long.Parse(rm.Mdatos["csolicitud"].ToString());
            

            var dlregistros = JsonConvert.DeserializeObject<tnomhoraextra>(@rm.Mdatos["registro"].ToString());
            tnomhoraextra ob = dlregistros;
            ob.csolicitud = csolicitud;
            long choraextra = Secuencia.GetProximovalor("SCHORAEXTRA");
            ob.choraextra = choraextra;
            Sessionef.Grabar(ob);

            rm.Response["FINALIZADA"] = "OK";
        }


    }

}
