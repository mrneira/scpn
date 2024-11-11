using cartera.datos;
using cartera.saldo;
using core.componente;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.consulta;

namespace cartera.comp.consulta.saldos {

    /// <summary>
    /// Clase que se encarga de consultar saldos de cuotas que llegaron a su fecha de vencimiento mas valores de saldos tipo ACC a la fecha.
    /// </summary>
    public class SaldoAlaFecha : ComponenteConsulta {

        /// <summary>
        /// Entrea el saldo adeudado a hoy mas el capital futuro.
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta) {
            Operacion operacion = OperacionFachada.GetOperacion(rqconsulta);
            int fcobro = (int)rqconsulta.Fconatable;
            Saldo saldo = new Saldo(operacion, fcobro);
            saldo.Calculasaldohoy();
            saldo.CalculaCuotasfuturas();
            Dictionary<string, object> m = new Dictionary<string, object>();
            decimal totaldeuda = saldo.Totalpendientepago;
            
            if (saldo.Cxp > 0) {
                totaldeuda = totaldeuda - saldo.Cxp;
            }
            if (totaldeuda < 0) {
                totaldeuda = 0;
            }
            m["saldo"] = totaldeuda;
            List<Dictionary<string, object>> lresp = new List<Dictionary<string, object>>();
            lresp.Add(m);
            // Fija la respuesta en el response.
            rqconsulta.Response["SALDO"] = lresp;
        }

    }
}
