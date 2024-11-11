using modelo;
using modelo.helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.cartera {
   public class TcarOperacionDocumentosDal {
        /// <summary>
        /// Crea y entrega una lista de documentos de informacion a verificar por solicitud.
        /// </summary>
        /// <param name="ldocumentos">Lista de documentos por producto.</param>
        /// <param name="csolicitud">Numero de solicitud.</param>
        /// <returns> List TcarSolicitudDocumentosDto </returns>
        public static List<tcaroperaciondocumentos> CreateTcarOperacionDocumentos(List<tcarproductodocumentos> ldocumentos, string coperacion) {
            List<tcaroperaciondocumentos> lopedoc = new List<tcaroperaciondocumentos>();
            if (ldocumentos == null) {
                return lopedoc;
            }
            foreach (tcarproductodocumentos obj in ldocumentos) {
                tcaroperaciondocumentos doc = new tcaroperaciondocumentos();
                doc.coperacion = coperacion;
                doc.cdocumento = (int)obj.cdocumento;
                doc.numeroimpresion = 0;
                doc.fultimaimpresion = null;
                doc.cusuarioultimp = null;
                lopedoc.Add(doc);
            }
            return lopedoc;
        }

        /// Crea y entrega una lista de documentos de informacion a verificar por solicitud.
        /// </summary>
        /// <param name="ldocumentos">Lista de documentos de la soicitud.</param>
        /// <param name="csolicitud">Numero de solicitud.</param>
        /// <returns> List TcarSolicitudDocumentosDto </returns>
        public static List<tcaroperaciondocumentos> CreateTcarOperacionDocumentos(List<tcarsolicituddocumentos> ldocumentos, string coperacion)
        {
            List<tcaroperaciondocumentos> lopedoc = new List<tcaroperaciondocumentos>();
            if (ldocumentos == null)
            {
                return lopedoc;
            }
            foreach (tcarsolicituddocumentos obj in ldocumentos)
            {
                tcaroperaciondocumentos doc = new tcaroperaciondocumentos();
                doc.coperacion = coperacion;
                doc.cdocumento = (int)obj.cdocumento;
                doc.numeroimpresion = (int)obj.numeroimpresion;
                doc.fultimaimpresion = obj.fultimaimpresion;
                doc.cusuarioultimp = obj.cusuarioultimp;
                lopedoc.Add(doc);
            }
            return lopedoc;
        }

        /// Consulta todos un documento especifico por operacion.
        /// </summary>
        /// <param name="coperacion">Codigo de operacion.</param>
        /// <param name="cdocumento">Codigo de documento.</param>
        /// <returns> List TcarSolicitudDocumentosDto </returns>
        public static tcaroperaciondocumentos find(string coperacion, int cdocumento) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcaroperaciondocumentos obj = null;
            obj = contexto.tcaroperaciondocumentos.AsNoTracking().Where(x => x.coperacion == coperacion && x.cdocumento == cdocumento).SingleOrDefault();
            if (obj == null) {
                return null;
            }
            EntityHelper.SetActualizar(obj);
            return obj;
        }
    }
}
