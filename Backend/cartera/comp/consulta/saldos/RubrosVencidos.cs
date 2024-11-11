using cartera.datos;
using cartera.saldo;
using core.componente;
using dal.cartera;
using dal.monetario;
using modelo;
using System;
using System.Collections.Generic;
using util.dto.consulta;

namespace cartera.comp.consulta.saldos {

    /// <summary>
    /// Clase que se encarga de consultar por rubro valores vencidos de cuotas que ya llegaron a una fecha de vencimiento.
    /// </summary>
    public class RubrosVencidos : ComponenteConsulta {

        decimal totalvencido = 0;

        /// <summary>
        /// Entrega el saldo vencido de ua operacion para la fecha de trabajo.
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta) {
            Operacion operacion = OperacionFachada.GetOperacion(rqconsulta);
            int? fcobro = rqconsulta.GetDatos("ffvencimiento")!=null ? (int?)int.Parse(rqconsulta.GetDatos("ffvencimiento").ToString()) : null;
            if (fcobro == null) {
                fcobro = rqconsulta.Fconatable;
            }
            operacion.CalcularMora(null, (int)fcobro, rqconsulta.Mensaje, rqconsulta.Csucursal, rqconsulta.Ccompania, true);

            List<Dictionary<string, object>> lresp = new List<Dictionary<string, object>>();
            Saldo saldo = new Saldo(operacion, fcobro??0);
            List<tcaroperacioncuota> lcuotas = saldo.GetCuotasVencidas();
            foreach (tcaroperacioncuota cuota in lcuotas) {
                this.Adionarubro(cuota, lresp);
            }

            // Fija la respuesta en el response.
            rqconsulta.Response.Add("TOTALVENCIDO", totalvencido);

            bool solosaldo = rqconsulta.GetDatos("solosaldo") != null ? (bool)rqconsulta.GetDatos("solosaldo"): false;
            if (rqconsulta.GetDatos("solosaldo") != null && solosaldo) {
                return;
            }

            tcaroperacioncxp cxp = TcarOperacionCxPDal.Find(operacion.Coperacion);
            rqconsulta.Response.Add("RUBROS", lresp);
            rqconsulta.Response.Add("CXP", cxp == null || cxp.saldo == null ? Decimal.Zero : cxp.saldo);
        }

        /// <summary>
        /// Adiciona valores pendientes de pago por rubro.
        /// </summary>
        private void Adionarubro(tcaroperacioncuota cuota, List<Dictionary<string, object>> lresp) {
            List<tcaroperacionrubro> lrubros = cuota.GetRubros();
		    foreach (tcaroperacionrubro rubro in lrubros) {
			    if (rubro.GetPendiente().CompareTo(Decimal.Zero) <= 0) {
				    continue;
			    }
			    Dictionary<string, object> m = new Dictionary<string, object>();
                m.Add("num", rubro.numcuota);
			    m.Add("csaldo", TmonSaldoDal.Find(rubro.csaldo).nombre);
			    m.Add("tasa", rubro.tasa);
			    m.Add("monto", rubro.GetPendiente());
                totalvencido = totalvencido + rubro.GetPendiente();
                lresp.Add(m);
		    }
        }


    }
}
