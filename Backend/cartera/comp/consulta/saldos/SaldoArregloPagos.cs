using cartera.datos;
using cartera.enums;
using cartera.saldo;
using core.componente;
using dal.cartera;
using modelo;
using System;
using System.Collections.Generic;
using util;
using util.dto.consulta;

namespace cartera.comp.consulta.saldos {

    /// <summary>
    /// Clase que se encarga de consultar saldos de cuotas en arreglo de pagos solo entrega los saldos que obligados a pagar.
    /// </summary>
    public class SaldoArregloPagos : ComponenteConsulta {

        public override void Ejecutar(RqConsulta rqconsulta)
        {
            Operacion operacion = OperacionFachada.GetOperacion(rqconsulta);
            this.ValidarArregloPagos(operacion.Coperacion);
            int fcobro = (int)rqconsulta.Fconatable;

            // Calcula saldos de arreglo de pagos.
            tcaroperacionarreglopago arreglo = TcarOperacionArregloPagoDal.Find(operacion.Coperacion, EnumEstatus.INGRESADA.Cestatus);
            Saldo saldo = new Saldo(operacion, fcobro, true, arreglo.csolicitud);
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

        /// <summary>
        /// Valida que tenga ingresado un arreglo de pagos.
        /// </summary>
        /// <param name="coperacion"></param>
        private void ValidarArregloPagos(String coperacion)
        {
            tcaroperacionarreglopago arreglo = TcarOperacionArregloPagoDal.Find(coperacion, EnumEstatus.INGRESADA.Cestatus);
            if (arreglo == null) {
                throw new AtlasException("CAR-0029", "SOLICITUD DE ARREGLO DE PAGOS NO INGRESADO");
            }
            if (arreglo.fpago != null) {
                throw new AtlasException("CAR-0030", "NO TIENE VALORES PENDIENTES DE PAGO PARA EFECTUAR EL ARREGLO DE PAGOS");
            }
        }

    }
}
