using core.componente;
using core.servicios.mantenimiento;
using dal.talentohumano;
using modelo;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;
using dal.gestordocumental;
using dal.talentohumano.evaluacion;
namespace talentohumano.comp.mantenimiento.evaluacion
{
    public class EstadoDirecionEjecutiva : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            try
            {

                var ldtados = JsonConvert.DeserializeObject<List<tthasignacionresp>>(@rqmantenimiento.Mdatos["ldatos"].ToString());
                bool aprobada = bool.Parse(rqmantenimiento.Mdatos["aprobada"].ToString());
                IList<tthasignacionresp> evaluaciones = new List<tthasignacionresp>();
                foreach (tthasignacionresp evaluacion in ldtados)
                {
                    evaluacion.Actualizar = true;
                    evaluacion.Esnuevo = false;
                    //SE VALIDA QUE YA NO APARESCA EN NOTIFICACIONES DE DIRECIÓN EJECUTIVA.
                    evaluacion.direstado = false;
                    evaluacion.diraprobado = aprobada;
                    tthasignacion _tthevaluacionasignacion = TthAsignacionDal.Find(evaluacion.cevaluacion.Value);
                    Dictionary<string, object> param = new Dictionary<string, object>();
                    List<string> correos = new List<string>();
                    tthfuncionariodetalle fun = TthFuncionarioDal.Find(_tthevaluacionasignacion.cfuncionario);
                    tthfuncionariodetalle eval = TthFuncionarioDal.Find(_tthevaluacionasignacion.jefecfuncionario);


                    if (evaluacion.diraprobado == false)
                    {
                        param.Add("nevaluador", eval.primernombre + " " + eval.primerapellido);
                        param.Add("nfuncionario", fun.primernombre + " " + fun.primerapellido);
                        evaluacion.finalizada = false;
                        rqmantenimiento.Mdatos.Add("lmails", null);
                        rqmantenimiento.Mdatos.Add("cnotificacion", 10);
                        

                        if (eval.email != null) {
                            correos.Add(eval.email);
                        }
                        if (eval.emailinstitucion != null)
                        {
                            correos.Add(eval.emailinstitucion);
                        }
                        if (correos.Count > 0)
                        {
                            rqmantenimiento.Mdatos.Add("parametrosmail", param);
                            rqmantenimiento.Mdatos["lmails"] = correos;
                            RqMantenimiento rq = (RqMantenimiento)rqmantenimiento.Clone();
                            Mantenimiento.ProcesarAnidado(rq, 11, 427);
                        }
                    }
                    
                    evaluaciones.Add(evaluacion);
                }
                
                //Mantenimiento a evaluaciones aprobadas o desaprobadas.
                rqmantenimiento.AdicionarTabla("tthasignacionresp", evaluaciones, false);


            }


            catch (Exception ex)
            {
                rqmantenimiento.Response["FINALIZADA"] = false;

            }
        }
    }
}
