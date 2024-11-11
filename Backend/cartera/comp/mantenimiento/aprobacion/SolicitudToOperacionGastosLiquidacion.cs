using core.componente;
using dal.cartera;
using modelo;
using System.Collections.Generic;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.aprobacion {

    /// <summary>
    /// Clase que pasa los datos cargos de liquidacion de una solicitud de credito a cargos de liquidacion de una operacion de cartera.
    /// </summary>
    public class SolicitudToOperacionGastosLiquidacion : ComponenteMantenimiento {
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            List<tcarsolicitudgastosliquida> lsolicitudgastos = TcarSolicitudGastosLiquidaDal.Find(long.Parse(rqmantenimiento.Mdatos["csolicitud"].ToString()));

            // Transforma a gastos de la operacion.
            List<tcaroperaciongastosliquida> lcargos = TcarSolicitudGastosLiquidaDal.ToTcarSolicitudGastosLiquida(lsolicitudgastos, rqmantenimiento.Coperacion);
            if (lcargos.Count == 0) {
                return;
            }

            // Adiciona datos a Tabla para que haga el commit de los objetos al final.
            rqmantenimiento.AdicionarTabla(typeof(tcaroperaciongastosliquida).Name.ToUpper(), lcargos, false);
        }
    }
}
