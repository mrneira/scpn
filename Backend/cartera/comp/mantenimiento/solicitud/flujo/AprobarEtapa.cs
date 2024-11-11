using cartera.datos;
using cartera.enums;
using core.componente;
using core.servicios.mantenimiento;
using dal.cartera;
using modelo;
using System.Collections.Generic;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.solicitud.flujo {

    /// <summary>
    /// Clase que se encarga de registrar las aprobaciones de etapa de la solicitud
    /// </summary>
    public class AprobarEtapa : ComponenteMantenimiento {

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
                    etapaactual.aprobado = true;
                    etapaactual.cusuariomod = rqmantenimiento.Cusuario;
                    etapaactual.fmodificacion = Fecha.GetFecha(rqmantenimiento.Fconatable);
                    etapaactual.comentario = rqmantenimiento.Comentario;
                }
                if (tcarsolicitud.cestatussolicitud.Equals(EnumEstatus.APROVADA.Cestatus)) {
                    ValidaEtapaAprobacion(rqmantenimiento);
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

        /// <summary>
        /// Validación de datos de aprobacion
        /// </summary>
        /// <param name="rqmantenimiento">Datos del requet con los que se ejecuta la transaccion.</param>
        private void ValidaEtapaAprobacion(RqMantenimiento rqmantenimiento)
        {
            // Ejecuta transaccion de aprobacion de solicitud
            RqMantenimiento rq = (RqMantenimiento)rqmantenimiento.Clone();
            Mantenimiento.ProcesarAnidado(rq, 7, 128);
        }

    }

}

