using util.dto.mantenimiento;
using dal.persona;
using dal.bancaenlinea;
using core.componente;
using util;
using dal.bancamovil;
using System.Collections.Generic;
using modelo;
using System.Linq;
using util.servicios.ef;

namespace bancamovil.comp.mantenimiento.subscripcion
{

    /// <summary>
    /// Clase que se encarga de validar la subscripcion en banca en linea, tambien valida que el usuario este activo
    /// </summary>
    public class ValidaUsuarioBancaLinea : ComponenteMantenimiento
    {

        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            string serial = rqmantenimiento.GetString("s");
            string numerocelular = rqmantenimiento.GetString("numt");
            string cusuario = rqmantenimiento.Cusuario;
            string password = (string)rqmantenimiento.GetDatos("p");
            password = EncriptarPassword.Encriptar(password);

            tbanusuarios tbanusuarios = TbanUsuariosDal.Find(cusuario);
            if (tbanusuarios == null) {
                throw new AtlasException("BMV-001", "USUARIO NO REGISTRADO EN BANCA EN LÍNEA");
            }
            // valida que la identificacion este asociada a la persona en la base de datos de personas.
            tperpersonadetalle p = TperPersonaDetalleDal.Find(tbanusuarios.cpersona ?? 0, rqmantenimiento.Ccompania);
            tbansuscripcion susban = TbanSuscripcionDal.FindPorIdentificacion(p.identificacion);
            if (susban!=null && susban.estatuscusuariocdetalle.CompareTo("ACT") != 0) {
                throw new AtlasException("BLI-010", "LA SUSCRIPCIÓN DE BANCA EN LÍNEA ES INVÁLIDA");
            }
            if (tbanusuarios.estatuscusuariocdetalle.CompareTo("ACT")!=0) {
                throw new AtlasException("BLI-009", "EL USUARIO DE BANCA EN LÍNEA NO ESTÁ ACTIVO");
            }
            if (tbanusuarios.password.CompareTo(password) != 0) {
                throw new AtlasException("SEG-002", "CLAVE INCORRECTA");
            }
            List<tbansuscripcionmovil> lsuscripmovil = TbanSuscripcionMovilDal.FindActivoPorUsuario(cusuario);
            if (lsuscripmovil == null || lsuscripmovil.Count > 0)
            {
                throw new AtlasException("BMV-003", "YA EXISTE UNA SUBSCRIPCIÓN ACTIVA");
            }

            if (p.celular==null || (p.celular.CompareTo(numerocelular)!=0)) {
                throw new AtlasException("BMV-004", "LOS DATOS NO COINCIDEN CON EL REGISTRADO");
            }

            tbansuscripcionmovil suscripcion = TbanSuscripcionMovilDal.Find(cusuario, serial);
            if (suscripcion == null) {
                suscripcion  = new tbansuscripcionmovil();
                suscripcion.cusuario = cusuario;
                suscripcion.Esnuevo = true;
            }
            suscripcion.serial = serial;
            suscripcion.celular = numerocelular;
            suscripcion.fingreso = Fecha.GetFechaSistema();
            suscripcion.cusuario = cusuario;
            suscripcion.estatuscusuarioccatalogo = 2901;
            suscripcion.estatuscusuariocdetalle = "VAL";

            if (suscripcion.Esnuevo) {
                rqmantenimiento.AdicionarTabla("TBANSUSCRIPCIONMOVIL", suscripcion, 0, false);
            }

            rqmantenimiento.AddDatos("TBANSUSCRIPCIONMOVIL", suscripcion);
        }

    }
}
