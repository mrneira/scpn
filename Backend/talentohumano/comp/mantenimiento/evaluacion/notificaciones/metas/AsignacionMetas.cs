﻿using core.componente;
using core.servicios.mantenimiento;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;
using modelo;
using dal.talentohumano;
using util;

namespace talentohumano.comp.mantenimiento.evaluacion.notificaciones.metas
{
    public class AsignacionMetas : ComponenteMantenimiento
    {
        /// <summary>
        /// Clase para enviar notificación de mantenimiento
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            if ((!rqmantenimiento.Mdatos.ContainsKey("ldatos")))
            {
                return;
            }
            var lmetasnotificacion = JsonConvert.DeserializeObject<List<tthmeta>>(@rqmantenimiento.Mdatos["ldatos"].ToString());
                IList<tthmeta> evaluaciones = new List<tthmeta>();
                foreach (tthmeta evaluacion in lmetasnotificacion)
                {
                      
                    Dictionary<string, object> param = new Dictionary<string, object>();
                    List<string> correos = new List<string>();
                    tthfuncionariodetalle eval = TthFuncionarioDal.Find(evaluacion.cfuncionario.Value);
                        param.Add("nombre", eval.primernombre + " " + eval.primerapellido);
                     
                        evaluacion.finalizada = false;
                        rqmantenimiento.Mdatos.Add("lmails", null);

                tthparametros CNOTIFICACIONMETA = TthParametrosDal.Find("CNOTIFICACIONMETA", rqmantenimiento.Ccompania);
                if (CNOTIFICACIONMETA == null || CNOTIFICACIONMETA.numero.Value == 0)
                {
                    throw new AtlasException("TTH-012", "NO SE HA DEFINIDO EL PARÁMETRO {0}", "CNOTIFICACIONMETA");

                }

                rqmantenimiento.Mdatos.Add("cnotificacion", (int)CNOTIFICACIONMETA.numero.Value);
                        
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
                    
                    
                    evaluaciones.Add(evaluacion);
                }
        }
    }
}
