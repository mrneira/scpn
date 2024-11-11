using cartera.datos;
using cartera.saldo;
using core.componente;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.consulta;

namespace cartera.comp.consulta.saldos {

    /// <summary>
    /// Clase que se encarga de consultar saldos vencidos de cuotas que ya llegaron a una fecha de vencimiento.
    /// </summary>
    public class SaldoVencido : ComponenteConsulta {

        /// <summary>
        /// Entrega el saldo vencido de ua operacion para la fecha de trabajo.
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta) {
            Operacion operacion = OperacionFachada.GetOperacion(rqconsulta);
            int? fcobro = rqconsulta.Fconatable;
            Saldo saldo = new Saldo(operacion, (int)fcobro);
            // Map<String, Object> m = new HashMap<String, Object>();
            Dictionary<string, object> m = new Dictionary<string, object>();
            decimal totaldeuda = saldo.Totalpendientepago;
            if (saldo.Cxp > 0) {
                totaldeuda = totaldeuda - saldo.Cxp;
            }
            if (totaldeuda < 0) {
                totaldeuda = 0;
            }
            m["saldo"] = totaldeuda;
            m["diasvencido"] = saldo.GetDiasMorosidad();
            m["cuotasvencidas"] = saldo.GetCuotasVencidas().Count();
            List<Dictionary<String, Object>> lresp = new List<Dictionary<String, Object>>();
            lresp.Add(m);
            // Fija la respuesta en el response.
            rqconsulta.Response["SALDO"] = lresp;
        }
    }
}
