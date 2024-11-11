using core.componente;
using dal.talentohumano;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.consulta;

namespace prestaciones.comp.consulta.retenciones
{
    public class DatosSupa : ComponenteConsulta
    {
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            string identificacion = TthParametrosDal.GetValorTexto("SUPA-IDENTIFICACION", rqconsulta.Ccompania);
            string nombre = TthParametrosDal.GetValorTexto("SUPA-NOMBRE", rqconsulta.Ccompania);
            string ncuenta = TthParametrosDal.GetValorTexto("SUPA-NCUENTA", rqconsulta.Ccompania);
            int TCUENTAC = (int)TthParametrosDal.GetValorNumerico("SUPA-TCUENTAC", rqconsulta.Ccompania);
            string TCUENTAD = TthParametrosDal.GetValorTexto("SUPA-TCUENTAD", rqconsulta.Ccompania);
            int TBANCOC = (int)TthParametrosDal.GetValorNumerico("SUPA-TBANCOC", rqconsulta.Ccompania);
            string TBANCOD = TthParametrosDal.GetValorTexto("SUPA-TBANCOD", rqconsulta.Ccompania);
            rqconsulta.Response["identificacion"] = identificacion;
            rqconsulta.Response["beneficiario"] = nombre;
            rqconsulta.Response["cdetalletipocuenta"] = TCUENTAD;
            rqconsulta.Response["cuenta"] = ncuenta;
            rqconsulta.Response["cdetallebanco"] = TBANCOD;


        }
    }
}
