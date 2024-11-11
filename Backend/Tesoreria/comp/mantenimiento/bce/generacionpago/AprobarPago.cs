using core.componente;
using modelo;
using System.Collections.Generic;
using util.dto.mantenimiento;
using System.Threading;
using System.Globalization;
using Newtonsoft.Json;
using tesoreria.enums;
using modelo.helper;

namespace tesoreria.comp.mantenimiento.bce.aprobacionpago
{
    public class AprobarPago : ComponenteMantenimiento
    {
        /// <summary>
        /// Aprobar pago spi.
        /// </summary>
        /// <param name="rm">Request del mantenimiento</param>
        public override void Ejecutar(RqMantenimiento rm)
        {
            List<ttestransaccion> lTransaccion = new List<ttestransaccion>();
            Thread.CurrentThread.CurrentCulture = new CultureInfo("es-PE");
            if (rm.GetDatos("aprobar") == null)
            {
                return;
            }
            if ((bool)rm.GetDatos("aprobar"))
            {
                if (rm.GetDatos("APROBARPAGOS") == null)
                {
                    return;
                }
                List<ttestransaccion> ldatos = JsonConvert.DeserializeObject<List<ttestransaccion>>(@rm.Mdatos["APROBARPAGOS"].ToString());

                foreach (ttestransaccion obj in ldatos)
                {
                    if ((bool)obj.Mdatos["aprobar"])
                    {
                        EntityHelper.SetActualizar(obj);
                        obj.Actualizar = true;
                        obj.cestado = ((int)EnumTesoreria.EstadoPagoBce.Aprobar).ToString();
                    }
                }

                rm.AdicionarTabla("ttestransaccion", ldatos, false);

                rm.Mtablas["APROBARPAGOS"] = null;
            }
        }
    }
}
