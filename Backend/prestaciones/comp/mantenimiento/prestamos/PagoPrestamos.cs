using cartera.enums;
using cartera.monetario;
using core.componente;
using core.servicios;
using core.servicios.mantenimiento;
using monetario.util;
using util;
using util.dto.mantenimiento;
using util.enums;
using util.thread;

namespace prestaciones.comp.mantenimiento.prestamos {
    class PagoPrestamos : ComponenteMantenimiento {
        public override void Ejecutar(RqMantenimiento rm) {
            // Control de precancelacion o pago extraordinario
            bool pagototal = (bool)rm.Mdatos["pagototal"];
            bool pagoextraordinario = (bool)rm.Mdatos["pagoextraordinario"];
            string jerarquia = rm.GetString("cjerarquia");
            string coperacion = rm.Coperacion;

            int tiponovedad = jerarquia.Equals("CLA") ? 16 : 18;
            rm.AddDatos("tiponovedad", tiponovedad);
            rm.AddDatos("fechaoficio", rm.Freal);

            if (pagototal) {
                EjecutaPagoPrecancelacion(rm, jerarquia);
            } else {
                EjecutaPago(rm, jerarquia, pagoextraordinario);
            }

        }

        /// <summary>
        /// Ejecuta transaccion de pago de cartera
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        /// <param name="jerarquia">Tipo de jerarquia del socio.</param>
        private void EjecutaPago(RqMantenimiento rqmantenimiento, string jerarquia, bool pagoextraordinario) {
            // Transaccion a ejecutar
            int ctransaccionpago = pagoextraordinario ? 9 : 8;

            // Ejecuta pago
            RqMantenimiento rq = (RqMantenimiento)rqmantenimiento.Clone();
            ThreadNegocio.GetDatos().Secuenciamonetario = Constantes.UNO;
            rq.Mensaje = Servicio.GetMensaje(rqmantenimiento.Cusuario);
            rq.Coperacion = rqmantenimiento.Coperacion;
            rq.Monto = rqmantenimiento.Monto;
            rq.Cmodulotranoriginal = EnumModulos.CARTERA.Cmodulo;
            rq.Ctranoriginal = ctransaccionpago;
            rq.Cambiartransaccion(EnumModulos.CARTERA.Cmodulo, ctransaccionpago);
            Mantenimiento.ProcesarAnidado(rq, EnumModulos.CARTERA.Cmodulo, ctransaccionpago);

            // Ejecuta monetario
            this.EjecutaMonetario(rq, jerarquia);
        }

        /// <summary>
        /// Ejecuta transaccion de pago de precancelacion de cartera
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        /// <param name="jerarquia">Tipo de jerarquia del socio.</param>
        private void EjecutaPagoPrecancelacion(RqMantenimiento rqmantenimiento, string jerarquia) {
            // Transaccion a ejecutar
            int ctransaccionpago = 10;

            // Ejecuta pago
            RqMantenimiento rq = (RqMantenimiento)rqmantenimiento.Clone();
            ThreadNegocio.GetDatos().Secuenciamonetario = Constantes.UNO;
            rq.Mensaje = Servicio.GetMensaje(rqmantenimiento.Cusuario);
            rq.Coperacion = rqmantenimiento.Coperacion;
            rq.Monto = rqmantenimiento.Monto;
            rq.Cmodulotranoriginal = EnumModulos.CARTERA.Cmodulo;
            rq.Ctranoriginal = ctransaccionpago;
            rq.Cambiartransaccion(EnumModulos.CARTERA.Cmodulo, ctransaccionpago);
            Mantenimiento.ProcesarAnidado(rq, EnumModulos.CARTERA.Cmodulo, ctransaccionpago);

            // Ejecuta monetario
            this.EjecutaMonetario(rq, jerarquia);
        }

        /// <summary>
        /// Adiciona rubros al request monetario.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se procesa la transaccion.</param>
        /// <param name="jerarquia">Tipo de jerarquia del socio.</param>
        private void EjecutaMonetario(RqMantenimiento rqmantenimiento, string jerarquia) {
            // Ejecuta monetario
            RqMantenimiento rqconta = (RqMantenimiento)rqmantenimiento.Clone();
            MonetarioHelper.FijaTransaccion(rqconta, EnumEventos.COBRO_APORTES.Cevento);
            rqconta.EncerarRubros();

            int numrubro = jerarquia.Equals("CLA") ? 1 : 2;

            RqRubro rqrubro = new RqRubro(numrubro, rqmantenimiento.Monto, rqmantenimiento.Cmoneda);
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
