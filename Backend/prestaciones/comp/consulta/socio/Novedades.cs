using core.componente;
using dal.socio;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto;
using util.dto.consulta;

namespace prestaciones.comp.consulta.socio {
    /// <summary>
    /// Clase que se encarga de consultar en la base y entregar datos de las novedades del socio. 
    /// </summary>
    class Novedades :ComponenteConsulta {
        public override void Ejecutar(RqConsulta rqconsulta) {
            Response resp = rqconsulta.Response;
            long cpersona = (long)rqconsulta.Mdatos["cpersona"];
            IList<tsocnovedadades> lresp = new List<tsocnovedadades>();
            lresp = TsocNovedadesDal.FindToNovedades(cpersona, rqconsulta.Ccompania);
            resp["NOVEDADES"] = lresp;

        }
    }
}
