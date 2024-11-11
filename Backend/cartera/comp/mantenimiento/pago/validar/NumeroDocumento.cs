using core.componente;
using dal.cartera;
using modelo;
using System;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.pago.validar
{
    /// <summary>
    /// Clase que se encarga de ejecutar validaciones sobre el número de documento o recibo de pago
    /// </summary>
    public class NumeroDocumento : ComponenteMantenimiento
    {

        /// <summary>
        /// Validación de número de documento
        /// </summary>
        /// <param name="RqMantenimiento">Request de Mantenimiento</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            tcaroperaciontransaccion tran = TcarOperacionTransaccionDal.FindDocumento(rqmantenimiento.Coperacion, rqmantenimiento.Documento);

            if (tran != null)
            {
                throw new AtlasException("CAR-0049", "YA SE ENCUENTRA REGISTRADO NÚMERO DE DOCUMENTO: {0} - FECHA: {1} - MONTO: {2}", tran.documento, Fecha.GetFechaPresentacionAnioMesDia(tran.ftrabajo), Math.Round(tran.monto, 2, MidpointRounding.AwayFromZero));
            }
        }

    }
}
