using core.componente;
using dal.talentohumano.nomina;
using modelo;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;

namespace talentohumano.comp.mantenimiento.nomina.nomina
{
    public class EliminarNomina : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rm)
        {
            if (rm.Mdatos.ContainsKey("reg")) {

            var nomina = JsonConvert.DeserializeObject<tnomnomina>(@rm.Mdatos["reg"].ToString());
                TnomNominaDal.Eliminar(nomina.cnomina);
                rm.Response["ELIMINADA"] = true;
            }

        }
    }
}
