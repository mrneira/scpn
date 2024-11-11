using cartera.datos;
using core.componente;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.consulta;

namespace cartera.comp.consulta.saldos {

    /// <summary>
    /// Clase que se encarga de consultar saldos de cuotas que todavia no llegan a su fecha de vencimiento.
    /// </summary>
    /// <param name="rqconsulta"></param>
    public class SaldoPrecancelacion : ComponenteConsulta {

        /// <summary>
        /// Consulta el valor a pagar en una precancelacion de operaciones de cartera.
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta) {

            Operacion operacion = OperacionFachada.GetOperacion(rqconsulta);
            int fcobro = (int)rqconsulta.Fconatable;
            //operacion.CalcularMora(fcobro, rqconsulta.Mensaje, (int)operacion.tcaroperacion.csucursal, (int)operacion.tcaroperacion.ccompania);
            saldo.Saldo saldo = new saldo.Saldo(operacion, fcobro);
            saldo.Calculacuotaencurso();
            Decimal saldofuturo = saldo.GetSaldoCuotasfuturas();

            Dictionary<String, Object> m = new Dictionary<String, Object>();
            decimal totaldeuda = saldo.Totalpendientepago;
            if (saldo.Cxp > 0) {
                totaldeuda = totaldeuda - saldo.Cxp;
            }
            totaldeuda = totaldeuda + saldofuturo;
            if (totaldeuda < 0) {
                totaldeuda = 0;
            }
            m["saldo"] = totaldeuda;
            List<Dictionary<String, Object>> lresp = new List<Dictionary<String, Object>>();
            lresp.Add(m);
            // Fija la respuesta en el response.

            rqconsulta.Response["SALDO"] = lresp;

        }

    }
}
