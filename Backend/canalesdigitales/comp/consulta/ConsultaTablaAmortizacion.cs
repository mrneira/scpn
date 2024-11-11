using canalesdigitales.enums;
using canalesdigitales.helper;
using canalesdigitales.validaciones;
using core.componente;
using dal.canalesdigitales;
using dal.cartera;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto;
using util.dto.consulta;

namespace canalesdigitales.comp.consulta {
    class ConsultaTablaAmortizacion : ComponenteConsulta {

        private readonly Validar validar = new Validar();
        private readonly ComponenteHelper componenteHelper = new ComponenteHelper();
        private tcansolicitud solicitud = null;
        private tcaroperacion operacion = null;

        public override void Ejecutar(RqConsulta rqconsulta) {
            ConsultarValoresFecha(rqconsulta);
            ConsultarTablaAmortizacion(rqconsulta);
        }

        private void ConsultarValoresFecha(RqConsulta rqconsulta) {
            string coperacion = rqconsulta.GetString(nameof(coperacion));
            RqConsulta rq = new RqConsulta();

            rq.Coperacion = coperacion;
            rq.Fconatable = Fecha.GetFechaSistemaIntger();
            rq.Response = new Response();

            componenteHelper.ProcesarComponenteConsulta(rq, EnumComponentes.RUBROS_PRECANCELACION);

            rqconsulta.Response.Add("RUBROS", rq.Response["RUBROS"]);
            rqconsulta.Response.Add("TOTALPRECANCELACION", rq.Response["TOTALPRECANCELACION"]);

        }

        private void ConsultarTablaAmortizacion(RqConsulta rqconsulta) {
            string coperacion = rqconsulta.GetString(nameof(coperacion));
            RqConsulta rq = new RqConsulta();

            rq.Coperacion = coperacion;
            rq.Response = new Response();

            componenteHelper.ProcesarComponenteConsulta(rq, EnumComponentes.TABLA_PAGOS);

            rqconsulta.Response.Add("TABLA", rq.Response["TABLA"]);
        }
    }
}
