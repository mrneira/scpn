using core.componente;
using dal.cartera;
using dal.generales;
using System;
using System.Collections.Generic;
using util.dto;
using util.dto.consulta;
using modelo;
using dal.persona;
using dal.socio;

namespace bancaenlinea.comp.consulta.socios {

    /// <summary>
    /// Clase que se encarga de consultar datos basicos del socio.
    /// </summary>
    public class InformacionSocios : ComponenteConsulta {

        /// <summary>
        /// Consulta datos basicos del socio.
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            Response resp = rqconsulta.Response;
            long cpersona = (long)rqconsulta.Mdatos["cpersona"];

            tsoccesantia socio = TsocCesantiaDal.Find(cpersona, (int)rqconsulta.Ccompania);
            tsoccesantiahistorico historico = TsocCesantiaHistoricoDal.Find(cpersona, (int)rqconsulta.Ccompania, socio.secuenciahistorico);

            List<Dictionary<string, object>> ldatos = new List<Dictionary<string, object>>();

            tgencatalogodetalle cargo = TgenCatalogoDetalleDal.Find((int)socio.ccatalogotipocargo, socio.cdetalletipocargo);
            tgencatalogodetalle estado = TgenCatalogoDetalleDal.Find((int)socio.ccatalogotipoestado, socio.ccdetalletipoestado);

            Dictionary<string, object> mdatos = new Dictionary<string, object> {
                ["credencial"] = socio.credencial,
                ["ntipopolicia"] = TsocTipoPoliciaDal.Find((long)socio.ctipopolicia).nombre,
                ["ntipocargo"] = cargo!=null? cargo.nombre:"",
                ["nestado"] = estado!=null? estado.nombre:"",
                ["ubicacion"] = socio.ubicacionarchivo,
                ["sueldoactual"] = socio.sueldoactual,
                ["nestadosocio"] = TsocEstadoSocioDal.Find((long)historico.cestadosocio).nombre,
                ["ngrado"] = TsocTipoGradoDal.Find((long)historico.cgradoactual).nombre
            };
            ldatos.Add(mdatos);

            resp["DATOSSOCIOS"] = ldatos;
        }
    }
}

