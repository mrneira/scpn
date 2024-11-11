using cartera.datos;
using cartera.saldo;
using core.servicios.mantenimiento;
using dal.cartera;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.interfaces.lote;
using util.dto.mantenimiento;

namespace cartera.lote.operacion
{

    /// <summary>
    /// Clase que se encarga del cobro de cuotas cuya fecha de vencimiento es menor a la proxima fecha contable en la que se ejecuta el lote.
    /// </summary>
    public class CobroCuotas : ITareaOperacion
    {

        /// <summary>
        /// Ejecuta el cobro de cartera.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="requestoperacion"></param>
        public void Ejecutar(RqMantenimiento rqmantenimiento, RequestOperacion requestoperacion)
        {
            Operacion operacion = OperacionFachada.GetOperacion(rqmantenimiento);
            Saldo saldo = new Saldo(operacion, (int)requestoperacion.Fconatble);
            decimal adeudado = saldo.Totalpendientepago;
            decimal valorpagado = 0;
            if (adeudado <= 0)
            {
                return;
            }
            int fcobro = (int)requestoperacion.Fconatble;
            // Ejecuta transaccion de cobro de cuotas cartera 7-500
            tcarevento evento = TcarEventoDal.Find("COBRO-BATCH");
            rqmantenimiento.Cmodulotranoriginal = (int)evento.cmodulo;
            rqmantenimiento.Ctranoriginal = (int)evento.ctransaccion;

            Operacioncxp cxp = new Operacioncxp(operacion.Tcaroperacion);
            decimal valorcxp = cxp.BuscamontoDebita(rqmantenimiento, adeudado);
            valorpagado = valorcxp;

            // si existe un valor a pagar se ejecuta la transaccion de cobro de prestamo.
            if (valorpagado > 0)
            {
                // Si existe un saldo que no se aplique a la operacion se va a CXP de la operacion de cartera.
                rqmantenimiento.Monto = valorpagado;


                Mantenimiento.ProcesarAnidado(rqmantenimiento, (int)evento.cmodulo, (int)evento.ctransaccion);
            }
            // Retorno a vigente si paga completo y no tiene cuotas pendientes de pago.
            this.RetornoVigente(rqmantenimiento, operacion, fcobro);
            //util.thread.ThreadNegocio.GetDatos().validarEcuacionContable();
        }

        private void RetornoVigente(RqMantenimiento rqmantenimiento, Operacion operacion, int fcobro)
        {
            PasoVigente.EjecutarTraslado(rqmantenimiento);
        }

    }
}
