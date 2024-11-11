using core.componente;
using core.servicios.mantenimiento;
using dal.tesoreria;
using modelo;
using System.Collections.Generic;
using System.Linq;
using tesoreria.enums;
using util;
using util.dto;
using util.dto.mantenimiento;

namespace tesoreria.comp.mantenimiento.cashmanagement
{
    /// <summary>
    /// Permite afectar el estado del pago
    /// </summary>
    /// <param name="rm"></param>
    class AutorizarAplicacion : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rm)
        {
            Response resp = rm.Response;
            if (rm.GetTabla("AUTORIZARAPLICACION") == null)
            {
                return;
            }
            List<ttesrecaudacion> ldatos = rm.GetTabla("AUTORIZARAPLICACION").Lregistros.Cast<ttesrecaudacion>().ToList();
            int fcontable = int.Parse(rm.GetDatos("fcontable").ToString());
            foreach (ttesrecaudacion recauda in ldatos)
            {
                List<ttesrecaudaciondetalle> lcobros = TtesRecaudacionDetalleDal.FindByCodigoCabecera(recauda.crecaudacion, recauda.cestado);
                List<ttesretroalimentacion> lentregas = TtesRetroalimentacionDal.FindRetroalimentacionModulOperacion(recauda.cmodulo, recauda.ctransaccion, true);
                foreach (ttesretroalimentacion retro in lentregas)
                {
                    rm.AddDatos("RESPUESTACASH", lcobros);
                }
            }
        }
    }
}
