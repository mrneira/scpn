using core.componente;
using util.dto.mantenimiento;
using modelo;
using util;
using dal.bancamovil;
using dal.bancaenlinea;
using dal.persona;

namespace bancamovil.comp.usuario
{

    /// <summary>
    /// Clase que se encarga de validar el pin de seguridad.
    /// </summary>
    public class ValidaOlvidoPin : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            string serial = rqmantenimiento.GetString("s");
            string cusuario = rqmantenimiento.Cusuario;
            string password = (string)rqmantenimiento.GetDatos("p");
            password = EncriptarPassword.Encriptar(password);

            tbanusuarios tbanusuarios = TbanUsuariosDal.Find(cusuario);
            if (tbanusuarios == null)
            {
                throw new AtlasException("BMV-001", "USUARIO NO REGISTRADO EN BANCA EN LÍNEA");
            }
            // valida que la identificacion este asociada a la persona en la base de datos de personas.
            tperpersonadetalle p = TperPersonaDetalleDal.Find(tbanusuarios.cpersona ?? 0, rqmantenimiento.Ccompania);
            tbansuscripcion susban = TbanSuscripcionDal.FindPorIdentificacion(p.identificacion);
            if (susban != null && susban.estatuscusuariocdetalle.CompareTo("ACT") != 0)
            {
                throw new AtlasException("BLI-010", "LA SUSCRIPCIÓN DE BANCA EN LÍNEA ES INVÁLIDA");
            }
            if (tbanusuarios.estatuscusuariocdetalle.CompareTo("ACT") != 0)
            {
                throw new AtlasException("BLI-009", "EL USUARIO DE BANCA EN LÍNEA NO ESTÁ ACTIVO");
            }
            if (tbanusuarios.password.CompareTo(password) != 0)
            {
                throw new AtlasException("SEG-002", "CLAVE INCORRECTA");
            }
        }
    }
}
