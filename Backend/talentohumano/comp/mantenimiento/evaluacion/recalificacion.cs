using core.componente;
using dal.talentohumano;
using modelo;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;
using dal.talentohumano.evaluacion;

namespace talentohumano.comp.mantenimiento.evaluacion
{
    public class recalificacion : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
             if (!rqmantenimiento.Mdatos.ContainsKey("ldatos"))
             {
                 return;
             }
             IList<tthasignacion> EVAL = new List<tthasignacion>();
             var ldtados = JsonConvert.DeserializeObject<List<tthasignacionresp>>(@rqmantenimiento.Mdatos["ldatos"].ToString());

             IList<tthasignacionresp> evaluaciones = new List<tthasignacionresp>();
             foreach (tthasignacionresp evaluacion in ldtados)
             {
                tthasignacion ev = TthAsignacionDal.Find(evaluacion.cevaluacion.Value);
                 ev.finalizada = false;
                 ev.Actualizar = true;
                 ev.Esnuevo = false;

                 EVAL.Add(ev);
             }
             rqmantenimiento.AdicionarTabla("tthasignacion", EVAL, false);
             rqmantenimiento.Response["FINALIZADA"] = true;
        }
    }
}
