using core.componente;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.consulta;
using modelo;
using dal.talentohumano;
using System.Drawing;
using modelo.helper;
using dal.generales;

namespace talentohumano.comp.consulta.reportes
{
    public class CalendarioInstitucional : ComponenteConsulta
    {

        /// <summary>
        /// Metodo que entrega la plantilla a consultar.
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            {
                int cont = 0;
                int anio = int.Parse(rqconsulta.Mdatos["anio"].ToString());

                IList<tnommatrizvacacion> mv = TnomMatrizVacacionDal.Find(anio);
                IList<tnomferiados> fer = TnomFeriadoDal.Find(anio);

                List<Evento> eventos = new List<Evento>();
                IList<tthevaluacionperiodo> periodoEvaluacion = tthEvaluacionPeriodoDal.FindInDataBase();

                foreach (tthevaluacionperiodo mvo in periodoEvaluacion)
                {
                    Evento evento = new Evento();
                    evento.id = cont++;
                    evento.title = "EVALUACIÓN-" + mvo.descripcion;
                    evento.start = mvo.finicio;
                    evento.end = mvo.ffin;
                    evento.AddDatos("ntipo", "EVALUACIÓN DE DESEMPEÑO");
                    evento.AddDatos("finicio", evento.start);
                    evento.AddDatos("ffin", evento.end);
                    evento.AddDatos("ndescripcion", mvo.descripcion);
                    evento.AddDatos("nevento", "EVA");
                    Random r = new Random();
                    Color myColor = Color.FromArgb(r.Next(0, 256), r.Next(0, 256), r.Next(0, 256));
                    string hex = myColor.R.ToString("X2") + myColor.G.ToString("X2") + myColor.B.ToString("X2");

                    evento.allDay = true;
                    eventos.Add(evento);
                }
                //COLORES DE EVENTOS
                string cVacacion = TthParametrosDal.GetValorTexto("CEVENTO",rqconsulta.Ccompania);
                string cFeriado = TthParametrosDal.GetValorTexto("CFERIADO", rqconsulta.Ccompania);
               


                foreach (tnommatrizvacacion mvo in mv) {

                    tthfuncionariodetalle fun = TthFuncionarioDal.Find(long.Parse(mvo.cfuncionario.ToString()));
                    tthcontratodetalle con = TthContratoDal.FindContratoFuncionario(fun.cfuncionario);
                    tthcargo carg = TthcargoDal.FindInDataBaseCodigo(con.ccargo);
                    tthdepartamento dep = TthDepartamentoDal.FindDepartamento(long.Parse(carg.cdepartamento.ToString()));
                    tthproceso pro = TthProcesoDal.FindPrceso(dep.cproceso);
                    
                    Evento evento = new Evento();
                    evento.id = cont++;
                    evento.title = "VAC-" + fun.documento + " - " + fun.primernombre + " " + fun.primerapellido;
                    evento.start = mvo.finicio;
                    evento.end = mvo.ffin;
                    Random r = new Random();
                    Color myColor = Color.FromArgb(r.Next(0, 256), r.Next(0, 256), r.Next(0, 256));
                    string hex = myColor.R.ToString("X2") + myColor.G.ToString("X2") + myColor.B.ToString("X2");
                    evento.AddDatos("nfuncionario", fun.primernombre + " " + fun.primerapellido);
                    evento.AddDatos("ncfuncionario", fun.primernombre + " " + fun.segundonombre + " " + fun.primerapellido + " " + fun.segundoapellido);
                    evento.AddDatos("ncargo", carg.nombre);
                    evento.AddDatos("ndepartamento", dep.nombre);
                    evento.AddDatos("nproceso", pro.nombre);
                    evento.AddDatos("ndepartamentoAb", dep.abreviatura);

                    evento.AddDatos("ntipo","VACACIÓN PROGRAMADA");
                    evento.AddDatos("finicio", evento.start);
                    evento.AddDatos("ffin", evento.end);
                    evento.AddDatos("nfuncionario", fun.primernombre+ " "+ fun.primerapellido);
                    evento.AddDatos("nevento", "VAC");

                    evento.colorId = hex;
                    evento.allDay = false;
                    eventos.Add(evento);
                }

                IList<tnomferiados> nfe = TnomFeriadoDal.Find(anio);
                foreach (tnomferiados mvo in nfe)
                {
                    Evento evento = new Evento();
                    evento.id = cont++;
                    evento.title = "FER-" + mvo.descripcion;
                    evento.start = new DateTime(mvo.anio, int.Parse(mvo.mescdetalle), mvo.dia);
                    evento.end = evento.start;
                    evento.AddDatos("ntipo", "FERIADO");
                    evento.AddDatos("finicio", evento.start);
                    evento.AddDatos("ffin", evento.end);
                    evento.AddDatos("ndescripcion", mvo.descripcion);
                    evento.AddDatos("nevento", "FER");
                    evento.colorId = cFeriado;
                    evento.allDay = true;
                    eventos.Add(evento);
                }


                IList<tnomsolicitud> np = TnomSolicitudDal.FindTipoEstado("PER", true);
                foreach (tnomsolicitud mvo in np)
                {
                    tthfuncionariodetalle fun = TthFuncionarioDal.Find(long.Parse(mvo.cfuncionario.ToString()));
                    tthcontratodetalle con = TthContratoDal.FindContratoFuncionario(fun.cfuncionario);
                    tthcargo carg = TthcargoDal.FindInDataBaseCodigo(con.ccargo);
                    tthdepartamento dep = TthDepartamentoDal.FindDepartamento(long.Parse(carg.cdepartamento.ToString()));
                    tthproceso pro = TthProcesoDal.FindPrceso(dep.cproceso);
                

                    Evento evento = new Evento();
                    evento.AddDatos("nfuncionario", fun.primernombre + " " + fun.primerapellido);
                    evento.AddDatos("ncfuncionario", fun.primernombre + " " + fun.segundonombre + " " + fun.primerapellido + " " + fun.segundoapellido);
                    evento.AddDatos("ncargo", carg.nombre);
                    evento.AddDatos("ndepartamento", dep.nombre);
                    evento.AddDatos("nproceso", pro.nombre);
                    evento.AddDatos("ndepartamentoAb", dep.abreviatura);
                    evento.id = cont++;
                    tnompermiso per = TnomPermisoDal.FindSolicitud(mvo.csolicitud);
                    tgencatalogodetalle tipopermiso = TgenCatalogoDetalleDal.Find(int.Parse(per.permisoccatalogo.ToString()), per.permisocdetalle);
                    evento.AddDatos("ntipoper", tipopermiso.nombre);

                    evento.AddDatos("finicio", per.finicio);
                    evento.AddDatos("ffin", per.ffin);
                    evento.AddDatos("diacompleto", per.diacompleto);

                    if (per.hinicio.HasValue)
                    {
                        evento.AddDatos("hinicio", per.hinicio.Value.ToString("HH:mm"));
                    }
                    if (per.hinicio.HasValue)
                    {
                        evento.AddDatos("hfin", per.hfin.Value.ToString("HH:mm"));
                    }
                    evento.AddDatos("motivo", per.motivo);
                    if (per.cgesarchivo.HasValue)
                    {
                        evento.AddDatos("archivo", true);
                        evento.AddDatos("cgesarchivo", per.cgesarchivo);
                    }
                    else
                    {
                        evento.AddDatos("archivo", false);
                    }
                    evento.title = "PER-" + fun.documento + " - " + fun.primernombre + " " + fun.primerapellido;
                    evento.start = DateTime.Parse(per.finicio.ToString());
                    evento.end = DateTime.Parse(per.ffin.ToString());
                   

                    evento.AddDatos("nevento", "PER");
                    evento.colorId = cFeriado;
                    evento.allDay = bool.Parse(per.diacompleto.ToString());

                    eventos.Add(evento);
                }
                

                rqconsulta.Response["EVENTOS"] = eventos;




            }
        }
        public class Evento : AbstractDto
        {
         public   int id { get; set; }
         public   string title { get; set; }
         public   DateTime start { get; set; }
         public   DateTime end { get; set; }
         public   string colorId { get; set; }
            public bool allDay { get; set; }

        }
        public class duration {

        }
    }
}
