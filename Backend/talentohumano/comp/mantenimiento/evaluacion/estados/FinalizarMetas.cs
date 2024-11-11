using core.componente;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;
using dal.talentohumano.evaluacion;

namespace talentohumano.comp.mantenimiento.evaluacion.estados
{
    public class FinalizarMetas : ComponenteMantenimiento

    {
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            if ((rqmantenimiento.Mdatos.ContainsKey("finalizar")))
            {
                bool encontrado = false;
                if (bool.Parse(rqmantenimiento.Mdatos["finalizar"].ToString()))
                {
                    tthmeta resp = new tthmeta();
                    long cmeta = 0;
                    if (rqmantenimiento.GetTabla("EVALUACIONMETA") != null)
                    {
                        resp = (tthmeta)rqmantenimiento.GetTabla("EVALUACION").Lregistros.ElementAt(0);

                        encontrado = false;
                        cmeta = resp.cmeta;
                    }
                    else
                    {
                        resp = TthMetaDal.Find(cmeta);
                        resp.Actualizar = true;
                        resp.Esnuevo = false;
                        encontrado = true;
                    }

                    rqmantenimiento.Response["FINALIZADA"] = true;



                }
            }

        }
    }
}
