using core.componente;
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
using core.servicios;
using dal.generales;

namespace talentohumano.comp.mantenimiento.solicitud
{
    public class GenerarAtrasos : ComponenteMantenimiento

    {
        /// <summary>
        /// Genera movimientos atrasos con cargo a vacaciones
        /// </summary>
        /// <param name="rm"></param>
        public override void Ejecutar(RqMantenimiento rm)
        {
            IList<tnomsaldovacaciones> salvacacion = new List<tnomsaldovacaciones>();

            var dlregistros = JsonConvert.DeserializeObject<IList<tnomfalta>>(@rm.Mdatos["ldatos"].ToString());
            IList<tnomfalta> faltas = new List<tnomfalta>();
            bool estado = bool.Parse(rm.Mdatos["aprobada"].ToString());
            long? cfuncionariojust = rm.GetLong("cfuncionariojust");

            foreach (tnomfalta falt in dlregistros) {

                falt.Actualizar = true;
                falt.Esnuevo = false;
                falt.cfuncionariojust = cfuncionariojust;
                falt.justificado = estado;
                falt.fvalidacion = rm.Freal;
                faltas.Add(falt);

                if (!estado) {
                    tthcontratodetalle cd = new tthcontratodetalle();
                 

                    tthfuncionariodetalle fun = TthFuncionarioDal.FindFuncionario(falt.cfuncionario);

                    cd = TthContratoDal.FindContratoFuncionario(falt.cfuncionario);
                    if (cd == null)
                    {
                        throw new AtlasException("TTH-024", "EL CONTRATO NO SE HA ENCONTRADO O YA SE HA INGRESADO LA FECHA DE DESVINCULACIÓN");

                    }
                    int diaSemana = (int)falt.ffalta.DayOfWeek;
                    tthhorariodetalle hr = ThumHorarioDal.Find(cd.chorario.Value, diaSemana.ToString());
                    if (hr == null) {

                    }
                    tthhorario hrg = ThumHorarioDal.Find(cd.chorario.Value);

                    int horasDiaras = hr.fjornadaint.Value - hr.ijornadaint.Value;
                    horasDiaras = horasDiaras / 100;
                    if (hrg.jornadaespecial==false) {
                        horasDiaras = horasDiaras - 1;
                    }

                    if (cd == null) {
                        throw new AtlasException("TTH-019", "NO SE HA DEFINIDO UN CONTRATO PARA EL FUNCIONARIO {0}", (fun.primernombre + " " + fun.primerapellido));

                    }

                    decimal total = falt.tretraso /(decimal) horasDiaras;
                    decimal totalcalculo = total;
                    total = decimal.Round(total, 2, MidpointRounding.AwayFromZero);


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
                    ob.cfuncionario = falt.cfuncionario;
                    ob.dias = -total;
                    decimal  vtotal= totalcalculo * (cd.remuneracion.Value/30);
                    vtotal = decimal.Round(vtotal, 2, MidpointRounding.AwayFromZero);

                    tgentransaccion trans=  TgentransaccionDal.Find(rm.Cmodulo, rm.Ctranoriginal);
                    ob.tipoccatalogo = 1162;
                    ob.tipocdetalle = "ASIS";
                    ob.comentario = "VALOR GENERADO EN " + trans.nombre + ": " + falt.observaciones;
                    ob.valor = -vtotal;
                    long cvacacion = Secuencia.GetProximovalor("SVACACION");
                    ob.csaldovacaciones = cvacacion;
                    if (ob.valor != 0)
                    {
                        salvacacion.Add(ob);
                    }
                }
                
            }
            rm.AdicionarTabla("tnomsaldovacaciones", salvacacion, false);
            rm.AdicionarTabla("tnomfalta", faltas, false);
            rm.Response["VALIDADO"] = true;
        }
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
