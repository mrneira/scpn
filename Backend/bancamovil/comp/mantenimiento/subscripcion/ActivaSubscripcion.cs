using core.componente;
using util.dto.mantenimiento;
using System.Linq;
using modelo;
using util;
using dal.persona;
using dal.bancaenlinea;
using System.Collections.Generic;
using dal.bancamovil;
using util.servicios.ef;

namespace bancamovil.comp.mantenimiento.subscripcion
{

    /// <summary>
    /// Clase que se encarga de crear un usuario en tbanusuario al momento de finalizar la subscripcion.
    /// </summary>
    public class ActivaSubscripcion : ComponenteMantenimiento
    {

        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            string serial = rqmantenimiento.GetString("s");
            string cusuario = rqmantenimiento.Cusuario;
            string nombrecelular = rqmantenimiento.GetString("nomt");
            string pin = rqmantenimiento.GetString("pin");

            tbansuscripcionmovil subscripcion = null;
            if (rqmantenimiento.GetDatos("TBANSUSCRIPCIONMOVIL") != null) {
                subscripcion = (tbansuscripcionmovil)rqmantenimiento.GetDatos("TBANSUSCRIPCIONMOVIL");
            }
            if (subscripcion == null) {
                subscripcion = TbanSuscripcionMovilDal.Find(cusuario, serial);
            }

            subscripcion.estatuscusuariocdetalle = "ACT";
            subscripcion.nombrecelular = nombrecelular;
            Sessionef.Actualizar(subscripcion);

            tbanusuariootpmovil obj = TbanUsuarioOtpMovilDal.Crear(cusuario, serial==null?"": serial, "", pin);
        }

    }
}
