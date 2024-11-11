using core.componente;
using util.dto.mantenimiento;
using modelo;
using util;
using System;
using dal.bancamovil;

namespace bancamovil.comp.mantenimiento.subscripcion {

    /// <summary>
    /// Clase que se encarga de validar la clave temporal OTP, ingresada en la subscripcion.
    /// </summary>
    public class ValidaClaveTemporal : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            string serial = rqmantenimiento.GetString("s");
            string cusuario = rqmantenimiento.Cusuario;

            tbansuscripcionmovil subscripcion = null;
            if (rqmantenimiento.GetDatos("TBANSUSCRIPCIONMOVIL") != null) {
                subscripcion = (tbansuscripcionmovil)rqmantenimiento.GetDatos("TBANSUSCRIPCIONMOVIL");
            }
            if (subscripcion == null) {
                subscripcion = TbanSuscripcionMovilDal.Find(cusuario, serial);
            }
            if (subscripcion == null) {
                throw new AtlasException("BMV-005", "NO EXISTE SUSCRIPCIÓN DEL USUARIO");
            }
            string claveotp = rqmantenimiento.GetString("claveotp");
            if (claveotp == null) {
                claveotp = "";
            }
            string encriptado = EncriptarPassword.Encriptar(claveotp);
            if (encriptado.CompareTo(subscripcion.passwordotp) != 0) {
                throw new AtlasException("BMV-006", "CLAVE OTP INCORRECTA");
            }

            DateTime t = Fecha.GetFechaSistema();
            DateTime fotpini = subscripcion.fcreacionotp ?? DateTime.Now;
            DateTime fotpfin = subscripcion.fcaducidadotp ?? DateTime.Now;
            if (fotpini.CompareTo(t) > 0 || fotpfin.CompareTo(t) < 0) {
                throw new AtlasException("BMV-007", "CLAVE OTP EXPIRADA");
            }
        }
    }
}
