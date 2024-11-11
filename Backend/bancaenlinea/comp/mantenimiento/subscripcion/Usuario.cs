using core.componente;
using util.dto.mantenimiento;
using System.Linq;
using modelo;
using util;
using dal.persona;
using dal.bancaenlinea;

namespace bancaenlinea.comp.mantenimiento.subscripcion
{

    /// <summary>
    /// Clase que se encarga de crear un usuario en tbanusuario al momento de finalizar la subscripcion.
    /// </summary>
    public class Usuario : ComponenteMantenimiento
    {

        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {

            if (rqmantenimiento.GetTabla("TBANSUSCRIPCION") == null) {
                return;
            }

            tbansuscripcion subscripcion = (tbansuscripcion)rqmantenimiento.GetTabla("TBANSUSCRIPCION").Lregistros.ElementAt(0);

            // valida que el codigo de usuario no este utilizado.
            try {
                tbanusuarios tbanUsuarios = TbanUsuariosDal.Find(subscripcion.cusuario);
                if (tbanUsuarios != null) {
                    throw new AtlasException("BLI-001", "CÓDIGO DE USUARIO NO DISPONIBLE");
                }
            } catch (AtlasException e) {
                if (!e.Codigo.Equals("BBLI-001")) {
                    throw e;
                }
            }
            // El password no tiene que ser igual a la identificacion
            if (subscripcion.identificacion.CompareTo(subscripcion.password) == 0) {
                throw new AtlasException("BLI-008", "EL PASSWORD NO PUEDE SER IGUAL A LA IDENTIFICACIÓN");
            }
            string encriptado = EncriptarPassword.Encriptar(subscripcion.password);
            subscripcion.password = encriptado;
            TbanSuscripcionDal.ToTbanUsuarios(subscripcion, TperPersonaDetalleDal.Find(subscripcion.identificacion).cpersona);
        }

    }
}
