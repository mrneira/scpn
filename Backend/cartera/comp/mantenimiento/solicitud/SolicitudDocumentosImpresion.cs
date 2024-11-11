using core.componente;
using dal.cartera;
using modelo;
using System;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace cartera.comp.mantenimiento.solicitud {

    public class SolicitudDocumentosImpresion : ComponenteMantenimiento {
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {

            // Actualiza registros de informacion requerida por producto asociados a la solicitud.
            tcarsolicituddocumentos obj = TcarSolicitudDocumentosDal.find(
                 (long)rqmantenimiento.Mdatos["csolicitud"], Int32.Parse(rqmantenimiento.Mdatos["cdocumento"].ToString()));
            if (obj == null) {
                return;
            }
            obj.numeroimpresion = obj.numeroimpresion + 1;
            obj.fultimaimpresion = rqmantenimiento.Freal;
            obj.cusuarioultimp = rqmantenimiento.Cusuario;
            Sessionef.Actualizar(obj);

        }
    }
}
