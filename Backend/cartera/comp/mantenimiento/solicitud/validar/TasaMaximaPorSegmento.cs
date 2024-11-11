using cartera.datos;
using core.componente;
using core.servicios;
using dal.cartera;
using dal.contabilidad;
using modelo;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.solicitud.validar {
   
    /// <summary>
    /// Clase que se encarga de validar que la tasa de operacion de cartera no sobrepase la tasa maxima legal definida para el segmento.
    /// </summary>
    public class TasaMaximaPorSegmento : ComponenteMantenimiento {
        
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            Solicitud solicitud = SolicitudFachada.GetSolicitud();
            tcarsolicitud tcarsolicitud = solicitud.Tcarsolicitud;
            List<tcarsolicitudtasa> lsoltasa = null;
            if (rqmantenimiento.GetTabla("TCARSOLICITUDTASA") != null) {
                lsoltasa = rqmantenimiento.GetTabla("TCARSOLICITUDTASA").Lregistros.Cast<tcarsolicitudtasa>().ToList();
            }

            if (lsoltasa == null || lsoltasa.Count() == 0) {
                lsoltasa = (List<tcarsolicitudtasa>)TcarSolicitudTasaDal.Find((long)rqmantenimiento.GetLong("csolicitud"));
            }
            tcarproducto tcp = TcarProductoDal.Find((int)tcarsolicitud.cmodulo, (int)tcarsolicitud.cproducto,
                    (int)tcarsolicitud.ctipoproducto);

            // tasa por segmento
            bool tasadelsegemento = (bool)tcp.tasasegmento;
            bool tasadelsegementofrec = (bool)tcp.tasasegmentofrec;

            foreach (tcarsolicitudtasa obj in lsoltasa) {
                if (tasadelsegemento) {
                    TcarSegmentoDal.ValidaTasaMaximaLegal(tcarsolicitud.csegmento, obj.tasaefectiva);
                }
                if (tasadelsegementofrec) {
                    TcarSegmentoDal.ValidaTasaMaximaLegal(tcarsolicitud.csegmento, obj.tasaefectiva);
                }

            }
        }

    }

}
