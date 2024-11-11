using core.componente;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.consulta;
using modelo;
using dal.socio;
namespace socio.comp.consulta.historico {
    /// <summary>
    /// Clase que consulta el Historico de carrera actual
    /// </summary>
    public class Historico : ComponenteConsulta {
        public override void Ejecutar(RqConsulta rqconsulta) {
            if(rqconsulta.Mdatos["cpersona"] == null || rqconsulta.Mdatos["ccompania"] == null) {
                return;
            }

            long cpersona = long.Parse(rqconsulta.Mdatos["cpersona"].ToString());
            int ccompania = int.Parse(rqconsulta.Mdatos["ccompania"].ToString());
            tsoccesantiahistorico historicoactual = TsocCesantiaHistoricoDal.FindToConsulta(cpersona, ccompania);
            rqconsulta.Response["HISTORICOACTUAL"] = historicoactual;
        }
    }
}
