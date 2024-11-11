using core.componente;
using util.dto.mantenimiento;
using dal.seguridades;

namespace inversiones.comp.mantenimiento.migracion
{
    public class Inactivacion : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {

            TsegRolOpcionesDal.ActivarXCopcion(
                (string)rqmantenimiento.Mdatos["copcion"], 
                (bool)rqmantenimiento.Mdatos["mostrarmenu"],
                (bool)rqmantenimiento.Mdatos["activo"], 
                (string)rqmantenimiento.Cusuario);

            TsegRolOpcionesDal.ActivarXCopcionPadre(
                (string)rqmantenimiento.Mdatos["copcion"],
                (bool)rqmantenimiento.Mdatos["mostrarmenu"] ? 1 : 0,
                (bool)rqmantenimiento.Mdatos["activo"] ? 1 : 0,
                (string)rqmantenimiento.Cusuario);

        }
    }
}
