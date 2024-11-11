using core.componente;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.consulta;
using dal.talentohumano;

namespace talentohumano.comp.consulta.reportes
{
    public class MapaFuncionarios : ComponenteConsulta
    {

        /// <summary>
        /// Metodo que entrega la plantilla a consultar.
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            
                int cont = 0;
                IList<tthfuncionariodetalle> fun = TthFuncionarioDal.Find(rqconsulta.Ccompania);
                List<Marker> marcadores = new List<Marker>();

            foreach (tthfuncionariodetalle funcionario in fun) {
                if (funcionario.latituddireccion != null && funcionario.longituddireccion !=null) { 

                    Marker mar = new Marker();
                mar.id = cont++;
                mar.title = funcionario.primernombre + " " + funcionario.primerapellido;
                myLatLng posi = new myLatLng();
                posi.lat = decimal.Parse(funcionario.latituddireccion.ToString());
                posi.lng = decimal.Parse(funcionario.longituddireccion.ToString());
                mar.position = posi;

               
                marcadores.Add(mar);
            }
        }
                rqconsulta.Response["MARCADORES"] = marcadores;
                }
           
    
        //Clase Google Maps Marker
        public class Marker {
            public int id { get; set; }
            public String title { get; set; }
            public myLatLng position { get; set; }
            public MarkerImage icon { get; set; }
        }
        public class myLatLng {
            public decimal lat { get; set; }
            public decimal lng { get; set; }
        }
        public class MarkerImage
        {
            public string url { get; set; }
            public Size size { get; set; }
            public Point origin { get; set; }
            public Point anchor { get; set; }
            public Size scaledSize { get; set; }
        }
        public class Size
        {
            public decimal width { get; set; }
            public decimal height { get; set; }
          public  Size(decimal _width, decimal _height) {
                this.height = _height;
                this.width = _width;
            }

        }
        public class Point
        {
            public decimal x { get; set; }
            public decimal y { get; set; }
            public Point(decimal _x, decimal _y)
            {
                this.x = _x;
                this.y = _y;
            }
        }
    }
}