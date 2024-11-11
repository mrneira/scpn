using core.componente;
using util.dto.consulta;
using util.dto;
using modelo;
using System.Collections.Generic;
using dal.garantias;
using dal.cartera;
using util;

namespace seguros.comp.consulta.alertaSolicitud
{
    class AlertaSolicitud : ComponenteConsulta
    {   /// <summary>
        /// Consulta si tiene solicitud existente.
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            Response resp = rqconsulta.Response;
            if (rqconsulta.Mdatos.ContainsKey("coperacioncartera")) {
                string coperacioncartera = rqconsulta.Mdatos["coperacioncartera"].ToString();
                string coperaciongarantia = rqconsulta.Mdatos["coperaciongarantia"].ToString();

                tgaroperacion tgaroperacion = TgarOperacionDal.FindOperacionAnterior(coperacioncartera);
                if (tgaroperacion != null) {
                    tcarsolicitudgarantias tcarsolicitudgarantias = TcarSolicitudGarantiasDal.Find(tgaroperacion.coperacion.ToString());
                    long solicitud = (int)tcarsolicitudgarantias.csolicitud;
                        tcarsolicitud tcarsolicitud = TcarSolicitudDal.FindAlerta(solicitud);
                        if (tcarsolicitud != null) {
                            string cestatus = tcarsolicitud.cestatussolicitud.ToString();
                            tcarestatussolicitud tcarestatussolicitud = TcarEstatusSolicitudDal.FindInDataBase(cestatus);
                            throw new AtlasException("SGS-0007", "LA OPERACION TIENE UNA SOLICITUD: {0}; ESTADO DE LA SOLICITUD: { 1 } ", coperaciongarantia, tcarestatussolicitud.nombre);
                            
                        }
                }
            }
        }
    }
}
