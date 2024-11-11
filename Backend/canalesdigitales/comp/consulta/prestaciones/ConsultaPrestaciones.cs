using canalesdigitales.enums;
using canalesdigitales.helper;
using core.componente;
using dal.canalesdigitales;
using dal.generales;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto;
using util.dto.consulta;

namespace canalesdigitales.comp.consulta.prestaciones {
    class ConsultaPrestaciones : ComponenteConsulta {

        private readonly ComponenteHelper componenteHelper = new ComponenteHelper();

        public override void Ejecutar(RqConsulta rqconsulta) {
            ConsultarDatosSocio(rqconsulta);
            ConsultarTiposLiquidacion(rqconsulta);
        }

        private void ConsultarDatosSocio(RqConsulta rqconsulta) {
            tcanusuario usuario = TcanUsuarioDal.Find(rqconsulta.Cusuariobancalinea, rqconsulta.Ccanal);

            RqConsulta rq = new RqConsulta();
            rq.Cmodulo = 27;
            rq.Ctransaccion = 201;
            rq.Ccanal = "OFI";
            rq.Ccompania = EnumGeneral.COMPANIA_COD;
            rq.Freal = Fecha.GetFechaSistema();
            rq.Mdatos.Add("cpersona", usuario.cpersona);
            rq.Response = new Response();

            componenteHelper.ProcesarComponenteConsulta(rq, EnumComponentes.DATOS_SOCIO);

            rqconsulta.Response.Add("DATOSSOCIO", rq.Response["DATOSSOCIO"]);
            rqconsulta.Response.Add("falta", rq.Response["p_falta"]);
            rqconsulta.Response.Add("fbaja", rq.Response["p_fbaja"]);
            rqconsulta.Response.Add("cdetalletipoexp", rq.Response["p_cdetalletipoexp"]);
            rqconsulta.Response.Add("cdetallejerarquia", rq.Response["p_cdetallejerarquia"]);
            rqconsulta.Response.Add("coeficiente", rq.Response["p_coeficiente"]);
        }

        private void ConsultarTiposLiquidacion(RqConsulta rqconsulta) {
            IList<tgencatalogodetalle> lcatalogodetalle = TgenCatalogoDetalleDal.Find(EnumCatalogos.CCATALOGO_TIPOLIQUIDACION);
            IList<tgencatalogodetalle> ltiposliquidacion = lcatalogodetalle.Where(x => (x.cdetalle == "CES" || x.cdetalle == "DEV")).ToList();

            rqconsulta.Response.Add(nameof(ltiposliquidacion), ltiposliquidacion);
        }
    }
}
