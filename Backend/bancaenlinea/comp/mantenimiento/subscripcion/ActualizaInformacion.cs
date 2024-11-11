using core.componente;
using util.dto.mantenimiento;
using System.Linq;
using modelo;
using util;
using dal.persona;
using util.servicios.ef;
using dal.bancaenlinea;
using modelo.helper;

namespace bancaenlinea.comp.mantenimiento.subscripcion
{

    /// <summary>
    /// Clase que se encarga de validar actualizar la informacion ingresada por el socio policia
    /// </summary>
    public class ActualizaInformacion : ComponenteMantenimiento
    {

        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            if (rqmantenimiento.GetTabla("TBANSUSCRIPCION") == null) {
                return;
            }
            tbansuscripcion subscripcion = (tbansuscripcion)rqmantenimiento.GetTabla("TBANSUSCRIPCION").Lregistros.ElementAt(0);
            if (!subscripcion.Mdatos.ContainsKey("confemail") || subscripcion.email.CompareTo(subscripcion.Mdatos["confemail"])!=0) {
                throw new AtlasException("BLI-012", "LA INFORMACI[ON DE EMAILS NO COINCIDEN");
            }
            // valida que la identificacion este asociada a la persona en la base de datos de personas.
            tperpersonadetalle p = TperPersonaDetalleDal.Find(subscripcion.identificacion);
            p.email = subscripcion.email;
            p.celular = subscripcion.Mdatos["celular"].ToString();
            Sessionef.Actualizar(p);
        }

    }
}
