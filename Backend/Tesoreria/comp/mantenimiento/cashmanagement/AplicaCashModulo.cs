using core.componente;
using dal.tesoreria;
using modelo;
using System.Collections.Generic;
using System.Linq;
using tesoreria.enums;
using util.dto;
using util.dto.mantenimiento;

namespace tesoreria.comp.mantenimiento.cashmanagement
{
    /// <summary>
    /// Aplica Cash Modulo
    /// </summary>
    /// <param name="rm"></param>
    class AplicaCashModulo : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rm)
        {
            Response resp = rm.Response;
            if (rm.GetDatos("AUTORIZARAPLICACION") == null)
            {
                return;
            }
            List<ttesrecaudacion> ldatos = rm.GetTabla("AUTORIZARAPLICACION").Lregistros.Cast<ttesrecaudacion>().ToList();
            int fcontable = int.Parse(rm.GetDatos("fcontable").ToString());

            foreach (ttesrecaudacion recauda in ldatos)
            {
                List<ttesrecaudaciondetalle> lcobros = TtesRecaudacionDetalleDal.FindByCodigoCabecera(recauda.crecaudacion, recauda.cestado);
                if (recauda.cmodulo == 7)
                {
                    rm.AddDatos(string.Format("{0}-{1}", recauda.cmodulo, "94"), lcobros);
                }
                else
                {
                    rm.AddDatos(string.Format("{0}-{1}", recauda.cmodulo, recauda.ctransaccion), lcobros);
                }
            }
        }
    }
}
