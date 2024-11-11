using amortizacion.dto;
using amortizacion.helper;
using cartera.enums;
using core.componente;
using core.servicios;
using dal.cartera;
using dal.contabilidad;
using dal.generales;
using modelo;
using modelo.interfaces;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace cartera.datos {

    /// <summary>
    ///  Clase utilitaria que maneja datos de una solicitud de cartera.
    /// </summary>
    public class SolicitudFachada {
        
        /// <summary>
        /// Entrega datos de una solicitud de cartera.
        /// </summary>
        /// <returns>Solicitud</returns>
        public static Solicitud GetSolicitud() {
            DatosCartera dc = DatosCartera.GetDatosCartera();
            Solicitud solicitud = dc.GetSolicitude();
            return solicitud;
        }

        /// <summary>
        /// Fija datos de una solicitud de cartera.
        /// </summary>
        /// <param name="solicitud">Datos de la solicitud.</param>
        /// <returns></returns>
        public static void SetSolicitud(Solicitud solicitud) {
            DatosCartera dc = DatosCartera.GetDatosCartera();
            dc.SetSolicitude(solicitud);
        }
    }
}
