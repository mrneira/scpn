using core.componente;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;
using dal.talentohumano;
using util;
using talentohumano.enums;
using core.servicios;
using util.servicios.ef;
using dal.talentohumano.nomina;
using dal.generales;

namespace talentohumano.comp.mantenimiento.solicitud
{
    public class GenerarPermiso : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rm)
        {
            if (rm.GetTabla("SOLICITUDES") == null || !rm.GetTabla("SOLICITUDES").Lregistros.Any())
            {
                return;
            }
            IList < tnomsaldovacaciones > salvacacion = new List<tnomsaldovacaciones>();
            List<tnomsolicitud> ldatos = rm.GetTabla("SOLICITUDES").Lregistros.Cast<tnomsolicitud>().ToList();
            foreach (tnomsolicitud tns in ldatos)
            {

                if (tns.tipocdetalle.Equals("PER") && tns.aprobada.Value == true)
                {
                    tthcontratodetalle cd = new tthcontratodetalle();
                    tnompermiso PER = TnomPermisoDal.FindSolicitud(tns.csolicitud);
                    decimal totaldias = 0;
                    cd = TthContratoDal.FindContratoFuncionario(tns.cfuncionario.Value);

                    if (PER.permisocdetalle.Equals("PPA"))
                    {
                        if (PER.diacompleto.Value)
                        {
                            DateTime s = PER.finicio.Value;
                            DateTime sF = PER.ffin.Value;

                            totaldias = ( sF-s).Days;
                            totaldias = totaldias + 1;

                        }
                        else
                        {
                            DateTime Fecini = PER.finicio.Value;
                            DateTime FecFinal = PER.ffin.Value;
                            System.TimeSpan dif = FecFinal - Fecini;
                            DateTime FecSec;//fecha seleccionad en el bucle
                            int diasvalidos = 0;
                            for (int n = 0; n <= dif.Days; n++)
                            {
                                FecSec = Fecini.AddDays(n);
                                int diaSemana = (int)FecSec.DayOfWeek;
                                tthhorariodetalle hr = ThumHorarioDal.Find(cd.chorario.Value, diaSemana.ToString());

                                if (hr != null)
                                {
                                    //EXTRAE HORA INICIO Y FIN DE SOLICITUD

                                    int horaInicio = int.Parse(PER.hinicio.Value.ToString("HHmm"));
                                    int horaFin = int.Parse(PER.hfin.Value.ToString("HHmm"));
                                    DateTime hfin = PER.hfin.Value;

                                    //VALIDA SI LA HORA DE FIN ES MAYOR A LA DEL HORARIO LA REMPLAZA
                                    if (horaFin > hr.fjornadaint.Value)
                                    {
                                        hfin = PER.hinicio.Value + hr.fjornada.Value;
                                    }
                                    System.TimeSpan T1;
                                    if (diasvalidos > 1)
                                    {
                                        T1 = hr.fjornada.Value;
                                    }
                                    else
                                    {
                                        T1 = System.TimeSpan.Parse(PER.hinicio.Value.ToString("HH:mm:ss"));

                                    }

                                    System.TimeSpan T2 = System.TimeSpan.Parse(hfin.ToString("HH:mm:ss"));

                                    System.TimeSpan total = T2 - T1;
                                    decimal totalHorasDiaras = (decimal)(horaFin - horaInicio) / 100;
                                    //VALOR APLICADO A HORAS PROPORCIONAL
                                    totaldias = totaldias + ((decimal)total.TotalDays) / totalHorasDiaras;
                                    diasvalidos++;
                                }

                            }



                        }
                        decimal diasDisponibles = TnomsaldoVacacionDal.Total(tns.cfuncionario.Value);
                        totaldias = decimal.Round(totaldias, 2, MidpointRounding.AwayFromZero);
                        if (totaldias> diasDisponibles) 
                        {
                            tthfuncionariodetalle fun = TthFuncionarioDal.FindFuncionario(tns.cfuncionario.Value);
                            throw new AtlasException("TTH-017", "EL FUNCIONARIO {0} SOLO TIENE {1} DIAS DISPONIBLES, SE HA SOLICITADO {2}", fun.primernombre + " " + fun.primerapellido, diasDisponibles, totaldias);
                        }
                        tnomsaldovacaciones ob = new tnomsaldovacaciones();
                        ob.Esnuevo = true;
                        ob.Actualizar = false;
                        ob.cusuarioing = rm.Cusuario;
                        ob.fingreso = rm.Freal;
                        ob.fechageneracion = rm.Freal;
                        ob.mesccatalogo = 4;
                        ob.mescdetalle = completarMes((rm.Freal.Month));
                        ob.anio = (int)rm.Freal.Year;
                        ob.sueldoactual = cd.remuneracion.Value;
                        ob.cfuncionario = cd.cfuncionario;
                        ob.dias = -totaldias;
                        decimal vtotal = totaldias * (cd.remuneracion.Value / 30);
                        vtotal = decimal.Round(vtotal, 2, MidpointRounding.AwayFromZero);
                        ob.valor = vtotal;
                        tgentransaccion trans = TgentransaccionDal.Find(rm.Cmodulo, rm.Ctranoriginal);
                        tgencatalogodetalle CAT = TgenCatalogoDetalleDal.Find(PER.permisoccatalogo.Value, PER.permisocdetalle);
                        ob.tipoccatalogo = 1162;
                        ob.tipocdetalle = "PER";
                        ob.comentario = "SOLICITUD TIPO: " + CAT.nombre+ " - "+ PER.motivo;

                        long cvacacion = Secuencia.GetProximovalor("SVACACION");
                        ob.csaldovacaciones = cvacacion;
                        salvacacion.Add(ob);


                    }

                   

                }
                if (tns.tipocdetalle.Equals("VAC") && tns.aprobada.Value == true)
                {
                    tnomvacacion VAC = TnomVacacionDal.FindSolicitud(tns.csolicitud);
                    tthcontratodetalle cd = TthContratoDal.FindContratoFuncionario(tns.cfuncionario.Value);
                    decimal diasDisponibles = TnomsaldoVacacionDal.Total(tns.cfuncionario.Value);

                    /*if ( diasDisponibles<= VAC.dias.Value) 
                    {
                        tthfuncionariodetalle fun = TthFuncionarioDal.FindFuncionario(tns.cfuncionario.Value);
                        throw new AtlasException("TTH-017", "EL FUNCIONARIO {0} SOLO TIENE {1} DIAS DISPONIBLES, SE HA SOLICITADO {2}",fun.primernombre+ " "+ fun.primerapellido,diasDisponibles, VAC.dias.Value);

                    }
                    */
                    decimal totaldias = VAC.dias.Value;
                     tnomsaldovacaciones ob = new tnomsaldovacaciones();
                    ob.Esnuevo = true;
                    ob.Actualizar = false;
                    ob.cusuarioing = rm.Cusuario;
                    ob.fingreso = rm.Freal;
                    ob.fechageneracion = rm.Freal;
                    ob.mesccatalogo = 4;
                    ob.mescdetalle = completarMes((rm.Freal.Month));
                    ob.anio = (int)rm.Freal.Year;
                    ob.sueldoactual = cd.remuneracion.Value;
                    ob.cfuncionario = cd.cfuncionario;
                    ob.dias = -totaldias;
                    ob.tipoccatalogo = 1162;
                    ob.tipocdetalle = "VAC";

                    long cvacacion = Secuencia.GetProximovalor("SVACACION");
                    ob.csaldovacaciones = cvacacion;
                   // tgencatalogodetalle CAT = TgenCatalogoDetalleDal.Find(VAC.permisoccatalogo.Value, PER.permisocdetalle);

                    ob.comentario = "SOLICITUD TIPO: " + "VACACIÓN" + " - DIAS:"+VAC.dias+" - " + VAC.comentario;
                    salvacacion.Add(ob);


                }
            }

            rm.AdicionarTabla("tnomsaldovacaciones", salvacacion, false);
        }
        /// <summary>
        /// Procedimiento que se encarga de generar 
        /// </summary>
        /// <param name="mesg"></param>
        /// <returns>Retorna el mes atual para catálogos</returns>
        private string completarMes(decimal mesg)
        {
            string mesgenerado = "";
            if (mesg < 10)
            {
                mesgenerado = "0";
            }
            return mesgenerado + mesg.ToString();
        }
    }
}
