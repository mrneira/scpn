using core.componente;
using util.dto.mantenimiento;
using modelo;
using util;
using System;
using System.Linq;

namespace bancaenlinea.comp.mantenimiento.subscripcion
{

    /// <summary>
    /// Clase que se encarga de validar la clave temporal OTP, ingresada en la subscripcion.
    /// </summary>
    public class ValidaClaveTemporal : ComponenteMantenimiento
    {

        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {

            if (rqmantenimiento.GetTabla("TBANSUSCRIPCION") == null) {
                return;
            }
            tbansuscripcion subscripcion = (tbansuscripcion)rqmantenimiento.GetTabla("TBANSUSCRIPCION").Lregistros.ElementAt(0);
            string claveotp = rqmantenimiento.GetString("claveotp");
            if (claveotp == null) {
                claveotp = "";
            }
            string encriptado = EncriptarPassword.Encriptar(claveotp);
            if (encriptado.CompareTo(subscripcion.passwordotp) != 0) {
                throw new AtlasException("BLI-005", "CLAVE INCORRECTA");
            }

            DateTime t = Fecha.GetFechaSistema();
            DateTime fotpini = subscripcion.fcreacionotp??DateTime.Now;
            DateTime fotpfin = subscripcion.fcaducidadotp ?? DateTime.Now;
            if (fotpini.CompareTo(t) > 0 || fotpfin.CompareTo(t) < 0) {
                throw new AtlasException("BLI-006", "CLAVE TEMPORAL EXPIRADA");
            }

        }
    }
}
