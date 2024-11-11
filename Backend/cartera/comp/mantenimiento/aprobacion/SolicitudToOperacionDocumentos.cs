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

namespace cartera.comp.mantenimiento.aprobacion
{
    public class SolicitudToOperacionDocumentos : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            List<tcaroperaciondocumentos> ldocumentos = new List<tcaroperaciondocumentos>();

            long csolicitud = long.Parse(rqmantenimiento.Mdatos["csolicitud"].ToString());
            tcarsolicitud tcarsolicitud = TcarSolicitudDal.Find(csolicitud);

            // Obtiene lista de documentos de la solicitud.
            List<tcarsolicituddocumentos> ldocsolicitud = TcarSolicitudDocumentosDal.findDocuments(tcarsolicitud.csolicitud).ToList();
            if (ldocsolicitud != null && ldocsolicitud.Count >= 0)
            {
                List<tcaroperaciondocumentos> lopesol = TcarOperacionDocumentosDal.CreateTcarOperacionDocumentos(ldocsolicitud, rqmantenimiento.Coperacion);
                foreach (tcaroperaciondocumentos docsol in lopesol)
                {
                    ldocumentos.Add(docsol);
                }
            }

            // Obtiene lista de informacion requerida por producto.
            List<tcarproductodocumentos> ldocproducto = TcarProductoDocumentosDal.Find((int)tcarsolicitud.cmodulo,
                    (int)tcarsolicitud.cproducto, (int)tcarsolicitud.ctipoproducto, false);

            // Crea registros de informacion requerida por producto asociados a la solicitud.
            if (ldocproducto != null && ldocproducto.Count > 0)
            {
                List<tcaroperaciondocumentos> lopepro = TcarOperacionDocumentosDal.CreateTcarOperacionDocumentos(ldocproducto, rqmantenimiento.Coperacion);
                foreach (tcaroperaciondocumentos docpro in lopepro)
                {
                    ldocumentos.Add(docpro);
                }
            }
            
            rqmantenimiento.AdicionarTabla("TCAROPERACIONDOCUMENTOS", ldocumentos, false);
        }
    }
}
