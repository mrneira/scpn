using modelo;
using util.servicios.ef;
using System.Data.SqlClient;
using System.Linq;
using modelo.helper;
using System.Collections.Generic;
using modelo.servicios;
using dal.inversiones.emisordetalle;

namespace dal.inversiones.catalogos
{
    /// <summary>
    /// Clase que encapsula los procedimientos para ejecutar las operaciones de las inversiones sobre el catálogo detalle.
    /// </summary>
    public class TinvCatalogoDetalleDal
    {

        private static string DELET = "delete tgencatalogodetalle where ccatalogo = @ccatalogo and cdetalle = @cdetalle ";

        /// <summary>
        /// Elimina un registro de la tabla tgencatalogodetalle, dado su identificador y el identificador del catálogo.
        /// </summary>
        /// <param name="istrcdetalle">Identificador del detalle del catálogo.</param>
        /// <param name="iccatalogo">Identificador del catálogo.</param>
        /// <returns></returns>
        public static void DeletePorCDetalle(string istrcdetalle, int iccatalogo = 1213)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(
                DELET,
                new SqlParameter("ccatalogo", iccatalogo),
                new SqlParameter("cdetalle", istrcdetalle));
        }


        private static string DELE = "delete tgencatalogodetalle where ccatalogo = @ccatalogo ";

        /// <summary>
        /// Elimina un grupo de la tabla tgencatalogodetalle, dado el identificador del catálogo.
        /// </summary>
        /// <param name="iccatalogo">Identificador del catálogo.</param>
        /// <returns></returns>
        public static void Delete(int iccatalogo = 1213)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(
                DELE,
                new SqlParameter("ccatalogo", iccatalogo));
        }

        /// <summary>
        /// Busca un detalle de catálogo por nombre.  Si no lo encuentra lo inserta.
        /// </summary>
        /// <param name="inombre">Nombre a buscar.</param>
        /// <param name="llngCdetalle">Identificador del catálogo detalle.</param>
        /// <param name="iccatalogo">Identificador del catálogo.</param>
        /// <param name="icusuarioing">Identificador del usuario que realiza la búsqueda e inserción.</param>
        /// <returns>string</returns>
        public static string FindInsertaPorNombre(
            string inombre
            , ref long llngCdetalle
            , int iccatalogo = 1217
            , string icusuarioing = "")
        {


            if (inombre == "") return "";

            string lRetorna = "";

            inombre = inombre.ToUpper().Trim();

            string lstrcdetalle = "";

            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();
            string lSQL = "select cdetalle from tgencatalogodetalle where ccatalogo = " +
                iccatalogo.ToString() +
                " and nombre = '" +
                inombre +
                "' ";
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, lSQL);

            IList<Dictionary<string, object>> lista = ch.GetRegistrosDictionary();

            if (lista != null && lista.Count > 0)
            {
                lstrcdetalle = lista[0]["cdetalle"].ToString();
            }
            else
            {
                string lstrCdetalleA = llngCdetalle.ToString().Trim();

                int llimite = lstrCdetalleA.Length;

                for (int i = 0; i < 6 - llimite; i++)
                {
                    lstrCdetalleA = "0" + lstrCdetalleA;
                }

                llngCdetalle++;

                contexto.Database.ExecuteSqlCommand(
                    "INSERT tgencatalogodetalle SELECT " + iccatalogo.ToString() + ", '" + lstrCdetalleA + "',0, '" + inombre + "',NULL,1",
                    new SqlParameter("ccatalogo", iccatalogo));

                lstrcdetalle = lstrCdetalleA;

            }

            lRetorna = lstrcdetalle;

            return lRetorna;

        }

        /// <summary>
        /// Busca un emisor por nombre.  Si no lo encuentra lo inserta.
        /// </summary>
        /// <param name="inombre">Nombre a buscar.</param>
        /// <param name="llngCdetalle">Identificador del catálogo detalle.</param>
        /// <param name="icemisordetalle">Identificador numérico del catálogo.</param>
        /// <param name="iccatalogo">Identificador del catálogo.</param>
        /// <param name="icalificacionriesgoactualcdetalle">Identificador de la calificación de riesgo actual del emisor.</param>
        /// <param name="icusuarioing">Identificador del usuario que realiza la búsqueda e inserción.</param>
        /// <param name="isectorcdetalle">Identificador sector al cual pertenece el emisor.</param>
        /// <returns>string[]</returns>
        public static string[] FindInsertaEmisorPorNombre(
            string inombre
            , ref long llngCdetalle
            , ref long icemisordetalle
            , int iccatalogo = 1213
            , string icalificacionriesgoactualcdetalle = ""
            , string icusuarioing = ""
            , string isectorcdetalle = "")
        {


            string[] lRetorna = new string[3];

            inombre = inombre.ToUpper().Trim();

            string lstrcdetalle = "";

            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();
            string lSQL = "select cdetalle from tgencatalogodetalle where ccatalogo = " + 
                iccatalogo.ToString() + 
                " and nombre = '" + 
                inombre + 
                "' ";
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, lSQL);

            IList<Dictionary<string, object>> lista = ch.GetRegistrosDictionary();

            if (lista != null && lista.Count > 0)
            {
                lstrcdetalle = lista[0]["cdetalle"].ToString();
            }
            else
            {
                string lstrCdetalleA = llngCdetalle.ToString().Trim();

                int llimite = lstrCdetalleA.Length;

                for (int i = 0; i < 6 - llimite; i++)
                {
                    lstrCdetalleA = "0" + lstrCdetalleA;
                }

                llngCdetalle++;

                contexto.Database.ExecuteSqlCommand(
                    "INSERT tgencatalogodetalle SELECT " + iccatalogo.ToString() + ", '" + lstrCdetalleA + "',0, '" + inombre + "',NULL,1",
                    new SqlParameter("ccatalogo", iccatalogo));

                string[] lstrEmisor = TinvEmisorDetalleDal.crearNuevo(ref icemisordetalle, iccatalogo, lstrCdetalleA,icalificacionriesgoactualcdetalle,icusuarioing,isectorcdetalle);

                lRetorna[1] = lstrEmisor[0];
                lRetorna[2] = lstrEmisor[1];

                lstrcdetalle = lstrCdetalleA;

            }

            lRetorna[0] = lstrcdetalle;

            return lRetorna;

        }

        /// <summary>
        /// Busca un emisor por su identificador.
        /// </summary>
        /// <param name="icdetalle">Identificador del detalle del catálogo.</param>
        /// <param name="iccatalogo">Identificador del catálogo.</param>
        /// <returns>tgencatalogodetalle</returns>
        public static tgencatalogodetalle FindPorCDetalle(string icdetalle, int iccatalogo = 1213)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tgencatalogodetalle obj;
            obj = contexto.tgencatalogodetalle.Where(x => x.ccatalogo.Equals(iccatalogo) && x.cdetalle.Equals(icdetalle)).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

        /// <summary>
        /// Obtiene una lista del detalle de catálogos emisor, dado el identificador del catálogo.
        /// </summary>
        /// <param name="iccatalogo">Identificador del catálogo.</param>
        /// <returns>List<tgencatalogodetalle></returns>
        public static List<tgencatalogodetalle> Find(int iccatalogo)
        {

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tgencatalogodetalle> lista = new List<tgencatalogodetalle>();

            lista = contexto.tgencatalogodetalle.AsNoTracking().Where(x => x.ccatalogo == iccatalogo).ToList();

            return lista;

        }

        /// <summary>
        /// Obtiene el identificador del detalle de catálogos, dado el identificador del catálogo y su nombre.
        /// </summary>
        /// <param name="iccatalogo">Identificador del catálogo.</param>
        /// <returns>string</returns>
        public static string FindPorNombre(long iccatalogo, string inombre)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tgencatalogodetalle> control = null;

            control = contexto.tgencatalogodetalle.AsNoTracking().Where(x => x.ccatalogo == iccatalogo && x.nombre.Equals(inombre)).ToList();
            if (control.Count == 0)
            {
                return "";
            }
            return control[0].cdetalle;
        }


        /// <summary>
        /// Obtiene el código legal del detalle de catálogos, dado el catálogo y su identificador.
        /// </summary>
        /// <param name="iccatalogo">Identificador del catálogo.</param>
        /// <returns>string</returns>
        public static string obtenerCodigoLegal(long iccatalogo, string icdetalle)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tgencatalogodetalle> control = null;

            control = contexto.tgencatalogodetalle.AsNoTracking().Where(x => x.ccatalogo == iccatalogo && x.cdetalle.Equals(icdetalle)).ToList();
            if (control.Count == 0)
            {
                return "";
            }
            return control[0].clegal;
        }


    }
}
