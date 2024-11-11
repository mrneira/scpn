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
    /// Clase que se encarga de completar datos necesarios para generar tabla de pagos de cartera.
    /// </summary>
    public class DatosDesembolso : ComponenteMantenimiento {

        /// <summary>
        /// Objeto que contiene los datos de una operacion de cartera.
        /// </summary>
        private tcaroperacion tcaroperacion;

        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            ObtenerOperacion(rqmantenimiento);

            // manejo de historia de la operacion, el estatus se maneja en el registro vigente.
            TcarOperacionHistoriaDal.CreaHistoria(tcaroperacion, rqmantenimiento.Mensaje, rqmantenimiento.Fconatable);

            int? finiciopagos = rqmantenimiento.GetInt("finiciopagos");
            if (finiciopagos != null) {
                tcaroperacion.finiciopagos = finiciopagos;
            }
            if (tcaroperacion.fgeneraciontabla == null) {
                tcaroperacion.fgeneraciontabla = rqmantenimiento.Fconatable;
            }
            tcaroperacion.cestatus = EnumEstatus.VIGENTE.Cestatus;
            tcaroperacion.cusuariodesembolso = rqmantenimiento.Cusuario;
            tcaroperacion.fapertura = rqmantenimiento.Fconatable;

            // suma al monto el valor a financiar de gastos de liquidacion.
            ActualizaCargosLiquidacion();

            // El valor del anticipo solo aplica el monetario.
            tcaroperacion.monto = decimal.Add((decimal)tcaroperacion.monto, TcarSolicitudSegurosDal.ValorAnticipo((long)tcaroperacion.csolicitud, false));

            // fija el monto de del desembolso para grabar en la tabla TcarOperacionTransaccion, con el valor a deembolsar.
            rqmantenimiento.Monto = (decimal)tcaroperacion.monto;
        }

        /// <summary>
        /// Actualiza el monto del prestamo con el cual se genera la tabla de amortizacion, sumando al monto original los valores a financiar.
        /// </summary>
        private void ActualizaCargosLiquidacion()
        {
            decimal cargosfinanciar = Constantes.CERO;

            // Actualiza monto con el cual se genera la tabla de amortizacion suma los gastos de liquidacion no pagados.
            // Los gastos no pagados y que no se financian, se disminuye del valor a entregar al cliente.
            List<tcaroperaciongastosliquida> lcargos = TcarOperacionGastosLiquidaDal.Find(tcaroperacion.coperacion);
            foreach (tcaroperaciongastosliquida obj in lcargos) {
                if (obj.fpago != null) {
                    continue;
                }
                if ((bool)obj.financiar) {
                    cargosfinanciar = cargosfinanciar + (decimal)obj.monto;
                }
            }
            // El valor del descuento solo aplica el monetario.
            tcaroperacion.monto = tcaroperacion.monto + cargosfinanciar;
        }

        /// <summary>
        /// Obtien los datos de una operacion de cartera.
        /// </summary>
        /// <param name="rqmantenimiento">Datos de entrada utilizados en la ejecucion de una transaccion.</param>
        private void ObtenerOperacion(RqMantenimiento rqmantenimiento)
        {
            tcaroperacion = OperacionFachada.GetOperacion(rqmantenimiento).tcaroperacion;
        }
    }
}
