using modelo;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.servicios.ef;

namespace dal.generales {
    /// <summary>
    /// Clase que implementa dml's manuales contra la base de datos.
    /// </summary>
    public class TgenCompConsultaDal {
        /// <summary>
        /// Metodo que entrega la definicion de una transaccion. Si la transaccion maneja cache, busca los datos en cahce, si no encuentra los datos en cache busca en la base, 
        /// alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="tgentransaction">Objeto que contiene la definicion de una transaccion.</param>
        /// <param name="canal">Codigo de canal.</param>
        /// <param name="cconsulta">Codigo de componente de consulta.</param>
        /// <returns></returns>
        public static IList<tgencompconsulta> Find(tgentransaccion tgentransaccion, String canal, String cconsulta) {
            IList<tgencompconsulta> ldata = null;
            // Si maneja cache de transaccion.
            String key = tgentransaccion.cmodulo + "^" + tgentransaccion.ctransaccion + "^" + canal + "^" + cconsulta;
            CacheStore cs = CacheStore.Instance;
            ldata = (IList<tgencompconsulta>)cs.GetDatos("tgencompconsulta", key);
            if (ldata == null || ldata.Count == 0) {
                ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tgencompconsulta");
                ldata = TgenCompConsultaDal.FindInDataBase(tgentransaccion, canal, cconsulta);
                m[key] = ldata;
                cs.PutDatos("tgencompconsulta", m);
            }

            return ldata;
        }


        /// <summary>
        /// Busca en la base de datos definicon de un componente de consulta.
        /// </summary>
        /// <param name="tgentransaction">Objeto que contiene la definicion de una transaccion.</param>
        /// <param name="ccanal">Codigo de canal.</param>
        /// <param name="cconsulta">Codigo de consulta.</param>
        /// <returns></returns>
        public static IList<tgencompconsulta> FindInDataBase(tgentransaccion tgentransaccion, string ccanal, string cconsulta) {
            IList<tgencompconsulta> ldata = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();

            ldata = contexto.tgencompconsulta.AsNoTracking().Where(x => x.ctransaccion == tgentransaccion.ctransaccion 
                                                                     && x.cmodulo == tgentransaccion.cmodulo 
                                                                     && x.cconsulta == cconsulta 
                                                                     && x.ccanal == ccanal).ToList();
            return ldata;
        }
    }

}
