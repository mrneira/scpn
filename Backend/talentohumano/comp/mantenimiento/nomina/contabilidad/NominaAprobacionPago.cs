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

namespace talentohumano.comp.mantenimiento.nomina.contabilidad
{
  public  class NominaAprobacionPago : ComponenteMantenimiento

    {
        /// <summary>
        /// Clase para aprobar la nómina por talento humano par el pago 
        /// </summary>
        /// <param name="rm"></param>
        public override void Ejecutar(RqMantenimiento rm)
        {
            bool aprobada = (bool)rm.Mdatos["aprobada"];
            var dlnomina = JsonConvert.DeserializeObject<IList<tnomnomina>>(@rm.Mdatos["nomina"].ToString());
            IList<tnomnomina> nom = new List<tnomnomina>();
            foreach (tnomnomina nomina in dlnomina)
            {
                if (aprobada)
                {
                    nomina.Esnuevo = false;
                    nomina.Actualizar = true;
                    nomina.direjecutiva = true;
                    nomina.cusuarioaprobacion = rm.Cusuario;
                    nom.Add(nomina);

                }
                else
                {
                    //ELIMINAR NÓMINA
                    TnomNominaDal.Eliminar(nomina.cnomina);

                }
            }
            rm.Mtablas["NOMINA"] = null;
            rm.AdicionarTabla("tnomnomina", nom, false);
            rm.Response["FINALIZADA"] = true;
        }
    }
}
