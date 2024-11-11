using core.componente;
using dal.generales;
using general.reporte;
using modelo;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;

namespace general.comp.mantenimiento.reporte
{
    public class EjecutaReporte : ComponenteMantenimiento
    {
        ReporteBase onjReporte = new ReporteBase();
        public override void Ejecutar(RqMantenimiento rm)
        {
            tgenparametros  UrlServidor = TgenParametrosDal.Find("SRV_RS", rm.Ccompania);
            tgenparametros User = TgenParametrosDal.Find("SRV_USER", rm.Ccompania);
            tgenparametrosseguridad Pass = TgenParametrosSeguridadDal.Find("SRV_PASS", rm.Ccompania);
            tgenparametros Dom = TgenParametrosDal.Find("SRV_DOM", rm.Ccompania);

            Dictionary <String, Object> Parametros = JsonConvert.DeserializeObject<Dictionary<string, object>>(rm.Mdatos["parametros"].ToString());
            Parametros.Add("urlServidor", UrlServidor.texto.ToString());
            Parametros.Add("user", User.texto.ToString());
            Parametros.Add("pass", EncriptarParametros.Desencriptar(Pass.texto.ToString()));
            Parametros.Add("dom", Dom.texto.ToString());
            rm.Response["reportebyte"] = onjReporte.ReporteByte(Parametros);

        }
    }
}
