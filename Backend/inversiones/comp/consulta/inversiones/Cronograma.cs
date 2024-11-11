using core.componente;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.consulta;
using dal.inversiones;
using modelo;
using dal.inversiones.inversiones;
using dal.generales;
using modelo.helper;
using dal.inversiones.tablaamortizacion;
using util;
using System.Drawing;

namespace inversiones.comp.consulta.inversiones
{
    /// <summary>
    /// Clase que encapsula los procedimientos funcionales para generar el cronograma de pagos.
    /// </summary>
    public class Cronograma : ComponenteConsulta
    {
        /// <summary>
        /// Obtiene el cronograma de pagos de las inversiones de renta fija.
        /// </summary>
        /// <param name="rqconsulta">Request de consulta.</param>
        /// <returns></returns>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            IList<tinvtablaamortizacion> inver = TinvTablaAmortizacionDal.FindEstado();
            List<Evento> eventos = new List<Evento>();
            int cont = 0;
            foreach (tinvtablaamortizacion invdb in inver) {

                tinvinversion inv = TinvInversionDal.Find(invdb.cinversion.Value);
                Evento even = new Evento();

                even.Mdatos.Add("ncinversion", inv.cinversion);


                even.Mdatos.Add("ninstrumento",
                TgenCatalogoDetalleDal.Find(inv.instrumentoccatalogo.Value, inv.instrumentocdetalle).nombre);
                even.Mdatos.Add("nemisor",
                TgenCatalogoDetalleDal.Find(inv.emisorccatalogo.Value, inv.emisorcdetalle).nombre);
                decimal cap = (invdb.proyeccioncapital == null) ? 0 : invdb.proyeccioncapital.Value;
                cap = decimal.Round(cap, 2, MidpointRounding.AwayFromZero);

                even.Mdatos.Add("ncapital", cap);
                decimal proyeccioninteres = (invdb.proyeccioninteres == null) ? 0 : invdb.proyeccioninteres.Value;
                proyeccioninteres = decimal.Round(proyeccioninteres, 2, MidpointRounding.AwayFromZero);
                even.Mdatos.Add("ninteres", proyeccioninteres);

                decimal valormora = (invdb.valormora == null) ? 0 : invdb.valormora.Value;
                valormora = decimal.Round(valormora, 2, MidpointRounding.AwayFromZero);
                even.Mdatos.Add("nmora", valormora);
                decimal total = cap + proyeccioninteres + valormora;
                total = decimal.Round(total, 2, MidpointRounding.AwayFromZero);
                even.Mdatos.Add("ntotal", total );

                even.title = even.GetString("nemisor") + " - " + even.GetString("ninstrumento");
                even.id = cont++;

                even.start = new DateTime(Fecha.GetAnio(invdb.fvencimiento), 
                    Fecha.GetMes(invdb.fvencimiento), Fecha.GetDia(invdb.fvencimiento));
                even.end = even.start;
                Random r = new Random();
                Color myColor = Color.FromArgb(r.Next(0, 256), r.Next(0, 256), r.Next(0, 256));
                string hex = myColor.R.ToString("X2") + myColor.G.ToString("X2") + myColor.B.ToString("X2");
              //  even.color = hex;
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
