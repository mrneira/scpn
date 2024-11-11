using core.componente;
using System;
using modelo;
using dal.socio;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;

namespace prestaciones.comp.mantenimiento.expediente {
    class EstadoSocioLiq : ComponenteMantenimiento {
        IList<tsocnovedadades> lnovedadesAdd = new List<tsocnovedadades>();
        IList<tsocnovedadades> lnovedades = new List<tsocnovedadades>();
        tsocnovedadades nov = new tsocnovedadades();

        public override void Ejecutar(RqMantenimiento rm) {
            int cpersona = int.Parse(rm.Mdatos["cpersona"].ToString());
            string cdetalletipoexp = rm.Mdatos["cdetalletipoexp"].ToString();

            if (!cdetalletipoexp.Equals("ANT")) {
                tsoccesantia soc = TsocCesantiaDal.Find(cpersona, rm.Ccompania);
                soc.ccdetalletipoestado = "BLQ";
                rm.AdicionarTabla("tsoccesantia", soc, false);
                this.generarHistorialNovedades(rm);
            }
        }

        private void generarHistorialNovedades(RqMantenimiento rm) {
            int cpersona = int.Parse(rm.Mdatos["cpersona"].ToString());
            lnovedades = TsocNovedadesDal.FindToNovedades(cpersona, rm.Cagencia);
            foreach (tsocnovedadades n in lnovedades) {
                TsocNovedadadesHistoriaDal.CreaHistoria(n, rm.Fconatable);
                nov = TsocNovedadesDal.FindToNovedades((long)n.cpersona, (int)n.ccompania, n.cnovedad);
                nov.pagado = true;
                lnovedadesAdd.Add(nov);
                
            }

            rm.AdicionarTabla("tsocnovedades", lnovedadesAdd,false);
        }
    }
}
