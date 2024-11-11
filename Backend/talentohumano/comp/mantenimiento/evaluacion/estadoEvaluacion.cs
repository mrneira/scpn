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
using util;
using core.servicios;
using dal.generales;

namespace talentohumano.comp.mantenimiento.evaluacion
{
    public class estadoEvaluacion : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            bool encontrado = false;
            if ((rqmantenimiento.Mdatos.ContainsKey("finalizadageneral")))
            {
                if (bool.Parse(rqmantenimiento.Mdatos["finalizadageneral"].ToString()))
                {
                    tthasignacionresp resp = new tthasignacionresp();
                    long casignacion = rqmantenimiento.GetLong("casignacion").Value;

                    if (rqmantenimiento.GetTabla("EVALUACION") != null)
                    {
                        resp = (tthasignacionresp)rqmantenimiento.GetTabla("EVALUACION").Lregistros.ElementAt(0);
                       
                        encontrado = false;
                    }
                    else
                    {
                        resp= TthAsignacionRespDal.Find(casignacion);
                        resp.Actualizar = true;
                        resp.Esnuevo = false;
                        encontrado = true;
                    }

                      
                    tthasignacion ev = TthAsignacionDal.Find(resp.cevaluacion.Value);
                    ev.finalizada = true;
                    ev.Actualizar = true;
                    ev.Esnuevo = false;

                    tthasignaciondetalle asigDetalle = new tthasignaciondetalle();
                    asigDetalle.casignaciondetalle= Secuencia.GetProximovalor("SASIGNACIOND");
                    asigDetalle.cusuarioing = rqmantenimiento.Cusuario;
                    asigDetalle.casignacion = casignacion;
                    asigDetalle.fingreso = rqmantenimiento.Freal;
                    tthevaluacionperiodo per = tthEvaluacionPeriodoDal.Find(ev.cperiodo);

                    IList<tthsancion> sanciones = TthSancionDal.Find(ev.cfuncionario, ev.cperiodo);
                    IList<tthasignacionsancion> sancioneseva = new List<tthasignacionsancion>();

                    //ASIGNACIÓN DE SANCIONES DEL EMPLEADO
                    decimal maxSancion = 0;
                    foreach (tthsancion s in sanciones)
                    {
                        tthasignacionsancion sancion = new tthasignacionsancion();
                        sancion.Esnuevo = true;
                        sancion.csancion = Secuencia.GetProximovalor("SSANCIONP");
                        sancion.casignacion = casignacion;
                        sancion.sancionccatalogo = s.tiposancionccatalogo;
                        sancion.sancioncdetalle = s.tiposancioncdetalle;
                        sancion.fingreso = rqmantenimiento.Freal;
                        sancion.cusuarioing = rqmantenimiento.Cusuario;
                        decimal ponderacion = TthSancionPonderacionDal.FindPromedio(sancion.sancioncdetalle);
                        string nombre = TgenCatalogoDetalleDal.Find(sancion.sancionccatalogo.Value, sancion.sancioncdetalle).nombre;
                        if (ponderacion <= 0)
                        {
                            throw new AtlasException("TTH-022", "EL TIPO DE PONDERACIÓN {0} NO DEBE SER MENOR O IGUAL A 0", nombre);
                        }
                        else
                        {

                            sancion.promedio = ponderacion;
                            //ASIGNACIÓN MAXIMA SANCIÓN
                            if (maxSancion < sancion.promedio)
                            {
                                maxSancion = sancion.promedio.Value;
                            }
                        }

                        sancioneseva.Add(sancion);
                    }
                    asigDetalle.totalcumplimientonormas = maxSancion;

                   

                    decimal pcumplimiento = 0;
                    decimal pniveleseficiencia = 0;
                    decimal pusuariosexternos = 0;
                    decimal pusuariosinternos = 0;

                    if (ev.periodoprueba.Value)
                    {
                        //PORCENTAJE CUMPLIMIENTO EVALUACIÓN DE PRUEBA
                         pcumplimiento = TthParametrosDal.GetValorNumerico("PEP_NIVELCUMPLIMIENTO", rqmantenimiento.Ccompania);
                         pniveleseficiencia = TthParametrosDal.GetValorNumerico("PEP_NIVELESEFICIENCIA", rqmantenimiento.Ccompania);
                        asigDetalle.cusrexternos = 0;
                        asigDetalle.cusrinternos = 0;
                        asigDetalle.ccumplimiento = resp.pcaperiodoprueba;
                    }
                    else
                    {
                        //PORCENTAJE CUMPLIMIENTO EVALUACIÓN INDIVIDUAL
                        pcumplimiento = TthParametrosDal.GetValorNumerico("PEI_NIVELCUMPLIMIENTO", rqmantenimiento.Ccompania);
                        pniveleseficiencia = TthParametrosDal.GetValorNumerico("PEI_NIVELESEFICIENCIA", rqmantenimiento.Ccompania);
                        pusuariosexternos = TthParametrosDal.GetValorNumerico("PEI_NIVELEXTERNOS", rqmantenimiento.Ccompania);
                        pusuariosinternos = TthParametrosDal.GetValorNumerico("PEI_NIVELINTERNO", rqmantenimiento.Ccompania);


                        //ASIGNACIÓN DEL PROMEDIO EXTERNO
                        decimal extpromedio = TthEvaluacionExternaDal.FindPeriodo(per.cperiodo);
                        extpromedio = decimal.Round(extpromedio, 2, MidpointRounding.AwayFromZero);
                        if (extpromedio <= 0)
                        {
                            throw new AtlasException("TTH-022", "EL TIPO DE PONDERACIÓN {0} NO DEBE SER MENOR O IGUAL A 0","EVALUACIÓN EXTERNA");
                        }
                        //VALIDAR PROMEDIOS PROM <=0
                        asigDetalle.cusrexternos = extpromedio;


                        decimal promediometainterna = TthMetaDal.Find(ev.cperiodo, resp.cdepartamento);
                        if (promediometainterna <= 0)
                        {
                            throw new AtlasException("TTH-022", "EL TIPO DE PONDERACIÓN {0} NO DEBE SER MENOR O IGUAL A 0", "EVALUACIÓN INTERNA");
                        }
                       // decimal promedioDepartamento = TthMatrizCorrelacionDal
                        if (promediometainterna <= 0)
                        {
                            throw new AtlasException("TTH-022", "EL TIPO DE PONDERACIÓN {0} NO DEBE SER MENOR O IGUAL A 0", "EVALUACIÓN INTERNA");
                        }
                        asigDetalle.cusrinternos = extpromedio = decimal.Round(promediometainterna, 2, MidpointRounding.AwayFromZero);
                    }
                    //
                     //* (pcumplimiento / 100);

                    asigDetalle.ccalidadoportunidad = resp.pcalidadoportunidad * (pniveleseficiencia / 100);
                    asigDetalle.ccalidadoportunidad = decimal.Round(asigDetalle.ccalidadoportunidad, 4, MidpointRounding.AwayFromZero);
                    asigDetalle.ccconocimiento = resp.pconocimientoespecifico * (pniveleseficiencia / 100);
                    asigDetalle.ccconocimiento = decimal.Round(asigDetalle.ccconocimiento, 4, MidpointRounding.AwayFromZero);

                    asigDetalle.ccompetenciat = resp.pcompetenciatecnica * (pniveleseficiencia / 100);
                    asigDetalle.ccompetenciat = decimal.Round(asigDetalle.ccompetenciat, 4, MidpointRounding.AwayFromZero);

                    asigDetalle.ccompetenciac = resp.pcompetenciaconductual * (pniveleseficiencia / 100);
                    asigDetalle.ccompetenciac = decimal.Round(asigDetalle.ccompetenciac, 4, MidpointRounding.AwayFromZero);

                    //TOTALES PERIODO PRUEBA
                    asigDetalle.totalcumplimiento = asigDetalle.ccumplimiento;
                    asigDetalle.totalniveleseficiencia = asigDetalle.ccalidadoportunidad + asigDetalle.ccconocimiento + asigDetalle.ccompetenciat + asigDetalle.ccompetenciac;
                    asigDetalle.totalusrexternos = asigDetalle.cusrinternos * (pusuariosinternos / 100);
                    asigDetalle.totalusrinternos = asigDetalle.cusrinternos * (pusuariosinternos / 100);

                    asigDetalle.subtotal = (asigDetalle.totalcumplimiento + asigDetalle.totalniveleseficiencia+ asigDetalle.totalusrexternos+asigDetalle.totalusrinternos);
                    asigDetalle.totalgeneral = asigDetalle.subtotal.Value - maxSancion;
                    IList<tthcalificacioncualitativa> tcalif = TthCalificacionCualitativaDal.FindInDataBase();

                    long ccalificacion = 0;
                    decimal total = asigDetalle.totalgeneral;

                    foreach (tthcalificacioncualitativa cal in tcalif)
                    {
                        if ((total >= cal.desde) && (total < cal.hasta))
                        {
                            ccalificacion = cal.ccalificacion;
                        }

                    }
                    if (ccalificacion <= 0)
                    {
                        throw new AtlasException("TTH-022", "EL TIPO DE PONDERACIÓN {0} NO DEBE SER MENOR O IGUAL A 0", "CALIFICACIÓN CUALITATIVA");
                    }



                    asigDetalle.ccalificacion = ccalificacion;

                    long ccalificacioni = 0;
                    decimal totali = (asigDetalle.ccalidadoportunidad + asigDetalle.ccconocimiento + asigDetalle.ccompetenciac + asigDetalle.ccompetenciat) + asigDetalle.ccumplimiento;

                    foreach (tthcalificacioncualitativa cal in tcalif)
                    {
                        if ((totali >= cal.desde) && (totali < cal.hasta))
                        {
                            ccalificacioni = cal.ccalificacion;
                        }

                    }
                    if (ccalificacioni <= 0)
                    {
                        throw new AtlasException("TTH-022", "EL TIPO DE PONDERACIÓN {0} NO DEBE SER MENOR O IGUAL A 0", "CALIFICACIÓN INDIVIDUAL CUALITATIVA");
                    }
                    resp.ccalificacion = ccalificacioni;

                    if (encontrado)
                    {
                        rqmantenimiento.AdicionarTabla("tthasignacionresp", resp, false);
                    }
                    rqmantenimiento.AdicionarTabla("tthasignacion", ev, false);
                    rqmantenimiento.AdicionarTabla("tthasignaciondetalle", asigDetalle, false);
                    rqmantenimiento.AdicionarTabla("tthasignacionsancion", sancioneseva, false);

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
                    param.Add("ffin", (evaluacion.periodoprueba.Value) ? DateTime.Now.ToString("yyyy-MM-dd") : per.ffin.ToString("yyyy-MM-dd"));
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


                    if (evaluacion.cgesarchivo != null)
                    {
                        tgesarchivo ar = TgesArchivoDal.FindArchivo(evaluacion.cgesarchivo.Value);

                        adjuntos.Add(string.Format("{0}-{1}.{2}", "Evaluación", fun.documento, ar.extension), ar.archivo);
                        rqmantenimiento.Mdatos.Add("adjuntos", adjuntos);
                    }

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



