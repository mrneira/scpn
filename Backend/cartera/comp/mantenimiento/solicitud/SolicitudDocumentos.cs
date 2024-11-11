using cartera.datos;
using core.componente;
using dal.cartera;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.solicitud {
    /// <summary>
    /// Clase que se encarga de crear documentos de reporte por solicitud. Los documentos se toman de la definicion del producto.
    /// </summary>
    public class SolicitudDocumentos : ComponenteMantenimiento {
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {

            Solicitud solicitud = SolicitudFachada.GetSolicitud();
            tcarsolicitud tcarsolicitud = solicitud.Tcarsolicitud;
            // Obtiene lista de informacion requerida por producto.
            List<tcarproductodocumentos> ldocumentos = TcarProductoDocumentosDal.Find((int)tcarsolicitud.cmodulo,
                    (int)tcarsolicitud.cproducto, (int)tcarsolicitud.ctipoproducto);

            // Crea registros de informacion requerida por producto asociados a la solicitud.
            if (ldocumentos.Count > 0) { 
                List<tcarsolicituddocumentos> lsoldoc = TcarSolicitudDocumentosDal.CreateTcarSolicitudDocumentos(ldocumentos,
                        tcarsolicitud.csolicitud);
                int? pos = rqmantenimiento.Lorden.Count;
                if (pos == null) {
                    pos = 0;
                }
                rqmantenimiento.AdicionarTabla("TCARSOLICITUDDOCUMENTOS", lsoldoc, false);
            }
        }
    }
}
