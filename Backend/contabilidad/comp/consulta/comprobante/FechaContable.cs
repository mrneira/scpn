using core.componente;
using dal.contabilidad;
using dal.seguridades;
using modelo;
using modelo.interfaces;
using System.Collections.Generic;
using util.dto.consulta;

namespace contabilidad.comp.consulta.comprobante {

    public class FechaContable : ComponenteConsulta {

        /// <summary>
        /// Metodo que entrega la cabecera y detalle de un comprobante contable.
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta) {
            int fperiodofinanterior = TconPeriodoContableDal.GetFPeriodoFinAnteriorAFechaContable(rqconsulta.Fconatable);
            rqconsulta.Response["CON_FPERIODOFINANTERIOR"] = fperiodofinanterior;
        }
    }
}
