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
using dal.talentohumano.nomina;
using core.servicios;
using util.servicios.ef;
using modelo.helper;

namespace talentohumano.comp.consulta.nomina.nomina
{
    public class Generada : ComponenteConsulta
    {
        public override void Ejecutar(RqConsulta rm)
        {


            //DATOS INICIALES NÓMINA

            var dlnomina = JsonConvert.DeserializeObject<tnomnomina>(@rm.Mdatos["registro"].ToString());
            //LISTA DE FUNCIONARIOS EN NÓMINA
            var ls = JsonConvert.DeserializeObject<tnomrol>(@rm.Mdatos["ldatos"].ToString());
            //consulta datos nómina
            tnomparametrodetalle param = TnomparametroDal.Find((long)dlnomina.anio);


            Rol rol = new Rol();

            tthcontratodetalle cd = TthContratoDal.FindContratoFuncionario(ls.cfuncionario.Value);
            tnomdecimos tnd = TnomDecimosDal.FindAnio((long)dlnomina.anio, cd.cfuncionario);
            tnompagoregionesdecimo pdecimo = TnomPagoRegionesDecimoDal.FindRegion(dlnomina.anio, cd.regioncdetalle);


            rol = new Rol(dlnomina.finicio.Value, dlnomina.ffin.Value, rm.Ccompania, dlnomina.cnomina, (long)dlnomina.anio, dlnomina.mescdetalle, cd, param, pdecimo, tnd);
            //CALCULOS GENERALES
            rol.setDatosGenerales();
            
            tnomrol tnr = rol.Rolpagos;
            tnr.Esnuevo = false;
            tnr.Actualizar = true;
            tnr.cusuariomod = rm.Cusuario;
            tnr.fmodificacion = rm.Freal;
            tnr.cnomina = dlnomina.cnomina;
            tnr.crol = ls.crol;
            tnr.cusuarioing = ls.cusuarioing;
            tnr.fingreso = ls.fingreso;
            tnr.ccontrato = ls.ccontrato;
            tnr.cproceso = ls.cproceso;
            tnr.cdepartamento = ls.cdepartamento;
            tnr.ccargo = ls.ccargo;
            tnr.cfuncionario = ls.cfuncionario;
            tnr.cusuariomod = rm.Cusuario;
            tnr.fmodificacion = rm.Freal;
            EntityHelper.SetActualizar(tnr);
           // Sessionef.Actualizar(tnr);
            Sessionef.Save(tnr);

            IList<tnomingreso> ing = new List<tnomingreso>();
            IList < tnomegreso> egr = new List<tnomegreso>();
            decimal ting = 0;
            decimal tegr = 0;

            foreach (tnomingreso tni in rol.ing)
                {
                    tnomingreso tning = tni;
                ting = ting + tni.calculado.Value;
                ing.Add(tning);
                   
                }
                foreach (tnomegreso tni in rol.egr)
                {
                    tnomegreso tneg = tni;
                tegr = tegr + tni.calculado.Value;
                egr.Add(tneg);
            }
                
            rm.Response["INGRESOS"] = ing;
            rm.Response["EGRESOS"] = egr;
            rm.Response["TOTALE"] = tegr;
            rm.Response["TOTALEI"] = ting;

        }





        
    

    }
}
