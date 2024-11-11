using core.componente;
using dal.prestaciones;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto;
using util.dto.consulta;

namespace prestaciones.comp.consulta.aportes {
    /// <summary>
    /// Clase que se encarga de consultar en la base y entregar la tabla de aportaciones Patronales que tiene un socio. 
    /// Aportes entrega en una List<Dictionary<String, Object>>
    /// </summary>
    class AportesPatronales :ComponenteConsulta {
        public override void Ejecutar(RqConsulta rqconsulta) {
            IList<Dictionary<string, object>> laportes = new List<Dictionary<string, object>>();
            IList<Dictionary<string, object>> lresp = new List<Dictionary<string, object>>();
            IList<Dictionary<string, object>> taportes = new List<Dictionary<string, object>>();
           
            long cpersona = long.Parse(rqconsulta.Mdatos["cpersona"].ToString());
            taportes = TpreAportesDal.GetTotalAportes(cpersona);
            laportes = TpreAportesDal.GetAportesPatronal(rqconsulta);
            ((List<Dictionary<string, object>>)lresp).AddRange(laportes);
            Response resp = rqconsulta.Response;
            resp["APORTES"] = lresp;
            resp["APORTE"] = taportes;
        }
    }
}
