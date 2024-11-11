using cartera.datos;
using cartera.enums;
using cartera.saldo;
using core.componente;
using core.servicios.mantenimiento;
using dal.cartera;
using dal.persona;
using modelo;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.desembolso {

    /// <summary>
    /// Clase que se encarga que validar los datos de precancelacion por absorcion.
    /// </summary>
    public class ValidaAbsorcion : ComponenteMantenimiento {

        decimal montototal = 0;

        /// <summary>
        /// Metodo que realiza la validacion de datos para generar la precancelacion de las operaciones
        /// que seran pagadas por la nueva operacion
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            // Monto de operaciones a pagar
            decimal montoabsorcion = (decimal)(rqmantenimiento.GetDecimal("montoabsorcion") != null ? rqmantenimiento.GetDecimal("montoabsorcion") : 0);
            if (montoabsorcion == 0) {
                return;
            }

            //Operacion de cartera
            Operacion operacionnueva = OperacionFachada.GetOperacion(rqmantenimiento);

            IList<tcarsolicitudabsorcion> loperaciones = TcarSolicitudAbsorcionDal.Find((long)operacionnueva.tcaroperacion.csolicitud);
            foreach (tcarsolicitudabsorcion op in loperaciones) {
                Operacion operacion = OperacionFachada.GetOperacion(op.coperacion, true);

                // Operaciones canceladas
                if (operacion.tcaroperacion.cestatus.Equals(EnumEstatus.CANCELADA.Cestatus)) {
                    continue;
                }

                Saldo saldo = new Saldo(operacion, rqmantenimiento.Fconatable);
                saldo.Calculacuotaencurso();
                decimal montoanterior = saldo.Totalpendientepago + saldo.GetSaldoCuotasfuturas() - saldo.Cxp;
                montototal = montototal + montoanterior;

                // Ejecuta transaccion de precancelacion
                tcarevento evento = TcarEventoDal.Find(EnumEventos.PRECANCELACION_ABSORCION.Cevento);
                RqMantenimiento rq = (RqMantenimiento)rqmantenimiento.Clone();
                rq.EncerarRubros();
                rq.Monto = montoanterior;
                rq.Coperacion = op.coperacion;
                rq.Cambiartransaccion((int)evento.cmodulo, (int)evento.ctransaccion);
                Mantenimiento.ProcesarAnidado(rq, (int)evento.cmodulo, (int)evento.ctransaccion);
            }
        }

    }
}
