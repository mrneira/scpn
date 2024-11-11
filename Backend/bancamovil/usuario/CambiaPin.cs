using core.componente;
using util.dto.mantenimiento;
using modelo;
using util;
using dal.bancamovil;
using System;
using util.servicios.ef;

namespace bancamovil.comp.usuario
{

    /// <summary>
    /// Clase que se encarga de validar el pin de seguridad.
    /// </summary>
    public class CambiaPin : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            string serial = rqmantenimiento.GetString("s");
            string cusuario = rqmantenimiento.Cusuario;
            string pin = rqmantenimiento.GetString("pin");
            string pinant = rqmantenimiento.GetString("pinant");

            tbanusuariootpmovil usuariootpmovil = TbanUsuarioOtpMovilDal.Find(cusuario, serial);
            if (usuariootpmovil == null)
            {
                throw new AtlasException("BMV-001", "USUARIO NO REGISTRADO EN BANCA EN LÍNEA");
            }
            if (pinant != null)
            {
                String pinantencript = EncriptarPassword.Encriptar(pinant);
                if (pinantencript.CompareTo(usuariootpmovil.pin) != 0)
                {
                    throw new AtlasException("BMV-009", "PIN ANTERIOR INVÁLIDO");
                }
            }
            if (pin != null)
            {
                String pinencript = EncriptarPassword.Encriptar(pin);
                usuariootpmovil.pin = pinencript;
            }
            Sessionef.Actualizar(usuariootpmovil);
        }
    }
}
