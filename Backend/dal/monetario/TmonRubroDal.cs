using modelo;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using util;
using util.servicios.ef;


namespace dal.monetario {

    /// <summary>
    /// Clase que implemeta, consultas manuales de la tabla TmonRubro.
    /// </summary>
    public class TmonRubroDal {

        /// <summary>
        /// Metodo que entrega la definicion de una rubro asociado a una transaccion.. Busca los datos en cahce, si no encuentra los datos en  cache busca en la base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="tgentransaction">Objeto que contien datos definicion de una transaccion.</param>
        /// <param name="crubro">Codigo de rubro.</param>
        /// <returns>IList<TmonRubroDto></returns>
        public static IList<tmonrubro> Find(tgentransaccion tgentransaction, int crubro)
        {
            IList<tmonrubro> ldata = null;
            // Si maneja cache de transaccion.
            String key = "" + tgentransaction.cmodulo + "^" + tgentransaction.ctransaccion + "^" + crubro;
            CacheStore cs = CacheStore.Instance;
            ldata = (IList<tmonrubro>)cs.GetDatos("tmonrubro", key);
            if (ldata == null) {
                ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tmonrubro");
                ldata = TmonRubroDal.FindInDataBase(tgentransaction.cmodulo, tgentransaction.ctransaccion, crubro);
                m[key] = ldata;
                cs.PutDatos("tmonrubro", m);
            }
            return ldata;
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de un rubro.
        /// </summary>
        /// <param name="modulo">Codigo de modulo.</param>
        /// <param name="transaccion">Codigo de transaccion.</param>
        /// <param name="crubro">Codigo de rubro.</param>
        /// <returns></returns>
        public static IList<tmonrubro> FindInDataBase(int? modulo, int? transaccion, int crubro)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tmonrubro> lista = new List<tmonrubro>();
            try {
                lista = contexto.tmonrubro.Where(x => x.ctransaccion == transaccion.Value &&
                                                        x.cmodulo == modulo.Value &&
                                                        (x.crubro == crubro || x.crubropar == crubro)).OrderBy(x => x.crubro).ToList();
                if (lista.Count <= 0) {
                    throw new AtlasException("BMON-001", "RUBRO NO DEFINIDO EN TMONRUBRO MODULO: {0} TRANSACCION: {1} RUBRO:{2}", modulo, transaccion, crubro);
                }
            }
            catch (System.InvalidOperationException) {
                throw;
            }
            return lista;
        }

        /// <summary>
        /// Entrega la definicion de un rubro dada la transaccion y el codigo de rubro.
        /// </summary>
        /// <param name="tgentransaction">Defincion de una transaccion.</param>
        /// <param name="crubro">Codigo de rubro.</param>
        /// <returns></returns>
        public static tmonrubro FindTmonRubro(tgentransaccion tgentransaction, int crubro)
        {
            IList<tmonrubro> lrubros = TmonRubroDal.Find(tgentransaction, crubro);
            tmonrubro obj = null;
            foreach (tmonrubro tmonRubro in lrubros) {
                if (tmonRubro.crubro == crubro) {
                    obj = tmonRubro;
                    break;
                }
            }
            return obj;
        }

        /// <summary>
        /// Metodo que entrega la definicion de una rubro asociado a una transaccion.. Busca los datos en cahce, si no encuentra los datos en  cache busca en la base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="tgentransaction">Objeto que contien datos definicion de una transaccion.</param>
        /// <param name="crubro">Codigo de rubro.</param>
        /// <returns></returns>
        public static IList<tmonrubro> FindRubroBase(tgentransaccion tgentransaction, int crubro)
        {
            IList<tmonrubro> obj = null;
            if ((bool)tgentransaction.cache) {
                String key = "BASE" + tgentransaction.cmodulo + "^" + tgentransaction.ctransaccion + "^" + crubro;
                CacheStore cs = CacheStore.Instance;
                obj = (List<tmonrubro>)cs.GetDatos("tmonrubro", key);
                if (obj == null) {
                    obj = FindInDataBaseRubroBase(tgentransaction.cmodulo, tgentransaction.ctransaccion, crubro);
                    if (obj == null) {
                        return obj;
                    }
                    ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tmonrubro");
                    m[key] = obj;
                    cs.PutDatos("tmonrubro", m);
                }
            } else {
                obj = FindInDataBase(tgentransaction.cmodulo, tgentransaction.ctransaccion, crubro);
            }
            return obj;
        }


        //private static string HQL_RUBRO_BASE = "select t from TmonRubroDto t where t.ctransaccion = @ctransaccion and t.cmodulo = @cmodulo " +
        //    "and  t.rubromontobase = :crubromontobase order by t.pk.crubro ";

        /// <summary>
        /// Consulta en la base de datos la definicion de un rubro.
        /// </summary>
        /// <param name="modulo">Codigo de modulo.</param>
        /// <param name="transaccion">Codigo de transaccion.</param>
        /// <param name="crubrobase">Codigo de rubro base.</param>
        /// <returns></returns>
        public static IList<tmonrubro> FindInDataBaseRubroBase(int? modulo, int? transaccion, int? crubrobase)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tmonrubro> lista = new List<tmonrubro>();
            try {
                //lista = contexto.tmonrubro.Where(x => x.ctransaccion == transaccion.Value &&
                //                                        x.cmodulo == modulo.Value &&
                //                                        x.rubrom ).OrderBy(x => x.crubro).ToList();diza
                //if (lista.Count <= 0) {
                //    throw new AtlasException("BMON-001", "RUBRO NO DEFINIDO EN TMONRUBRO MODULO: {0} TRANSACCION: {1} RUBRO:{2}", modulo, transaccion, crubro);
                //}
            }
            catch (System.InvalidOperationException) {
                throw;
            }
            return lista;


            //IQuery qry = Sessionhb.GetSession().CreateQuery(TmonRubroDal.HQL_RUBRO_BASE);
            //qry.SetParameter("ctransaccion", transaccion);
            //qry.SetParameter("cmodulo", modulo);
            //qry.SetParameter("crubromontobase", crubrobase);
            //ldata = qry.List<TmonRubroDto>();
            //return ldata;
        }

        /// <summary>
        /// Metodo que entrega la definicion de una rubro asociado a una transaccion.. Busca los datos en cahce, si no encuentra los datos en  cache busca en la base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="tgentransaction">Objeto que contien datos definicion de una transaccion.</param>
        /// <returns></returns>
        public static IList<tmonrubro> Find(tgentransaccion tgentransaction)
        {
            IList<tmonrubro> ldata = null;
            // Si maneja cache de transaccion.
            String key = "" + tgentransaction.cmodulo + "^" + tgentransaction.ctransaccion;
            CacheStore cs = CacheStore.Instance;
            ldata = (IList<tmonrubro>)cs.GetDatos("tmonrubro", key);
            if (ldata == null) {
                ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tmonrubro");
                ldata = TmonRubroDal.FindInDataBase(tgentransaction.cmodulo, tgentransaction.ctransaccion);
                m[key] = ldata;
                cs.PutDatos("tmonrubro", m);
            }
            return ldata;
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de un rubro.
        /// </summary>
        /// <param name="modulo">Codigo de modulo.</param>
        /// <param name="transaccion">Codigo de transaccion.</param>
        /// <param name="crubro">Codigo de rubro.</param>
        /// <returns></returns>
        public static IList<tmonrubro> FindInDataBase(int? modulo, int? transaccion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tmonrubro> lista = new List<tmonrubro>();
            try {
                lista = contexto.tmonrubro.Where(x => x.ctransaccion == transaccion.Value &&
                                                        x.cmodulo == modulo.Value).OrderBy(x => x.crubro).ToList();
                if (lista.Count <= 0) {
                    return null;
                }
            }
            catch (System.InvalidOperationException) {
                throw;
            }
            return lista;
        }

        private static String SQL_CONCEPTO = "select t from TmonRubroDto t where t.ctransaccion = @ctransaccion and t.cmodulo = @cmodulo "
                + "and t.crubro in " + "(select i.crubro from TmonRubroMapeoConceptoDto i where i.ctransaccion = t.ctransaccion"
                + "    and i.cmodulo = t.cmodulo and i.cconcepto = @cconcepto) " + "order by t.crubro ";

        /// <summary>
        /// Consulta en la base de datos la definicion de un rubro.
        /// </summary>
        /// <param name="modulo">Codigo de modulo.</param>
        /// <param name="transaccion">Codigo de transaccion.</param>
        /// <param name="cconcepto">Codigo de concepto.</param>
        /// <returns></returns>
        public static IList<tmonrubro> FindPorConcepto(int? modulo, int? transaccion, int cconcepto)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tmonrubro> lista = new List<tmonrubro>();
            try {
                lista = contexto.tmonrubro.SqlQuery(SQL_CONCEPTO, new SqlParameter("@ctransaccion", transaccion),
                                                                    new SqlParameter("@cmodulo", modulo),
                                                                    new SqlParameter("@cconcepto", cconcepto)).ToList();
                if (lista.Count <= 0) {
                    return null;
                }
            }
            catch (System.InvalidOperationException) {
                throw;
            }
            return lista;
        }

        /// <summary>
        /// Entrega la definicion de un rubro dada la transaccion y el codigo de rubro.
        /// </summary>
        /// <param name="modulo">Codigo de modulo.</param>
        /// <param name="transaccion">Codigo de transaccion.</param>
        /// <param name="csaldo">Codigo de saldo.</param>
        /// <returns></returns>
        public static tmonrubro FindPorSaldo(int? modulo, int? transaccion, string csaldo)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tmonrubro obj = contexto.tmonrubro.Where(x => x.cmodulo == modulo && x.ctransaccion == transaccion && x.csaldo == csaldo).SingleOrDefault();
            if (obj == null) {
                return obj;
            }
            return obj;
        }

    }
}
