using core.componente;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;
using modelo;
using util.servicios.ef;
using dal.talentohumano;
using core.servicios.mantenimiento;
using Newtonsoft.Json;
using dal.gestordocumental;
using dal.talentohumano.evaluacion;

namespace talentohumano.comp.mantenimiento.evaluacion.notificaciones.EvaluacionNJS
{
    public class estadoEvaluacion : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            
            if ((rqmantenimiento.Mdatos.ContainsKey("finalizadageneral"))){
                if (bool.Parse(rqmantenimiento.Mdatos["finalizadageneral"].ToString())) {

                    tthasignacion ev = TthAsignacionDal.Find(rqmantenimiento.GetLong("cevaluacion").Value);
                    ev.finalizada = true;
                    ev.Actualizar = true;
                    ev.Esnuevo = false;
                    rqmantenimiento.AdicionarTabla("tthasignacionnjs", ev, false);
                    rqmantenimiento.Response["FINALIZADA"] = true;
                }
            }

            try
            {
                if ((!rqmantenimiento.Mdatos.ContainsKey("ldatos")))
                {
                    return;
                }

                    var ldtados = JsonConvert.DeserializeObject<List<tthasignacionresp>>(@rqmantenimiento.Mdatos["ldatos"].ToString());
                bool aprobada = bool.Parse(rqmantenimiento.Mdatos["aprobada"].ToString());
                IList<tthasignacionresp> evaluaciones = new List<tthasignacionresp>();

                foreach (tthasignacionresp evaluacion in ldtados)
                {
                    tthasignacion _tthevaluacionasignacion = TthAsignacionDal.Find(evaluacion.casignacion);
                    Dictionary<string, object> param = new Dictionary<string, object>();
                    List<string> correos = new List<string>();
                    tthfuncionariodetalle fun = TthFuncionarioDal.Find(_tthevaluacionasignacion.cfuncionario);
                    tthfuncionariodetalle eval = TthFuncionarioDal.Find(_tthevaluacionasignacion.jefecfuncionario);


                    rqmantenimiento.Mdatos.Add("lmails", null);
                    rqmantenimiento.Mdatos.Add("cnotificacion", 9);

                  
                    tthevaluacionperiodo per = tthEvaluacionPeriodoDal.Find(_tthevaluacionasignacion.cperiodo);

                    string correos1 = (fun.email != null) ? fun.email : null;
                    string correos2 = (fun.emailinstitucion != null) ? fun.emailinstitucion : null;

                    param.Add("nfuncionario", fun.primernombre + " " + fun.primerapellido);
                    param.Add("nperiodo", per.nombre);
                    param.Add("ncalificacion", evaluacion.calificacion.ToString());
                    param.Add("finicio", per.finicio.ToString("yyyy-MM-dd"));
                    param.Add("ffin", (evaluacion.periodoprueba.Value)?DateTime.Now.ToString("yyyy-MM-dd"):per.ffin.ToString("yyyy-MM-dd"));
                    param.Add("nevaluador", eval.primernombre + " " + eval.primerapellido);
                    string dato = null;

                    decimal MAXIMO = TthParametrosDal.GetValorNumerico("MAXNOTA", rqmantenimiento.Ccompania);

                    if (evaluacion.calificacion > MAXIMO)
                    {
                        dato = "Aprobada";
                    }

                    else
                    {

                        dato = "Reprobada";
                    }
                    param.Add("nnotificacion", dato);
                    Dictionary<string, byte[]> adjuntos = new Dictionary<string, byte[]>();
    
                    rqmantenimiento.Mdatos.Add("parametrosmail", param);
                    if (correos1 != null)
                    {
                        correos.Add(correos1);
                    }

                    if (correos2 != null)
                    {
                        correos.Add(correos2);
                    }

                    string jefe = (eval.emailinstitucion != null) ? eval.emailinstitucion : null;
                    if (jefe != null)
                    {
                        correos.Add(jefe);
                    }
                    if (correos.Count > 0)
                    {
                        rqmantenimiento.Mdatos["lmails"] = correos;
                       

                        RqMantenimiento rq = (RqMantenimiento)rqmantenimiento.Clone();
                        Mantenimiento.ProcesarAnidado(rq, 11, 427);
                    }
                    else
                    {
                        //POSIBLE ERROR EN LECTURA DE CORREOS
                    }

                }
            }
            catch (Exception ex)
            {
                rqmantenimiento.Response["FINALIZADA"] = false;

            }
            
            }
        
        }
    }



