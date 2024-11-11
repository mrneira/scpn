using core.componente;
using core.servicios.mantenimiento;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using util.dto.mantenimiento;

namespace tesoreria.comp.mantenimiento.cashmanagement
{
    class AplicaPagoCash : ComponenteMantenimiento
    {
        /// <summary>
        /// Metodo que ejecuta el pago de las operaciones de cash
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            List<ttesrecaudaciondetalle> lrecaudacion = (List<ttesrecaudaciondetalle>)rqmantenimiento.GetDatos("OPERACIONESCASH");
            if (lrecaudacion == null || lrecaudacion.Count() <= 0)
            {
                return;
            }

            foreach (ttesrecaudaciondetalle rec in lrecaudacion)
            {
            }
        }

        /// <summary>
        /// Ejecuta transaccion de pago de normal de cartera
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        /// <param name="coperacion">Numero de operacion de cartera.</param>
        /// <param name="valor">Valor de pago.</param>
        private void EjecutaPagoNormal(RqMantenimiento rqmantenimiento, string coperacion, decimal valor, string documento)
        {
            RqMantenimiento rq = (RqMantenimiento)rqmantenimiento.Clone();
            rq.Coperacion = coperacion;
            rq.Monto = valor;
            rq.Documento = documento;
            rq.Ctransaccion = 13;
            Mantenimiento.ProcesarAnidado(rq, 7, 13);
        }

        /// <summary>
        /// Ejecuta transaccion de pago de precancelacion de cartera
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        /// <param name="coperacion">Numero de operacion de cartera.</param>
        /// <param name="valor">Valor de pago.</param>
        private void EjecutaPagoPrecancelacion(RqMantenimiento rqmantenimiento, string coperacion, decimal valor, string documento)
        {
            RqMantenimiento rq = (RqMantenimiento)rqmantenimiento.Clone();
            rq.Coperacion = coperacion;
            rq.Monto = valor;
            rq.Documento = documento;
            rq.Ctransaccion = 14;
            Mantenimiento.ProcesarAnidado(rq, 7, 14);
        }
    }
}
