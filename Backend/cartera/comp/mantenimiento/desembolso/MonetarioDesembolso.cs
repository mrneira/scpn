using cartera.comp.mantenimiento.util;
using cartera.datos;
using cartera.enums;
using core.componente;
using dal.cartera;
using modelo;
using System.Collections.Generic;
using util;
using util.dto.mantenimiento;
namespace cartera.comp.mantenimiento.desembolso {

    /// <summary>
    /// Clase que se encarga de ejecutar transaccion monetaria del desembolso de operaciones de credito.
    /// </summary>
    public class MonetarioDesembolso : ComponenteMantenimiento {
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            new MonetarioTablaPagos(rqmantenimiento, EnumEventos.DESEMBOLSO.Cevento);
        }
    }
}
