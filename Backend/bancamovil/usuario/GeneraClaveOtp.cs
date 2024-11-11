using core.componente;
using util.dto.mantenimiento;
using modelo;
using util;
using dal.bancaenlinea;
using dal.bancamovil;

namespace bancamovil.comp.usuario
{

    /// <summary>
    /// Clase que se encarga de completar el password temporal OTP de autenticacion movil.
    /// </summary>
    public class GeneraClaveOtp : ComponenteMantenimiento
    {

        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            string serial = rqmantenimiento.GetString("s");
            string cusuario = rqmantenimiento.GetString("u");

            tbansuscripcionmovil subscripcion = TbanSuscripcionMovilDal.Find(cusuario, serial);
            if (subscripcion == null) {
                throw new AtlasException("BMV-005", "NO EXISTE SUSCRIPCIÓN DEL USUARIO");
            }
            tbanusuarios tbanusuarios = TbanUsuariosDal.Find(cusuario);
            if (tbanusuarios == null) {
                throw new AtlasException("BMV-001", "USUARIO NO REGISTRADO EN BANCA EN LÍNEA");
            }
            if (tbanusuarios.estatuscusuariocdetalle.CompareTo("ACT") != 0) {
                //throw new AtlasException("BLI-009", "EL USUARIO DE BANCA EN LÍNEA NO ESTÁ ACTIVO");
            }
            tbanusuariootpmovil tbanusuariootpmovil = TbanUsuarioOtpMovilDal.Crear(cusuario, serial, ClaveTemporal.GetClave(), null);
            // adiciona clave temporal al request, para enviar al mail o sms.
            rqmantenimiento.AddDatos("claveotp", tbanusuariootpmovil.Mdatos["claveotp"]);
            rqmantenimiento.AddDatos("fcaducidadclaveotp", tbanusuariootpmovil.fcaducidad.GetValueOrDefault().ToString("yyyy-MM-dd HH:mm:ss"));
            rqmantenimiento.Response["validarotp"] = true;
        }

    }
}
