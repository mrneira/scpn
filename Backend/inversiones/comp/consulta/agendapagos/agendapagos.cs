using core.componente;
using System;
using System.Collections.Generic;
using util.dto.consulta;
using modelo;
using dal.inversiones.inversiones;
using dal.generales;
using modelo.helper;
using dal.inversiones.tablaamortizacion;
using util;
using System.Drawing;

namespace inversiones.comp.consulta.agendapagos
{
    /// <summary>
    /// Clase que encapsula los procedimientos funcionales para el agendamiento de pagos.
    /// </summary>
    public class agendapagos : ComponenteConsulta
    {

        /// <summary>
        /// Obtiene el agendamiento de pagos de las inversiones de renta fija.
        /// </summary>
        /// <param name="rqconsulta">Request de consulta.</param>
        /// <returns></returns>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            IList<Dictionary<string, object>> inver = TinvTablaAmortizacionDal.GetVencimientos();
            List<Evento> eventos = new List<Evento>();
            int cont = 0;


            foreach (var invdb in inver)
            {
                Evento even = new Evento();
                even.Mdatos.Add("fvencimiento", invdb["fvencimiento"]);


                even.title = invdb["fvencimiento"].ToString();

                even.id = cont++;
                even.start = new DateTime(Fecha.GetAnio(int.Parse(invdb["fvencimiento"].ToString())), 
                    Fecha.GetMes(int.Parse(invdb["fvencimiento"].ToString())), 
                    Fecha.GetDia(int.Parse(invdb["fvencimiento"].ToString())));
                even.end = even.start;


                Random r = new Random();
                Color myColor = Color.FromArgb(r.Next(0, 256), r.Next(0, 256), r.Next(0, 256));
                string hex = myColor.R.ToString("X2") + myColor.G.ToString("X2") + myColor.B.ToString("X2");


                even.allDay = true;
                eventos.Add(even);

            }

            rqconsulta.Response["EVENTOS"] = eventos;

        }

    }

    public class Evento : AbstractDto
    {
        public int id { get; set; }
        public string title { get; set; }
        public DateTime start { get; set; }
        public DateTime end { get; set; }
        public string color { get; set; }
        public bool allDay { get; set; }

    }


}
