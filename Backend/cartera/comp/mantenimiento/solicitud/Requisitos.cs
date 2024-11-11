using cartera.datos;
using core.componente;
using core.servicios;
using dal.cartera;
using dal.contabilidad;
using modelo;
using modelo.interfaces;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace cartera.comp.mantenimiento.solicitud {

    /// <summary>
    /// Clase que se encarga de crear requisitos de informacion por solicitud. Los requisitos se toman de la definicion del producto.
    /// </summary>
    public class Requisitos : ComponenteMantenimiento {
        
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {

            Solicitud solicitud = SolicitudFachada.GetSolicitud();
            tcarsolicitud tcarsolicitud = solicitud.Tcarsolicitud;
            // Obtiene lista de informacion requerida por producto.
            List<tcarproductorequisitos> lrequisitos = TcarProductoRequisitosDal.Find((int)tcarsolicitud.cmodulo,
                    (int)tcarsolicitud.cproducto, (int)tcarsolicitud.ctipoproducto);
            // elimina requisitos previos.
            TcarSolicitudRequisitosDal.Delete(tcarsolicitud.csolicitud);

            // Crea registros de informacion requerida por producto asociados a la solicitud.
            List<tcarsolicitudrequisitos> lsolreq = TcarSolicitudRequisitosDal.CreateTcarSolicitudRequisitos(lrequisitos,
                    tcarsolicitud.csolicitud);
            int? pos = rqmantenimiento.Lorden.Count;
            if (pos == null) {
                pos = 0;
            }
            rqmantenimiento.AdicionarTabla("TCARPRODUCTOREQUISITOS", lsolreq, false);
        }

    }

}
