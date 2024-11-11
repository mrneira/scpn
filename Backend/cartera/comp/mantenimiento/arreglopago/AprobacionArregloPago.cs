using core.componente;
using dal.cartera;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.arreglopago {

    /// <summary>
    /// Clase que se encarga de marcar como aprobada la precancelacion del arreglo de pagos.
    /// </summary>
    public class AprobacionArregloPago : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            String coperacion = rqmantenimiento.Coperacion;
            // Marca como pagado el arreglo de pagos.
            tcaroperacionarreglopago arreglo = TcarOperacionArregloPagoDal.Find(coperacion, "PAG");
            if (arreglo == null) {
                throw new AtlasException("CAR-0045", "OPERACIÓN NO TIENE UN ARREGLO DE PAGOS A APROBAR O NO HA REALIZADO EL PAGO MÍNIMO");
            }
            rqmantenimiento.AddDatos("TcarOperacionArregloPago", arreglo);
            arreglo.cestatus = "APR";
            arreglo.faprueba = rqmantenimiento.Fconatable;
            arreglo.cusuarioaprueba = rqmantenimiento.Cusuario;
        }

    }
}
