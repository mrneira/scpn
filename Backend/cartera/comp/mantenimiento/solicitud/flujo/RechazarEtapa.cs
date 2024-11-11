using cartera.datos;
using core.componente;
using dal.cartera;
using modelo;
using System.Collections.Generic;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.solicitud.flujo {

    /// <summary>
    /// Clase que se encarga de registrar los rechazos de etapa de la solicitud
    /// </summary>
    public class RechazarEtapa : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            Solicitud solicitud = SolicitudFachada.GetSolicitud();
            tcarsolicitud tcarsolicitud = solicitud.Tcarsolicitud;

            // Etapas de solicitud
            if (rqmantenimiento.Mdatos.ContainsKey("aprobar")) {

                List<tcarsolicitudetapa> letapa = new List<tcarsolicitudetapa>();
                tcarsolicitudetapa etapa = new tcarsolicitudetapa();
                tcarsolicitudetapa etapaactual = TcarSolicitudEtapaDal.FindActual((int)tcarsolicitud.csolicitud);

                if (etapaactual != null) {
                    etapaactual.aprobado = false;
                    etapaactual.cusuariomod = rqmantenimiento.Cusuario;
                    etapaactual.fmodificacion = Fecha.GetFecha(rqmantenimiento.Fconatable);
                    etapaactual.comentario = rqmantenimiento.Comentario;
                }

                etapa.csolicitud = tcarsolicitud.csolicitud;
                etapa.cestatussolicitud = tcarsolicitud.cestatussolicitud;
                etapa.cusuarioing = rqmantenimiento.Cusuario;
                etapa.fingreso = rqmantenimiento.Freal;

                letapa.Add(etapa);
                if (etapaactual != null) {
                    letapa.Add(etapaactual);
                }
                rqmantenimiento.AdicionarTabla(typeof(tcarsolicitudetapa).Name.ToUpper(), letapa, false);
            }
        }
    }

}

