using core.componente;
using util.dto.mantenimiento;
using System.Threading;
using System.Globalization;
using modelo;
using System.Collections.Generic;
using Newtonsoft.Json;
using dal.tesoreria;
using tesoreria.enums;
using util.servicios.ef;
using modelo.helper;

namespace tesoreria.comp.mantenimiento.bce.transaccion
{
    /// <summary>
    /// Modifica rInformación Pago
    /// </summary>
    /// <param name="ltransaccion"></param>
    public class ModificarInformacionPago : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rm)
        {
            Thread.CurrentThread.CurrentCulture = new CultureInfo("es-PE");
            if (!rm.Mdatos.ContainsKey("MODIFICARPAGOS"))
            {
                return;
            }
            List<ttestransaccion> ldatos = JsonConvert.DeserializeObject<List<ttestransaccion>>(@rm.Mdatos["MODIFICARPAGOS"].ToString());
            List<ttestransaccion> lmodificados = new List<ttestransaccion>();

            foreach (ttestransaccion obj in ldatos)
            {
                if ((bool)obj.Actualizar)
                {
                    EntityHelper.SetActualizar(obj);
                    obj.cestado = ((int)EnumTesoreria.EstadoPagoBce.Registrado).ToString();
                    obj.codrespuestabce = null;
                    obj.numeroreferencia = null;
                    obj.numeroreferenciapago = null;
                    obj.numerocomprobantecesantia = null;
                    obj.ccomprobante = null;
                    obj.frespuesta = null;
                    obj.vrespuesta = null;
                    obj.referenciabce = null;
                    obj.modificado = true;
                    obj.Actualizar = true;
                    obj.Esnuevo = false;
                    lmodificados.Add(obj);
                }
            }
            rm.Mdatos["MODIFICARPAGOS"] = null;
            rm.Mtablas["MODIFICARPAGOS"] = null;
            rm.AdicionarTabla("ttestransaccion", lmodificados, false);
        }
    }
}
