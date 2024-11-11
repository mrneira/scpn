using core.componente;
using dal.prestaciones;
using dal.socio;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.consulta;

namespace prestaciones.comp.consulta.expediente {
    class ActosServicios : ComponenteConsulta {
        /// <summary>
        /// Clase que realiza la carga de los tipo de baja de actos de servicio
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta) {
            int ctipobaja = int.Parse(rqconsulta.Mdatos["ctipobaja"].ToString());
            IList<Dictionary<string, object>> ldatos = TpreActosServicioDal.FindToAll();
            IList<tsoctipobaja> ltipobaja = new List<tsoctipobaja>();
            //Actos del servicio

            foreach (Dictionary<string, object> datos in ldatos) {
                ctipobaja = int.Parse(datos["ctipobaja"].ToString());
                tsoctipobaja tipobaja = TsocTipoBajaDal.Find(ctipobaja);
                ltipobaja.Add(tipobaja);
            }

            rqconsulta.Response["TIPoBAJA"] = ltipobaja;
        }
    }
}
