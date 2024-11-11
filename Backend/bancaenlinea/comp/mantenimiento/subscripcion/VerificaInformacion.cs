using core.componente;
using util.dto.mantenimiento;
using System.Linq;
using modelo;
using util;
using dal.persona;
using util.servicios.ef;
using dal.bancaenlinea;

namespace bancaenlinea.comp.mantenimiento.subscripcion
{

    /// <summary>
    /// Clase que se encarga de validar que la cedula con la que se intenta realizar una subscripcion a banca en linea esta definida en la base de datos de personas.
    /// </summary>
    public class VerificaInformacion : ComponenteMantenimiento
    {

        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            tbansuscripcion tbanSuscripcionBase = null;
            if (rqmantenimiento.GetTabla("TBANSUSCRIPCION") == null) {
                return;
            }
            tbansuscripcion subscripcion = (tbansuscripcion)rqmantenimiento.GetTabla("TBANSUSCRIPCION").Lregistros.ElementAt(0);
            if (subscripcion == null) {
                return;
            }

            // valida que la identificacion no tenga definido un codigo de usuario.
            try {
                tbanSuscripcionBase = TbanSuscripcionDal.FindPorIdentificacion(subscripcion.identificacion);
                if (tbanSuscripcionBase != null && tbanSuscripcionBase.cusuario != null) {
                    throw new AtlasException("BLI-003", "CLIENTE YA TIENE REGISTRADO UN USUARIO");
                }
            } catch (AtlasException e) {
                if (!e.Codigo.Equals("BBLI-001")) {
                    throw e;
                }
            }

            // valida que la identificacion este asociada a la persona en la base de datos de personas.
            tperpersonadetalle p = TperPersonaDetalleDal.Find(subscripcion.identificacion);
            if (p == null) {
                throw new AtlasException("BLI-002", "IDENTIFICACIÓN NO ES VALIDA");
            }
            if (p.csocio==null || p.csocio==0) {
                throw new AtlasException("BLI-011", "LA INFORMACIÓN REGISTRADA NO CORRESPONDEN A LA DE UN SOCIO");
            }
            if (p.email.ToUpper().CompareTo(subscripcion.email.ToUpper()) != 0) {
                throw new AtlasException("BLI-004", "INFORMACIÓN INCORRECTA");
            }

            if (tbanSuscripcionBase != null && tbanSuscripcionBase.cusuario == null) {
                Sessionef.Eliminar(tbanSuscripcionBase);
            }

            if (subscripcion.fingreso == null) {
                subscripcion.fingreso = Fecha.GetFechaSistema();
            }
        }

    }
}
