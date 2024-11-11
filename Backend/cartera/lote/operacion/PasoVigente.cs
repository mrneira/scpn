using core.servicios.mantenimiento;
using dal.cartera;
using modelo;
using System.Collections.Generic;
using util;
using util.dto.interfaces.lote;
using util.dto.mantenimiento;

namespace cartera.lote.operacion
{
    /// <summary>
    /// Clase que se encarga de ejecutar paso a vigente de cartera en lotes.
    /// </summary>
    public class PasoVigente : ITareaOperacion {

        public void Ejecutar(RqMantenimiento rqmantenimiento, RequestOperacion requestoperacion) {
            PasoVigente.EjecutarTraslado(rqmantenimiento);
        }

        public static void EjecutarTraslado(RqMantenimiento rqmantenimiento)
        {
            // Ejecuta transaccion de cabio de estado de cuotas cartera 7-502
            // 1 indica que pasa a vencido la operacion, 0 pasa a vigente.
            rqmantenimiento.AddDatos("pasovencido", "0");
            tcarevento evento = TcarEventoDal.Find("TRASLADO-CARTERA");
            rqmantenimiento.Cmodulotranoriginal = (int)evento.cmodulo;
            rqmantenimiento.Ctranoriginal = (int)evento.ctransaccion;
            Mantenimiento.ProcesarAnidado(rqmantenimiento, evento.cmodulo ?? 0, evento.ctransaccion ?? 0);
        }


    }
}
