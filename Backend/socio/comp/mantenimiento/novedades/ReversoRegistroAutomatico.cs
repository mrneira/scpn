using core.componente;
using dal.socio;
using util.dto.mantenimiento;

namespace socio.comp.mantenimiento.novedades {
    public class ReversoRegistroAutomatico : ComponenteMantenimientoReverso {
        /// <summary>
        /// Reverso de novedad automatica
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void EjecutarReverso(RqMantenimiento rqmantenimiento)
        {
            TsocNovedadesDal.Reversar(rqmantenimiento.Coperacion, rqmantenimiento.Mensajereverso);
        }

    }
}
