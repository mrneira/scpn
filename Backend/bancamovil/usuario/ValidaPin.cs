using core.componente;
using util.dto.mantenimiento;
using modelo;
using util;
using dal.bancamovil;

namespace bancamovil.comp.usuario
{

    /// <summary>
    /// Clase que se encarga de validar el pin de seguridad.
    /// </summary>
    public class ValidaPin : ComponenteMantenimiento
    {

        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            string serial = rqmantenimiento.GetString("s");
            string cusuario = rqmantenimiento.Cusuario;
            string pin = rqmantenimiento.GetString("pin");

            tbanusuariootpmovil uotp = TbanUsuarioOtpMovilDal.Find(cusuario, serial);
            string encriptado = EncriptarPassword.Encriptar(pin);
            if (encriptado.CompareTo(uotp.pin) != 0) {
                throw new AtlasException("BMV-008", "PIN INVÁLIDO");
            }
        }
    }
}
