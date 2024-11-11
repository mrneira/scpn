using core.componente;
using core.servicios;
using dal.talentohumano;
using dal.talentohumano.nomina;
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
   public class FondoReserva : ComponenteConsulta

    {
        public override void Ejecutar(RqConsulta rm)
        {

            //DATOS INICIALES NÓMINA

            var dlnomina = JsonConvert.DeserializeObject<tnomnomina>(@rm.Mdatos["registro"].ToString());
            //LISTA DE FUNCIONARIOS EN NÓMINA
            var ls = JsonConvert.DeserializeObject<ListadoNomina>(@rm.Mdatos["ldatos"].ToString());
            //consulta datos nómina
            tnomparametrodetalle param = TnomparametroDal.Find((long)dlnomina.anio);
            
            Rol rol = new Rol();

            tthcontratodetalle cd = TthContratoDal.FindContratoFuncionario(ls.cfuncionario.Value);
            tnomdecimos tnd = TnomDecimosDal.FindAnio((long)dlnomina.anio, cd.cfuncionario);
            tnompagoregionesdecimo pdecimo = TnomPagoRegionesDecimoDal.FindRegion(dlnomina.anio, cd.regioncdetalle);


            rol = new Rol(dlnomina.finicio.Value, dlnomina.ffin.Value, rm.Ccompania, dlnomina.cnomina, (long)dlnomina.anio, dlnomina.mescdetalle, cd, param, pdecimo, tnd);
            //CALCULOS GENERALES
            rol.setDatosGenerales();
            IList<tnomrol> ltnr = new List<tnomrol>();
            tnomrol tnr = rol.Rolpagos;
            tnr.Esnuevo = true;
            tnr.Actualizar = false;
             tnr.cnomina = dlnomina.cnomina;
            IList<tnomingreso> ing = new List<tnomingreso>();
            IList<tnomegreso> egr = new List<tnomegreso>();

           
           tnomingreso tni = rol.getFondoReserva();
                tnomingreso tning = tni;
                tnr.fingreso = DateTime.Now;
                ing.Add(tning);

         
            rm.Response["INGRESOS"] = ing;
            rm.Response["EGRESOS"] = egr;
        }
    }
}
