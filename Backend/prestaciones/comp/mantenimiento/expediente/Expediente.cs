using core.componente;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;
using util;
using modelo.interfaces;
using modelo;
using dal.prestaciones;
using core.servicios;

namespace prestaciones.comp.mantenimiento.expediente {
    class Expediente :ComponenteMantenimiento {
        /// <summary>
        /// Crea el expediente 
        /// </summary>
        /// <param name="rm"></param>
        public override void Ejecutar(RqMantenimiento rm) {
            if(rm.GetTabla("DATOSEXPEDIENTE") == null || rm.GetTabla("DATOSEXPEDIENTE").Lregistros.Count() <= 0) {
                return;
            }
            tpreexpediente obj = (tpreexpediente)rm.GetTabla("DATOSEXPEDIENTE").Lregistros.ElementAt(0);
            decimal total = decimal.Parse(rm.Mdatos["total"].ToString());
            decimal totalingresos = decimal.Parse(rm.Mdatos["totalingresos"].ToString());
            string cdetalletipoexp = rm.Mdatos["cdetalletipoexp"].ToString();
            string cdetallejerarquia = rm.Mdatos["cdetallejerarquia"].ToString();
            decimal valorsolicitado = decimal.Parse(rm.GetDatos("valorsolicitado").ToString());
            int? year = int.Parse(rm.Mdatos["year"].ToString());
            int totalaportes = int.Parse(rm.Mdatos["totalaportes"].ToString());
            bool rollback = (bool)rm.Mdatos["rollback"];
            tpresecuencialexpediente secuencialexpediente = TpreSecuencialExpedienteDal.FindSecuenciaToJerarquia(cdetallejerarquia, year);
            bool tiempomixto = false;
            long secuencia = rollback ? 1: Secuencia.GetProximovalor("EXPEDIENTE");

            //registra la fecha actual para creacion del registro
            if(obj.Esnuevo) {

                obj.fechainicio = rm.Freal;
                obj.secuencia = secuencia;
                //if(year >= 2019) {
                //    int length = 0;
                //    string slength = string.Empty;
                //    int? sec = TpreSecuencialExpedienteDal.GetSecuenciaToJerarquia(cdetallejerarquia, year);
                //    length = sec.ToString().Length;
                //    if(length == 1) {
                //        slength = "00";
                //    }
                //    if(length == 2) {
                //        slength = "0";
                //    }
                //    obj.cexpediente = slength + sec.ToString();
                //    secuencialexpediente.secuencia = sec;
                //    rm.AdicionarTabla("tpresecuencialexpediente", secuencialexpediente, false);
                //}
                if (obj.cexpediente != null) //MNE20240910
                {
                    if (rm.GetTabla("DATOSEXPEDIENTEASIGNACION") != null)
                    {
                        if (rm.GetTabla("DATOSEXPEDIENTEASIGNACION").Lregistros != null && rm.GetTabla("DATOSEXPEDIENTEASIGNACION").Lregistros.Count > 0)
                        {
                            tpreexpedienteasignacion objasig = (tpreexpedienteasignacion)rm.GetTabla("DATOSEXPEDIENTEASIGNACION").Lregistros.ElementAt(0);
                            obj.cexpediente = objasig.cexpediente;
                        }
                        else
                        {
                            throw new AtlasException("PRE-034", "NO SE PUEDE CREAR UN EXPEDIENTE, EL SOCIO: {0} NO TIENE UN EXPEDIENTE ASIGNADO.", obj.cpersona);
                        }
                    }
                    else if (rm.GetTabla("DATOSEXPEDIENTE") != null)
                    {
                        if (rm.GetTabla("DATOSEXPEDIENTE").Lregistros != null && rm.GetTabla("DATOSEXPEDIENTE").Lregistros.Count > 0)
                        {
                            tpreexpediente objexp = (tpreexpediente)rm.GetTabla("DATOSEXPEDIENTE").Lregistros.ElementAt(0);
                            obj.cexpediente = objexp.cexpediente;
                        }
                        else
                        {
                            throw new AtlasException("PRE-034", "NO SE PUEDE CREAR UN EXPEDIENTE, EL SOCIO: {0} NO TIENE UN EXPEDIENTE ASIGNADO.", obj.cpersona);
                        }
                    }
                    else
                    {
                        throw new AtlasException("PRE-034", "NO SE PUEDE OBTENER LOS DATOS PARA EL EXPEDIENTE, DEL SOCIO: {0}.", obj.cpersona);
                    }
                    //obj.cexpediente = cdetalletipoexp.Equals("ANT") ? obj.cexpediente : ((((string)obj.cexpediente).Contains("/20")) ? obj.cexpediente : obj.cexpediente + "/" + year.ToString());
                }//MNR 20231113
            }
            obj.ccompania = rm.Ccompania;
            obj.cusuarioing = rm.Cusuario;
            obj.fingreso = rm.Freal;
            obj.subtotal = totalingresos;
            obj.numaportaciones = totalaportes;
            obj.totalliquidacion = total;
            obj.totalsolicitado = valorsolicitado;
            tiempomixto = TpreTiempoMixto.AplicaTiempoMixto(obj.cpersona);
            obj.aplicatiempomixto = tiempomixto;
            obj.anticipo = (obj.cdetalletipoexp == "ANT") ? true : false;
            rm.AddDatos("anticipo", obj.anticipo);
            rm.AddDatos("valorsolicitado", valorsolicitado);
            rm.AddDatos("secuencia", obj.secuencia);

            rm.Response["EXPEDIENTE"] = obj;
        }
    }
}
