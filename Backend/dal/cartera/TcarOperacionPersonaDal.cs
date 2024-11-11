using modelo;
using modelo.servicios;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.cartera {
    public class TcarOperacionPersonaDal {

        /// <summary>
        /// Entrega una lista de personas relacionadas a una operacion de cartera.
        /// </summary>
        /// <param name="coperacion">Numero de operacion de cartera.</param>
        /// <returns></returns>
        public static List<tcaroperacionpersona> Find(String coperacion)
        {
            List<tcaroperacionpersona> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tcaroperacionpersona.AsNoTracking().Where(x => x.coperacion == coperacion).ToList();
            return obj;
        }

        private static string SQL_GAR = "select sc.cpersona as cpersona " +
                                            "from  tcaroperacion op,tcaroperacionpersona pe,tsoccesantia sc " +
                                            "where pe.cpersona = sc.cpersona " +
                                            "and   op.coperacion = pe.coperacion " +
                                            "and   op.coperacion = @coperacion " +
                                            "and   pe.ccompania = @ccompania " +
                                            "and   pe.crelacion = @codigogarante " +
                                            "and   sc.verreg = 0";

        public static IList<Dictionary<string, object>> GaranteOperacion(string coperacion, int ccompania)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            int codigogarante = (int)TcarParametrosDal.GetValorNumerico("CODIGO-GARANTE", ccompania);

            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@coperacion"] = coperacion;
            parametros["@ccompania"] = ccompania;
            parametros["@codigogarante"] = codigogarante;

            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, SQL_GAR);
            IList<Dictionary<string, object>> ldatos = ch.GetRegistrosDictionary();
            return ldatos;
        }

        /// <summary>
        /// Busca y entrega si el garante se encuentra en estado activo.
        /// </summary>
        public static long FindGarante(string coperacion, int ccompania)
        {
            long garante = 0;
            IList<Dictionary<string, object>> lgarantes = GaranteOperacion(coperacion, ccompania);
            foreach (Dictionary<string, object> obj in lgarantes) {
                garante = Int32.Parse(obj["cpersona"].ToString());
                break;
            }
            return garante;
        }

        private static string SQL_OPE = "select op.coperacion, es.nombre " +
                                        "from  tcaroperacion op, tcaroperacionpersona pe, tcarestatus es " +
                                        "where op.coperacion = pe.coperacion " +
                                        "and   pe.cpersona  = @cpersona " +
                                        "and   pe.ccompania = @ccompania " +
                                        "and   pe.crelacion = @codigogarante " +
                                        "and   op.cestatus = es.cestatus " +
                                        "and   es.cestatus not in ('APR','CAN','NEG')";
        /// <summary>
        /// Consulta los datos de las personas de tipo garante asociados a una solicitud de credito.
        /// </summary>
        /// <param name="csolicitud">Numero de solicitud.</param>
        /// <param name="ccompania">Numero de solicitud.</param>
        /// <returns></returns>
        public static IList<Dictionary<string, object>> FindGaranteOnSolicitudes(long cpersona, int ccompania)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            int codigogarante = (int)TcarParametrosDal.GetValorNumerico("CODIGO-GARANTE", ccompania);

            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@cpersona"] = cpersona;
            parametros["@ccompania"] = ccompania;
            parametros["@codigogarante"] = codigogarante;

            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, SQL_OPE);
            IList<Dictionary<string, object>> ldatos = ch.GetRegistrosDictionary();
            return ldatos;
        }

        /// <summary>
        /// Clona las personas relacionadas de la operacion anterior a la nueva operacion.
        /// </summary>
        /// <param name="coperacionAnterior"></param>
        /// <param name="coperacionnueva"></param>
        public static void ClonarTcarOperacionPersonaArregloPago(String coperacionAnterior, String coperacionnueva)
        {
            List<tcaroperacionpersona> lpersona = new List<tcaroperacionpersona>();
            List<tcaroperacionpersona> lpersonaanteriores = TcarOperacionPersonaDal.Find(coperacionAnterior);
            foreach (tcaroperacionpersona obj in lpersonaanteriores) {
                tcaroperacionpersona nuevo = (tcaroperacionpersona)obj.Clone();
                nuevo.coperacion = coperacionnueva;
                lpersona.Add(nuevo);
                Sessionef.Save(nuevo);
            }
        }

        private static String JPQL_DELETE_ARREGLO_PAGOS = "delete from tcaroperacionpersona where coperacion = @coperacion ";

        /// <summary>
        /// Ejecuta reverso de arreglo de pagos de la nueva operacion.
        /// </summary>
        /// <param name="coperacion">Numero de operacion creada en el arreglo de pagos.</param>
        public static void ReversoArregloPagos(String coperacion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(JPQL_DELETE_ARREGLO_PAGOS, new SqlParameter("coperacion", coperacion));
        }

    }


}
