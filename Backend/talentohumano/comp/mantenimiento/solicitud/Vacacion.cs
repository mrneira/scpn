using util.dto.mantenimiento;
using modelo;
using Newtonsoft.Json;
using util.servicios.ef;
using core.servicios;
using dal.talentohumano;
using core.componente;
using System;

namespace talentohumano.comp.mantenimiento.solicitud
{

    public class Vacacion : ComponenteMantenimiento
    {


        public override void Ejecutar(RqMantenimiento rm)
        {
            if (!rm.Mdatos.ContainsKey("csolicitud"))
            {
                return;
            }
             long csolicitud = long.Parse(rm.Mdatos["csolicitud"].ToString());
            //long cfuncionario = long.Parse(rm.Mdatos["cfuncionario"].ToString());


            var dlregistros = JsonConvert.DeserializeObject<tnomvacacion>(@rm.Mdatos["registro"].ToString());
            tnomvacacion ob = dlregistros;
            ob.csolicitud = csolicitud;
            long cvacacion = Secuencia.GetProximovalor("SCVACACION");
            ob.cvacacion = cvacacion;
          

            Sessionef.Grabar(ob);

            rm.Response["FINALIZADA"] = "OK";
        }


    }
}
