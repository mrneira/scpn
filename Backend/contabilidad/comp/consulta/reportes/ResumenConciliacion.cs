using core.componente;
using System.Collections.Generic;
using util.dto.consulta;
using dal.contabilidad.reportes;

namespace contabilidad.comp.consulta.reportes
{
    class ResumenConciliacion : ComponenteConsulta
    {

        public override void Ejecutar(RqConsulta rqconsulta)
        {

            IList<Dictionary<string, object>> lresp = new List<Dictionary<string, object>>();
            lresp = TconLibroMayorDal.GetLibroMayor(rqconsulta);
            rqconsulta.Response["RESUMENCONCILIACION"] = lresp;

        }

    }
}
