using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using util;
using util.servicios.ef;
using modelo;
using System.Data.SqlClient;

namespace dal.monetario {

    public class TmonComponenteTransaccionDal {

        /// <summary>
        /// Metodo que entrega la definicion de una rubro asociado a una transaccion.. Busca los datos en cahce, si no encuentra los datos en  cache busca en la base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="tgentransaction">Objeto que contien datos definicion de una transaccion.</param>
        /// <returns>IList<TmonComponenteTransaccionDto></returns>
        public static IList<tmoncomponentetransaccion> Find(tgentransaccion tgentransaction) {
            IList<tmoncomponentetransaccion> ldata = null;
            // Si maneja cache de transaccion.
            String key = "" + tgentransaction.cmodulo + "^" + tgentransaction.ctransaccion ;
            CacheStore cs = CacheStore.Instance;
            ldata = (IList<tmoncomponentetransaccion>)cs.GetDatos("tmoncomponentetransaccion", key);
            if (ldata == null) {
                ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tmoncomponentetransaccion");
                ldata = TmonComponenteTransaccionDal.FindInDataBase(tgentransaction);
                m[key] = ldata;
                cs.PutDatos("tmoncomponentetransaccion", m);
            }
            return ldata;
        }

        private static string SQL = "select * from TmonComponenteTransaccion t where t.ctransaccion = @ctransaccion " +
            "and t.cmodulo = @cmodulo and coalesce(t.activo,0) = @activo order by t.orden ";

        /// <summary>
        /// Consulta en la base de datos la definicion de componenetes de negocio monetario por transaccion.
        /// </summary>
        /// <param name="tgentransaction">Objeto que contien datos definicion de una transaccion.</param>
        /// <returns>IList<TmonComponenteTransaccionDto></returns>
        public static IList<tmoncomponentetransaccion> FindInDataBase(tgentransaccion tgentransaction) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tmoncomponentetransaccion> lista = new List<tmoncomponentetransaccion>();
            try {
                lista = contexto.tmoncomponentetransaccion.SqlQuery(SQL, new SqlParameter("@ctransaccion", tgentransaction.ctransaccion),
                                                                        new SqlParameter("@cmodulo", tgentransaction.cmodulo),
                                                                        new SqlParameter("@activo",true)).ToList();
                //if (lista.Count <= 0) {
                //    return null;
                //}
            } catch (System.InvalidOperationException) {
                throw;
            }
            return lista;
        }

    }

}
