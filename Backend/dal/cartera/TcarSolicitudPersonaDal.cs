using modelo;
using modelo.servicios;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using util.servicios.ef;

namespace dal.cartera {
    public class TcarSolicitudPersonaDal {

        /// <summary>
        /// Consulta los datos de las personas asociadas a una solicitud de credito.
        /// </summary>
        /// <param name="csolicitud">Numero de solicitud.</param>
        /// <param name="ccompania">Numero de solicitud.</param>
        /// <returns></returns>
        public static IList<tcarsolicitudpersona> Find(long csolicitud, int ccompania)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcarsolicitudpersona.AsNoTracking().Where(x => x.csolicitud == csolicitud &&
                                                                x.ccompania == ccompania).ToList();
        }

        private static string SQL_DEL = "delete from TcarSolicitudPersonaDto t where t.csolicitud = @csolicitud and t.ccompania = @ccompania";

        /// <summary>
        /// Elimina registros asociados a una solicitud.
        /// </summary>
        /// <param name="csolicitud">Numero de solicitud.</param>
        /// <param name="ccompania">Codigo de compania asociada a la solicitud.</param>
        public static void Delete(long csolicitud, int ccompania)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(SQL_DEL, new SqlParameter("csolicitud", csolicitud), new SqlParameter("ccompania", ccompania));
        }

        /// <summary>
        /// Metodo que transforma los datos de personas asociados a una solicitud de credito, a una lista de personas asociadas a una operacion de cartera.
        /// </summary>
        /// <param name="ltcarsolicitudpersona">Lista de personas asociadas a la solicitud.</param>
        /// <param name="coperacion">Numero de operacion de cartera.</param>
        /// <returns></returns>
        public static List<tcaroperacionpersona> ToTcarOperacionPersona(IList<tcarsolicitudpersona> ltcarsolicitudpersona, string coperacion)
        {
            List<tcaroperacionpersona> lpersona = new List<tcaroperacionpersona>();
            foreach (tcarsolicitudpersona solper in ltcarsolicitudpersona) {
                tcaroperacionpersona t = new tcaroperacionpersona();
                t.coperacion = coperacion;
                t.cpersona = solper.cpersona;
                t.ccompania = solper.ccompania;
                t.crelacion = solper.crelacion;
                lpersona.Add(t);
            }
            return lpersona;
        }

        private static string SQL_GAR = "select pa.cpersona as cpersona, " +
                                                "count(pa.caporte) as naportes, " +
                                                "sum(pa.aportepatronal + pa.aportepersonal + pa.ajuste) as TAPORTE " +
                                        "from tcarsolicitud cs, tcarsolicitudpersona cp, tsoccesantia sc, tpreaporte pa " +
                                        "where cs.csolicitud = cp.csolicitud " +
                                        "and   cp.csolicitud = @csolicitud " +
                                        "and   cp.ccompania = @ccompania " +
                                        "and   cp.crelacion = @codigogarante " +
                                        "and   cp.cpersona = sc.cpersona " +
                                        "and   sc.verreg = 0 " +
                                        "and   sc.cpersona = pa.cpersona " +
                                        "and   cp.ccompania = pa.ccompania " +
                                        "and   pa.activo = 1 " +
                                        "and   pa.valido = 1 " +
                                        "group by pa.cpersona";
        /// <summary>
        /// Consulta los datos de las personas de tipo garante asociados a una solicitud de credito.
        /// </summary>
        /// <param name="csolicitud">Numero de solicitud.</param>
        /// <param name="ccompania">Numero de solicitud.</param>
        /// <returns></returns>
        public static IList<Dictionary<string, object>> FindGarantesBySolicitud(long csolicitud, int ccompania)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            int codigogarante = (int)TcarParametrosDal.GetValorNumerico("CODIGO-GARANTE", ccompania);

            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@csolicitud"] = csolicitud;
            parametros["@ccompania"] = ccompania;
            parametros["@codigogarante"] = codigogarante;

            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, SQL_GAR);
            IList<Dictionary<string, object>> ldatos = ch.GetRegistrosDictionary();
            return ldatos;
        }


        private static string SQL_SOL = "select cs.csolicitud as csolicitud, es.nombre as estado " +
                                        "from tcarsolicitud cs, tcarsolicitudpersona cp, tcarestatussolicitud es " +
                                        "where cs.csolicitud  = cp.csolicitud " +
                                        "and   cs.csolicitud != @csolicitud " +
                                        "and   cp.cpersona    = @cpersona " +
                                        "and   cp.ccompania   = @ccompania " +
                                        "and   cp.crelacion   = @codigogarante " +
                                        "and   cs.cestatussolicitud = es.cestatussolicitud " +
                                        "and   cs.cestatussolicitud not in ('ANU','APR','CAN','NEG','REP','SIM')";
        /// <summary>
        /// Consulta los datos de las personas de tipo garante asociados a una solicitud de credito.
        /// </summary>
        /// <param name="csolicitud">Numero de solicitud.</param>
        /// <param name="cpersona">Codigo de garante.</param>
        /// <param name="ccompania">Numero de solicitud.</param>
        /// <returns></returns>
        public static IList<Dictionary<string, object>> FindGaranteOnSolicitudes(long csolicitud, long cpersona, int ccompania)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            int codigogarante = (int)TcarParametrosDal.GetValorNumerico("CODIGO-GARANTE", ccompania);

            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@csolicitud"] = csolicitud;
            parametros["@cpersona"] = cpersona;
            parametros["@ccompania"] = ccompania;
            parametros["@codigogarante"] = codigogarante;

            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, SQL_SOL);
            IList<Dictionary<string, object>> ldatos = ch.GetRegistrosDictionary();
            return ldatos;
        }
    }
}
