using core.componente;
using dal.talentohumano;
using modelo;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using talentohumano.datos;
using util.dto.consulta;

namespace talentohumano.comp.consulta.nomina.nomina
{
    public class Decimos : ComponenteConsulta
    {
        public override void Ejecutar(RqConsulta rm)
        {
            var dlnomina = JsonConvert.DeserializeObject<tnomnomina>(@rm.Mdatos["registro"].ToString());
            //LISTA DE FUNCIONARIOS EN NÓMINA
            var ls = JsonConvert.DeserializeObject<ListadoNomina>(@rm.Mdatos["ldatos"].ToString());
            //consulta datos nómina
            tnomparametrodetalle param = TnomparametroDal.Find((long)dlnomina.anio);
            talentohumano.datos.Decimos de = new talentohumano.datos.Decimos();
            tnomingreso tni;
            if (dlnomina.tipocdetalle.Equals("DET"))
            {
                tni = de.getDecimoTercero();
            }
            else 
            {
                tni = de.getDecimoCuarto();
            }
        
        

            rm.Response["DECIMO"] = tni;

        }
    }
}
