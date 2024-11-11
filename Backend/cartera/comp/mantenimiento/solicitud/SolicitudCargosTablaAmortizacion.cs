using cartera.datos;
using cartera.enums;
using core.componente;
using dal.cartera;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.solicitud {

    /// <summary>
    /// Clase que se encarga de adicionar seguros seguros fijos que se cobran por cuota a una solicitud de credito.
    /// </summary>
    public class SolicitudCargosTablaAmortizacion : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            Solicitud solicitud = SolicitudFachada.GetSolicitud();
            tcarsolicitud tcarSolicitud = solicitud.Tcarsolicitud;

            List<tcarsolicitudcargostabla> lcargostabla = TcarSolicitudCargosTablaDal.Find(tcarSolicitud.csolicitud);

            if (lcargostabla == null || lcargostabla.Count == 0) {
                if (rqmantenimiento.GetTabla("TCARSOLICITUDCARGOSTABLA") != null && rqmantenimiento.GetTabla("TCARSOLICITUDCARGOSTABLA").Lregistros.Count > 0) {
                    lcargostabla = rqmantenimiento.GetTabla("TCARSOLICITUDCARGOSTABLA").Lregistros.Cast<tcarsolicitudcargostabla>().ToList();
                    this.CompletaPk(rqmantenimiento, lcargostabla, tcarSolicitud.csolicitud);
                } else {
                    lcargostabla = TcarSolicitudCargosTablaDal.CrearDeudor(tcarSolicitud);
                    rqmantenimiento.AdicionarTabla("TCARSOLICITUDCARGOSTABLA", lcargostabla, false);
                }
            }

            // fija cargos en la solicitud para generar la tabla de amortizacion
            if (!tcarSolicitud.cestadooperacion.Equals(EnumEstadoOperacion.ORIGINAL.CestadoOperacion)) {
                Dictionary<String, Decimal> mcargos = new Dictionary<string, decimal>();
                foreach (tcarsolicitudcargostabla cargo in lcargostabla) {
                    mcargos[cargo.csaldo] = (decimal)cargo.monto;
                }
                rqmantenimiento.AddDatos("MSALDOS-ARREGLO-PAGOS-TABLA", mcargos);
            } else {
                solicitud.Lcargostabla = (lcargostabla);
            }
        }


        /// <summary>
        /// Completa el pk de la solicitud.
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento con el que se ejecuta la transaccion.</param>
        /// <param name="lcargostabla">Listado de cargos de tabla.</param>
        /// <param name="csolicitud">Codigo de la solicitud.</param>
        private void CompletaPk(RqMantenimiento rqmantenimiento, List<tcarsolicitudcargostabla> lcargostabla, long csolicitud)
        {
            foreach (tcarsolicitudcargostabla cargo in lcargostabla) {
                cargo.csolicitud = csolicitud;
            }
        }
    }

}
