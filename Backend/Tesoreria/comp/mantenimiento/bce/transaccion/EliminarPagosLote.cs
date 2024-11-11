using core.componente;
using util.dto.mantenimiento;
using System.Threading;
using System.Globalization;
using modelo;
using System.Collections.Generic;
using dal.tesoreria;
using tesoreria.enums;

namespace tesoreria.comp.mantenimiento.bce.transaccion
{
    /// <summary>
    /// Eliminar Pagos Lote
    /// </summary>
    /// <param name="ltransaccion"></param>
    public class EliminarPagosLote : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rm)
        {
            Thread.CurrentThread.CurrentCulture = new CultureInfo("es-PE");
            if (rm.GetDatos("observacion").ToString() == null || rm.GetDatos("numeroreferencia").ToString() == null || rm.GetDatos("tipotransaccion").ToString() == null)
            {
                return;
            }
            long numeroReferencia = (long)rm.Mdatos["numeroreferencia"];
            string observacion = (string)rm.Mdatos["observacion"];
            string tipotransaccion = (string)rm.Mdatos["tipotransaccion"];

            ttesenvioarchivo cabecera = TtesTransaccionDal.AnularCabeceraPagoLotePorReferencia(numeroReferencia, tipotransaccion);
            cabecera.estado= ((int)EnumTesoreria.EstadoPagoBce.Anulado).ToString();
            cabecera.observacion = observacion;
            cabecera.numeroreferencia = null;
            List<ttestransaccion> detalle= TtesTransaccionDal.AnularPagoLotePorReferencia(numeroReferencia, tipotransaccion);
            foreach (ttestransaccion tran in detalle)
            {
                tran.cestado = ((int)EnumTesoreria.EstadoPagoBce.Registrado).ToString();
                tran.numeroreferencia = null;
                tran.numeroreferenciapago = null;
            }
            rm.AdicionarTabla("ttesenvioarchivo", cabecera, false);
            rm.AdicionarTabla("ttestransaccion", detalle, false);
            rm.Mtablas["ELIMINARBCE"] = null;
        }
    }
}
