using cartera.datos;
using core.componente;
using System.Collections.Generic;
using util.dto.mantenimiento;
using modelo;
using System.Linq;
using core.servicios;
using dal.cartera;

namespace cartera.comp.mantenimiento.solicitud {

    /// <summary>
    /// Clase que se encarga de completar información de la capacidad de pago
    /// </summary>
    public class CapacidadPago : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            Solicitud solicitud = SolicitudFachada.GetSolicitud();
            tcarsolicitud tcarsolicitud = solicitud.Tcarsolicitud;

            if (rqmantenimiento.Mdatos.ContainsKey("essimulacion") && (bool)rqmantenimiento.Mdatos["essimulacion"]) {
                TcarSolicitudCapacidadPagoDal.PorcentajeCapacidadPago(rqmantenimiento);
                TcarSolicitudCapacidadPagoDal.CompletaIngresos("I", rqmantenimiento, tcarsolicitud);
                TcarSolicitudCapacidadPagoDal.CompletaEgresos("E", rqmantenimiento, tcarsolicitud);
                rqmantenimiento.Response["porcentajeconsolidado"] = TcarParametrosDal.GetValorNumerico("DEUDAS-CONSOLIDADO", rqmantenimiento.Ccompania);
                return;
            }

            List<tcarsolicitudpersona> lpersonas = new List<tcarsolicitudpersona>();

            if (rqmantenimiento.GetTabla("DEUDOR") != null && rqmantenimiento.GetTabla("DEUDOR").Lregistros.Count > 0) {
                tcarsolicitudcapacidadpago capacidaddeudor = new tcarsolicitudcapacidadpago();
                lpersonas.Add(CompletarPersona(CompletarCapacidad(rqmantenimiento, capacidaddeudor, "DEUDOR")));
            }
            if (rqmantenimiento.GetTabla("GARANTE") != null && rqmantenimiento.GetTabla("GARANTE").Lregistros.Count > 0) {
                tcarsolicitudcapacidadpago capacidadgarante = new tcarsolicitudcapacidadpago();
                lpersonas.Add(CompletarPersona(CompletarCapacidad(rqmantenimiento, capacidadgarante, "GARANTE")));
            }

            if (lpersonas.Count == 0) {
                return;
            }

            rqmantenimiento.AdicionarTabla(typeof(tcarsolicitudpersona).Name.ToUpper(), lpersonas, 1, false);
        }

        /// <summary>
        /// Completa los datos de persona
        /// </summary>
        /// <param name="capacidadpago">Instancia de Capacidad de Pago</param>
        public static tcarsolicitudcapacidadpago CompletarCapacidad(RqMantenimiento rqmantenimiento, tcarsolicitudcapacidadpago capacidadpago, string tipo)
        {
            capacidadpago = (tcarsolicitudcapacidadpago)rqmantenimiento.GetTabla(tipo).Lregistros.ElementAt(0);
            capacidadpago.ccapacidad = Secuencia.GetProximovalor("CAPACIDADPG");
            capacidadpago.csolicitud = long.Parse(rqmantenimiento.Mdatos["csolicitud"].ToString());
            capacidadpago.ccompania = rqmantenimiento.Ccompania;
            capacidadpago.fregistro = rqmantenimiento.Fconatable;
            TcarSolicitudCapacidadPagoDal.CrearIngresosEgresos(rqmantenimiento, capacidadpago.ccapacidad, capacidadpago.csolicitud, tipo);
            return capacidadpago;
        }

        /// <summary>
        /// Completa los datos de persona
        /// </summary>
        /// <param name="capacidadpago">Instancia de Capacidad de Pago</param>
        public static tcarsolicitudpersona CompletarPersona(tcarsolicitudcapacidadpago capacidadpago)
        {
            tcarsolicitudpersona persona = new tcarsolicitudpersona();
            persona.csolicitud = capacidadpago.csolicitud;
            persona.cpersona = (long)capacidadpago.cpersona;
            persona.ccompania = (int)capacidadpago.ccompania;
            persona.crelacion = (int)capacidadpago.crelacion;
            return persona;
        }

    }
}
