using bancaenlinea.enums;
using core.componente;
using core.servicios.mantenimiento;
using util.dto.mantenimiento;

namespace bancaenlinea.comp.mantenimiento.cartera {

    /// <summary>
    /// Clase que se encarga de validar los datos de simulacion.
    /// </summary>
    public class Simulacion : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            RqMantenimiento rq = (RqMantenimiento)rqmantenimiento.Clone();
            rq.Cusuario = (rq.Ccanal == EnumChannels.BLINEA.Cchannel) ? EnumUsers.BLINEA.Cuser : (rq.Ccanal == EnumChannels.BMOVIL.Cchannel ? rq.Cusuario = EnumUsers.BMOVIL.Cuser : rq.Cusuario);
            rq.Ccanal = "OFI";

            // Ejecuta transaccion de simulacion de cartera
            Mantenimiento.ProcesarAnidado(rq, 7, 97);
        }

    }
}
