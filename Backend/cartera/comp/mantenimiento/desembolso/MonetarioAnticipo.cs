using cartera.datos;
using cartera.enums;
using cartera.monetario;
using core.componente;
using dal.cartera;
using modelo;
using monetario.util;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.desembolso {

    /// <summary>
    /// Clase que se encarga de ejecutar contabilizacion de valores de anticipos de solicitudes.
    /// </summary>
    public class MonetarioAnticipo : ComponenteMantenimiento {

        /// <summary>
        /// Ejecuta transaccion monetaria de anticipos de solicitudes.
        /// </summary>
        /// <param name="rqmantenimiento">Datos con el que se ejecuta el monetario.</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            Operacion operacion = OperacionFachada.GetOperacion(rqmantenimiento);
            tcaroperacion tcaroperacion = operacion.tcaroperacion;

            decimal montoanticipo = TcarSolicitudSegurosDal.ValorAnticipo((long)tcaroperacion.csolicitud, true);
            if (montoanticipo <= Constantes.CERO) {
                return;
            }

            // Ejecuta monetario
            this.EjecutaMonetario(rqmantenimiento, montoanticipo);
        }

        /// <summary>
        /// Adiciona rubros al request monetario.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se procesa la transaccion.</param>
        /// <param name="monto">Valor del anticipo.</param>
        private void EjecutaMonetario(RqMantenimiento rqmantenimiento, decimal monto)
        {
            // Ejecuta monetario
            RqMantenimiento rqconta = (RqMantenimiento)rqmantenimiento.Clone();
            MonetarioHelper.FijaTransaccion(rqconta, EnumEventos.DESEMBOLSO_ANTICIPO.Cevento);
            rqconta.EncerarRubros();

            RqRubro rqrubro = new RqRubro(1, monto, rqmantenimiento.Cmoneda);
            rqrubro.Coperacion = rqmantenimiento.Coperacion;
            rqrubro.Actualizasaldo = false;
            rqconta.AdicionarRubro(rqrubro);

            // Ejecuta la transaccion monetaria anidada.
            if (rqconta.Rubros != null && !(rqconta.Rubros.Count < 1)) {
                new ComprobanteMonetario(rqconta);
            }
        }

    }
}
