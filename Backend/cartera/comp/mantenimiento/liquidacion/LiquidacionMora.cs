using cartera.enums;
using cartera.monetario;
using core.componente;
using core.servicios;
using core.servicios.mantenimiento;
using dal.cartera;
using dal.monetario;
using dal.persona;
using modelo;
using monetario.util;
using util;
using util.dto.mantenimiento;
using util.enums;
using util.thread;

namespace cartera.comp.mantenimiento.liquidacion {
    class LiquidacionMora : ComponenteMantenimiento {

        /// <summary>
        /// Metodo que registra el pago de cartera por liquidacion de mora
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento</param>
        public override void Ejecutar(RqMantenimiento rm)
        {
            // Control de precancelacion o pago extraordinario
            bool pagototal = (bool)rm.Mdatos["pagototal"];
            bool pagoextraordinario = (bool)rm.Mdatos["pagoextraordinario"];
            tperpersonadetalle regimen = TperPersonaDetalleDal.Find(rm.Cpersona, rm.Ccompania);

            if (regimen.regimen)
            {
                throw new AtlasException("COB-002", "NO SE PUEDE LIQUIDAR SOCIO CON REGIMEN ACTIVO");
            }
            if (pagototal) {
                EjecutaPagoPrecancelacion(rm);
            } else {
                EjecutaPago(rm, pagoextraordinario);
            }
        }

        /// <summary>
        /// Ejecuta transaccion de pago de cartera
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        /// <param name="pagoextraordinario">Tipo de pago.</param>
        private void EjecutaPago(RqMantenimiento rqmantenimiento, bool pagoextraordinario)
        {
            // Transaccion a ejecutar
            int ctransaccionpago = pagoextraordinario ? 58 : 57;

            // Ejecuta pago
            RqMantenimiento rq = (RqMantenimiento)rqmantenimiento.Clone();
            ThreadNegocio.GetDatos().Secuenciamonetario = Constantes.UNO;
            rq.Mensaje = Servicio.GetMensaje(rqmantenimiento.Cusuario);
            rq.Coperacion = rqmantenimiento.Coperacion;
            rq.Monto = rqmantenimiento.Monto;
            rq.Cmodulotranoriginal = EnumModulos.CARTERA.Cmodulo;
            rq.Ctranoriginal = ctransaccionpago;
            rq.Cambiartransaccion(EnumModulos.CARTERA.Cmodulo, ctransaccionpago);
            rq.EncerarRubros();
            Mantenimiento.ProcesarAnidado(rq, EnumModulos.CARTERA.Cmodulo, ctransaccionpago);

            // Ejecuta monetario
            this.EjecutaMonetario(rq);
        }

        /// <summary>
        /// Ejecuta transaccion de pago de precancelacion de cartera
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        private void EjecutaPagoPrecancelacion(RqMantenimiento rqmantenimiento)
        {
            // Transaccion a ejecutar
            int ctransaccionpago = 59;

            // Ejecuta pago
            RqMantenimiento rq = (RqMantenimiento)rqmantenimiento.Clone();
            ThreadNegocio.GetDatos().Secuenciamonetario = Constantes.UNO;
            rq.Mensaje = Servicio.GetMensaje(rqmantenimiento.Cusuario);
            rq.Coperacion = rqmantenimiento.Coperacion;
            rq.Monto = rqmantenimiento.Monto;
            rq.Cmodulotranoriginal = EnumModulos.CARTERA.Cmodulo;
            rq.Ctranoriginal = ctransaccionpago;
            rq.Cambiartransaccion(EnumModulos.CARTERA.Cmodulo, ctransaccionpago);
            rq.EncerarRubros();
            Mantenimiento.ProcesarAnidado(rq, EnumModulos.CARTERA.Cmodulo, ctransaccionpago);

            // Ejecuta monetario
            this.EjecutaMonetario(rq);
        }

        /// <summary>
        /// Adiciona rubros al request monetario.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se procesa la transaccion.</param>
        /// <param name="jerarquia">Tipo de jerarquia del socio.</param>
        private void EjecutaMonetario(RqMantenimiento rqmantenimiento)
        {
            // Ejecuta monetario
            string cevento = EnumEventos.COBRO_APORTES.Cevento;
            RqMantenimiento rqconta = (RqMantenimiento)rqmantenimiento.Clone();
            MonetarioHelper.FijaTransaccion(rqconta, cevento);
            rqconta.EncerarRubros();

            tcarevento evento = TcarEventoDal.Find(cevento);
            tmonrubro rubro = TmonRubroDal.FindPorSaldo(evento.cmodulo, evento.ctransaccion, rqmantenimiento.GetString("csaldo"));
            RqRubro rqrubro = new RqRubro(rubro.crubro, rqmantenimiento.Monto, rqmantenimiento.Cmoneda);
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
