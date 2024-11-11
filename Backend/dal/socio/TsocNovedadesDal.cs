using modelo;
using modelo.helper;
using modelo.servicios;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using util.servicios.ef;

namespace dal.socio {
    /// <summary>
    /// Clase que implemeta, dml's de la tabla novedades
    /// </summary>
    public class TsocNovedadesDal {
        /// <summary>
        /// Obtiene las retenciones del socio
        /// </summary>
        /// <param name="cpersona"></param>
        /// <param name="ccompania"></param>
        /// <returns></returns>
        public static IList<tsocnovedadades> FindToRetenciones(long cpersona, int ccompania)
        {
            IList<tsocnovedadades> ldata = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            ldata = contexto.tsocnovedadades.Where(x => x.ccompania == ccompania && x.cpersona == cpersona && x.retencion == true).ToList();
            return ldata;
        }


        public static IList<tsocnovedadades> FindToRetencionesNoPagadas(long cpersona, int ccompania) {
            IList<tsocnovedadades> ldata = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            ldata = contexto.tsocnovedadades.Where(x => x.ccompania == ccompania && x.cpersona == cpersona && x.retencion == true && x.pagado == false).ToList();
            return ldata;
        }

        /// <summary>
        /// Obtiene novedades del socio
        /// </summary>
        /// <param name="cpersona"></param>
        /// <param name="ccompania"></param>
        /// <returns></returns>
        public static IList<tsocnovedadades> FindToNovedades(long cpersona, int ccompania)
        {
            IList<tsocnovedadades> ldata = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            ldata = contexto.tsocnovedadades.Where(x => x.ccompania == ccompania && x.cpersona == cpersona && x.retencion == false).ToList();
            return ldata;
        }

        public static tsocnovedadades FindToNovedades(long cpersona, int ccompania, int cnovedad)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tsocnovedadades obj = contexto.tsocnovedadades.Where(x => x.ccompania == ccompania && x.cpersona == cpersona && x.cnovedad == cnovedad).SingleOrDefault();
            if (obj != null) {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

        public static IList<tsocnovedadades> FindToNovedadesPrestamos(long cpersona, int ccompania)
        {
            // Tipos de novedades de prestamos
            List<string> ltiposnovedades = new List<string> { "15", "16", "17", "18" };
            IList<tsocnovedadades> ldata = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            ldata = contexto.tsocnovedadades.Where(x => x.ccompania == ccompania && x.cpersona == cpersona && x.retencion == false && ltiposnovedades.Contains(x.cdetallenovedad)).ToList();
            return ldata;
        }

        /// <summary>
        /// Obtiene las novedades activas del socio
        /// </summary>
        /// <param name="cpersona"></param>
        /// <param name="ccompania"></param>
        /// <returns></returns>
        public static List<tsocnovedadades> FindToNovedadesACT(long cpersona, int ccompania)
        {
            List<tsocnovedadades> ldata = null;
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();
            ldata = contexto.tsocnovedadades.Where(x => x.ccompania == ccompania && x.cpersona == cpersona && x.estado.Equals("ACT") && x.valor > 0).ToList();
            return ldata;
        }

        /// <summary>
        /// Obtiene las novedades activas del socio por tipo de novedad
        /// </summary>
        /// <param name="cpersona"></param>
        /// <param name="ccompania"></param>
        /// <returns></returns>
        public static List<tsocnovedadades> FindToTipoNovedadACT(long cpersona, int ccompania, string tiponovedad) {
            List<tsocnovedadades> ldata = null;
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();
            ldata = contexto.tsocnovedadades.Where(x => x.ccompania == ccompania && x.cpersona == cpersona && x.estado.Equals("ACT") && x.ccatalogonovedad == 220 && x.cdetallenovedad == tiponovedad).ToList();
            return ldata;
        }

        /// <summary>
        /// Obtiene las novedades del socio
        /// </summary>
        /// <param name="cpersona"></param>
        /// <param name="ccompania"></param>
        /// <returns></returns>
        public static List<tsocnovedadades> FindToActualizar(long cpersona, int ccompania)
        {
            List<tsocnovedadades> ldata = null;
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();
            ldata = contexto.tsocnovedadades.Where(x => x.ccompania == ccompania && x.cpersona == cpersona).ToList();
            return ldata;
        }
        /// <summary>
        /// Crea una instancia nueva de novedades 
        /// </summary>
        /// <returns></returns>
        public static tsocnovedadades Crear()
        {
            tsocnovedadades novedades = new tsocnovedadades();
            return novedades;
        }
        /// <summary>
        /// Elimina novedades automatcas (novedades generadas desde otros modulos)
        /// </summary>
        /// <param name="coperacion"></param>
        /// <param name="mensaje"></param>
        public static void Reversar(string coperacion, string mensaje)
        {
            tsocnovedadades novedad = FindToNovedadesAutomatica(coperacion, mensaje);
            if (novedad != null) {
                Delete(novedad);
            }
        }
        /// <summary>
        /// Obtiene las novedades automaticas
        /// </summary>
        /// <param name="coperacion"></param>
        /// <param name="mensaje"></param>
        /// <returns></returns>
        private static tsocnovedadades FindToNovedadesAutomatica(string coperacion, string mensaje)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tsocnovedadades obj = contexto.tsocnovedadades.Where(x => x.automatico == true && x.coperacion == coperacion).SingleOrDefault();
            return obj;
        }

        private static string SQL_novedades = " SELECT isnull(sum(valor),0) as valor FROM tsocnovedadades " +
                                              "WHERE cdetallenovedad IN('15','16','17','18') " +
                                              "AND cpersona = @cpersona " +
                                              "AND ccompania = @ccompania ";
        /// <summary>
        /// Obtiene nobedades automaticas generadas desde el modulo de prestamos
        /// </summary>
        /// <param name="cpersona"></param>
        /// <param name="ccompania"></param>
        /// <returns></returns>
        public static decimal GetToPrestamos(long cpersona, int ccompania)
        {
            decimal valor = 0;
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@cpersona"] = cpersona;
            parametros["@ccompania"] = ccompania;
            // RRO 20211104 --------------------------------------------------------------
            // el monto es 0 cuando esta REINCORPORADO - 0001229
            SQL_novedades += " AND estado = 'ACT' ";
            // RRO 20211104 --------------------------------------------------------------

            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, SQL_novedades);
            IList<Dictionary<string, object>> ldatos = ch.GetRegistrosDictionary();
            valor = decimal.Parse(ldatos[0]["valor"].ToString());
            return valor;
        }

        /// <summary>
        /// Scrip que genera la eliminacion de las novedades automaticas
        /// </summary>
        /// <param name="tsocnovedadades"></param>
        public static void Delete(tsocnovedadades tsocnovedadades)
        {
            String JPQL_DELETE = "delete from tsocnovedadades where cnovedad = @cnovedad and cpersona = @cpersona and ccompania = @ccompania";
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(JPQL_DELETE, new SqlParameter("cnovedad", tsocnovedadades.cnovedad),
                                                             new SqlParameter("cpersona", tsocnovedadades.cpersona),
                                                             new SqlParameter("ccompania", tsocnovedadades.ccompania));
        }

        /// <summary>
        ///  Consulta las novedades por persona, compañia, estado y tipo novedad
        ///  RRO 20211104
        /// </summary>
        /// <param name="cpersona"></param>
        /// <param name="ccompania"></param>
        /// <param name="estado"></param>
        /// <param name="tiponovedad"></param>
        /// <returns></returns>
        public static List<tsocnovedadades> FindToSocioNovedad(long cpersona, int ccompania, string estado, string[] tiponovedad)
        {
            List<tsocnovedadades> ldata = null;
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();
            ldata = contexto.tsocnovedadades.Where(x => x.ccompania == ccompania && x.cpersona == cpersona && x.estado.Equals(estado) && x.ccatalogonovedad == 220 && tiponovedad.Contains(x.cdetallenovedad)).ToList();
            return ldata;
        }
    }
}
