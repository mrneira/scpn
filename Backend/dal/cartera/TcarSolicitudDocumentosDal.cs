using modelo;
using modelo.helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.cartera {
    public class TcarSolicitudDocumentosDal {

        /// <summary>
        /// Crea y entrega una lista de documentos de informacion a verificar por solicitud.
        /// </summary>
        /// <param name="ldocumentos">Lista de documentos por producto.</param>
        /// <param name="csolicitud">Numero de solicitud.</param>
        /// <returns> List TcarSolicitudDocumentosDto </returns>
        public static List<tcarsolicituddocumentos> CreateTcarSolicitudDocumentos(List<tcarproductodocumentos> ldocumentos, long csolicitud) {
            List<tcarsolicituddocumentos> lsoldoc = new List<tcarsolicituddocumentos>();
            if (ldocumentos == null) {
                return lsoldoc;
            }
            foreach (tcarproductodocumentos obj in ldocumentos) {
                tcarsolicituddocumentos doc = new tcarsolicituddocumentos();
                doc.csolicitud = csolicitud;
                doc.cdocumento = (int)obj.cdocumento;
                doc.numeroimpresion = 0;
                doc.fultimaimpresion = null;
                doc.cusuarioultimp = null;
                lsoldoc.Add(doc);
            }
            return lsoldoc;
        }

        public static tcarsolicituddocumentos find(long csolicitud, int cdocumento) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcarsolicituddocumentos obj = null;
            obj = contexto.tcarsolicituddocumentos.AsNoTracking().Where(x => x.csolicitud == csolicitud && x.cdocumento == cdocumento).SingleOrDefault();
            if (obj == null) {
                return null;
            }
            EntityHelper.SetActualizar(obj);
            return obj;
        }

        public static List<tcarsolicituddocumentos> findDocuments(long csolicitud)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List < tcarsolicituddocumentos> ldocs = new List<tcarsolicituddocumentos>();
            ldocs = contexto.tcarsolicituddocumentos.AsNoTracking().Where(x => x.csolicitud == csolicitud).ToList();
            return ldocs;
        }
    }
}
