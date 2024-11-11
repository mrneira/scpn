using core.componente;
using dal.contabilidad.conciliacionbancaria;
using dal.inversiones.inversiones;
using util.dto.consulta;
using System.Collections.Generic;

namespace inversiones.comp.consulta.inversiones
{
    /// <summary>
    /// Clase que encapsula los procedimientos funcionales para obtener las cuotas de las inversiones.
    /// </summary>
    class RentaFijaPagos : ComponenteConsulta
    {

        /// <summary>
        /// Obtener los dividendos de una inversión.
        /// </summary>
        /// <param name="rqconsulta">Request de consulta.</param>
        /// <returns></returns>
        public override void Ejecutar(RqConsulta rqconsulta)
        {

            IList<Dictionary<string, object>> lresp = new List<Dictionary<string, object>>();

            if (rqconsulta.Mdatos["pRentaVariable"].ToString().Trim() == "VAR")
            {
                lresp = TinvInversionDal.GetPagoRentaVariable(rqconsulta);
            }
            else
            {
                lresp = TinvInversionDal.GetCuotas(rqconsulta);
            }

            rqconsulta.Response["REGISTROCUOTAS"] = lresp;


        }
    }

}
