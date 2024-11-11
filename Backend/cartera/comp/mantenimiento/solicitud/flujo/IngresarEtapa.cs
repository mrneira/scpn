using cartera.datos;
using core.componente;
using modelo;
using System.Collections.Generic;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.solicitud.flujo {

    /// <summary>
    /// Clase que se encarga de registrar el ingreso de la solicitud
    /// </summary>
    public class IngresarEtapa : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            if (rqmantenimiento.Mdatos.ContainsKey("essimulacion") && (bool)rqmantenimiento.Mdatos["essimulacion"]) {
                return;
            }

            Solicitud solicitud = SolicitudFachada.GetSolicitud();
            tcarsolicitud tcarsolicitud = solicitud.Tcarsolicitud;

            List<tcarsolicitudetapa> letapas = new List<tcarsolicitudetapa>();
            tcarsolicitudetapa etapa = new tcarsolicitudetapa();

            etapa.csolicitud = tcarsolicitud.csolicitud;
            etapa.cestatussolicitud = tcarsolicitud.cestatussolicitud;
            etapa.cusuarioing = rqmantenimiento.Cusuario;
            etapa.fingreso = rqmantenimiento.Freal;
            etapa.aprobado = true;
            etapa.comentario = "INGRESO DE SOLICITUD";
            letapas.Add(etapa);

            // Adiciona tabla al rqMantenimiento
            rqmantenimiento.AdicionarTabla(typeof(tcarsolicitudetapa).Name.ToUpper(), letapas, false);
        }

    }

}

