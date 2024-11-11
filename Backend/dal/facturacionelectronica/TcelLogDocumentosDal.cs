using modelo;
using util.servicios.ef;
using System.Data.SqlClient;
using System.Linq;
using modelo.helper;

namespace dal.facturacionelectronica {

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla tcellogdocumentos.
    /// </summary>
    public class TcelLogDocumentosDal
    {
        private static string UPD_LOGDOCUMENTO_REENVIO = "update tcellogdocumentos set esreenvio = 0 where clog= @clog";
        private static string UPD_LOGDOCUMENTO_AUTORIZACION = "update tcellogdocumentos set estado = @estado where clog= @clog";
        private static string UPD_LOGDOCUMENTO_CORRECCION = "update tcellogdocumentos set estado = @estado where numerodocumento= @numerodocumento";

        public static void CrearLogDocumentos(tcellogdocumentos logdocumentos)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.tcellogdocumentos.Add(logdocumentos);
            contexto.SaveChanges();
        }
        
        /// <summary>
        /// Actualiza el reenvio al logdocumento.
        /// </summary>
        public static void UpdateDocumentoReenviado(long clog)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(UPD_LOGDOCUMENTO_REENVIO, new SqlParameter("clog", clog));
        }

        /// <summary>
        /// Actualiza el estado al logdocumento.
        /// </summary>
        public static void UpdateDocumentoAutorizacion(long clog, int estado)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(UPD_LOGDOCUMENTO_AUTORIZACION, new SqlParameter("clog", clog), new SqlParameter("estado", estado));
        }

        public static void UpdateDocumentoCorreccion(string numeroDocumento, int estado)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(UPD_LOGDOCUMENTO_CORRECCION, new SqlParameter("numerodocumento", numeroDocumento), new SqlParameter("estado", estado));
        }


        public static tcellogdocumentos FindLog(long clog)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcellogdocumentos obj = null;
            obj = contexto.tcellogdocumentos.Where(x => x.clog == clog).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

        public static tcellogdocumentos FindDocumento(string tipodocumento, string numerodocumento)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcellogdocumentos obj = null;
            obj = contexto.tcellogdocumentos.Where(x => x.numerodocumento == numerodocumento && x.tipodocumento == tipodocumento && x.xmlfirmado !=null).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

        public static tcellogdocumentos FindDocumentoAutorizado(string tipodocumento, string numerodocumento)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcellogdocumentos obj = null;
            obj = contexto.tcellogdocumentos.Where(x => x.numerodocumento == numerodocumento && x.tipodocumento == tipodocumento && x.mensaje.Trim().Contains("AUTORIZADO")).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

    }
}
