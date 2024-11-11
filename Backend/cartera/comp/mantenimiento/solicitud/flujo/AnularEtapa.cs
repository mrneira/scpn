using cartera.datos;
using cartera.enums;
using core.componente;
using dal.cartera;
using modelo;
using System.Collections.Generic;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.solicitud.flujo
{

    /// <summary>
    /// Clase que se encarga de registrar la anulacion de la solicitud
    /// </summary>
    public class AnularEtapa : ComponenteMantenimiento
    {

        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            Solicitud solicitud = SolicitudFachada.GetSolicitud();
            tcarsolicitud tcarsolicitud = solicitud.Tcarsolicitud;

            // Etapas de solicitud
            if (tcarsolicitud.cestatussolicitud.Equals(EnumEstatus.ANULADA.Cestatus))
            {
                this.CreaAnulacionEtapa(rqmantenimiento, tcarsolicitud);
                this.AnulaArregloPago(rqmantenimiento, tcarsolicitud);
            }
        }

        /// <summary>
        /// Completa el pk en la lista de operaciones a pagar en la solicitud.
        /// </summary>
        /// <param name="loperaciones">Lista de operaciones a completar el pk.</param>
        /// <param name="tcarsolicitud">Objeto de contiene los datos de solicitud del credito.</param>
        private void CreaAnulacionEtapa(RqMantenimiento rq, tcarsolicitud sol)
        {
            List<tcarsolicitudetapa> letapa = new List<tcarsolicitudetapa>();
            tcarsolicitudetapa etapa = new tcarsolicitudetapa();
            tcarsolicitudetapa etapaactual = TcarSolicitudEtapaDal.FindActual((int)sol.csolicitud);

            if (etapaactual != null)
            {
                etapaactual.aprobado = true;
                etapaactual.cusuariomod = rq.Cusuario;
                etapaactual.fmodificacion = Fecha.GetFecha(rq.Fconatable);
                etapaactual.comentario = rq.Comentario;
            }

            etapa.csolicitud = sol.csolicitud;
            etapa.cestatussolicitud = sol.cestatussolicitud;
            etapa.cusuarioing = rq.Cusuario;
            etapa.fingreso = rq.Freal;

            letapa.Add(etapa);
            if (etapaactual != null)
            {
                letapa.Add(etapaactual);
            }
            rq.AdicionarTabla(typeof(tcarsolicitudetapa).Name.ToUpper(), letapa, false);
        }

        /// <summary>
        /// Completa el pk en la lista de operaciones a pagar en la solicitud.
        /// </summary>
        /// <param name="loperaciones">Lista de operaciones a completar el pk.</param>
        /// <param name="tcarsolicitud">Objeto de contiene los datos de solicitud del credito.</param>
        private void AnulaArregloPago(RqMantenimiento rq, tcarsolicitud sol)
        {
            if (!sol.cestadooperacion.Equals(EnumEstadoOperacion.ORIGINAL.CestadoOperacion))
            {
                // Aplica para operaciones de arreglo de pago
                List<tcaroperacionarreglopago> larreglopago = new List<tcaroperacionarreglopago>();
                List<tcaroperacionarreglopago> loperacionesarregloplago = TcarOperacionArregloPagoDal.Find((long)sol.csolicitud);
                foreach (tcaroperacionarreglopago ap in loperacionesarregloplago)
                {
                    ap.Esnuevo = false;
                    ap.Actualizar = true;
                    ap.cestatus = EnumEstatus.ANULADA.Cestatus;
                    ap.cusuariocancela = rq.Cusuario;
                    ap.fcancelacion = rq.Fconatable;
                    larreglopago.Add(ap);
                }
                rq.AdicionarTabla(typeof(tcaroperacionarreglopago).Name.ToUpper(), larreglopago, false);
            }
            else//CCA 20220711 todo el else
            {
                List<tcaroperacionarreglopago> loperacionesarregloplagovalida = TcarOperacionArregloPagoDal.Find((long)sol.csolicitud);
                if (sol.cestadooperacion.Equals(EnumEstadoOperacion.ORIGINAL.CestadoOperacion) && loperacionesarregloplagovalida.Count > 0)
                {
                    // Aplica para operaciones de arreglo de pago
                    List<tcaroperacionarreglopago> larreglopago = new List<tcaroperacionarreglopago>();
                    List<tcaroperacionarreglopago> loperacionesarregloplago = TcarOperacionArregloPagoDal.Find((long)sol.csolicitud);
                    foreach (tcaroperacionarreglopago ap in loperacionesarregloplago)
                    {
                        ap.Esnuevo = false;
                        ap.Actualizar = true;
                        ap.cestatus = EnumEstatus.ANULADA.Cestatus;
                        ap.cusuariocancela = rq.Cusuario;
                        ap.fcancelacion = rq.Fconatable;
                        larreglopago.Add(ap);
                    }
                    rq.AdicionarTabla(typeof(tcaroperacionarreglopago).Name.ToUpper(), larreglopago, false);
                }
            }
        }
    }

}

