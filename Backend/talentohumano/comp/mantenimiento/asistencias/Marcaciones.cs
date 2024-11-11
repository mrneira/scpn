using core.componente;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;
using Json;
using Newtonsoft.Json;
using dal.talentohumano;
using util.dto.TMarcacion;
namespace talentohumano.comp.mantenimiento.asistencias
{
    public class Marcaciones : ComponenteMantenimiento
    {


        public override void Ejecutar(RqMantenimiento rm)
        {

            String lregistros = rm.Mdatos["lregistros"].ToString();
            String lregistroseliminar = rm.Mdatos["lregistroseliminar"].ToString();

            var dlregistros = JsonConvert.DeserializeObject<List<TMarcacion>>(@rm.Mdatos["lregistros"].ToString());
            var dlregistroseliminar = JsonConvert.DeserializeObject<List<TMarcacion>>(@rm.Mdatos["lregistroseliminar"].ToString());

            try
            {
                foreach (TMarcacion mar in dlregistros) {
                    if (mar.esnuevo) {
                        TthMarcacionesDal.Insert(mar);
                    }
                    if (mar.actualizar) {
                        TthMarcacionesDal.Update(mar);
                    }
                }

                foreach (TMarcacion mare in dlregistroseliminar)
                {
                    TthMarcacionesDal.Delete(mare);
                    
                }


            }
            catch (Exception ex)
            {
                rm.Response["mensaje"] = ex.Message;
                return;
            }
            rm.Response["FINALIZADA"] = "OK";
        }

       
    }

}

