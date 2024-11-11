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

    public class TgenCompCodigoConsultaDal {

        /// <summary>
        /// Metodo que entrega la definicion de una transaccion. Si la transaccion maneja cache, busca los datos en cahce, si no encuentra los datos en cache busca en la base, 
        /// alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="codigoconsulta">Codigo de consulta.</param>
        /// <param name="canal">Codigo de canal.</param>
        /// <returns></returns>
        public static IList<tgencompcodigoconsulta> Find(String codigoconsulta, String canal) {
            IList<tgencompcodigoconsulta> ldata = null;
            // Si maneja cache de transaccion.
            String key = codigoconsulta + "^" + canal;
            CacheStore cs = CacheStore.Instance;
            ldata = (IList<tgencompcodigoconsulta>)cs.GetDatos("tgencompcodigoconsulta", key);
            if (ldata == null) {
                ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tgencompcodigoconsulta");
                ldata = FindInDataBase(codigoconsulta, canal);
                m[key] = ldata;
                cs.PutDatos("tgencompcodigoconsulta", m);
            }
            return ldata;
        }

        /// <summary>
        /// Consulta en la base de datos una lista de componentes de consulta asociados a un codigo de consulta.
        /// </summary>
        /// <param name="codigoconsulta">Codigo de consulta.</param>
        /// <param name="canal">Codigo de canal.</param>
        /// <returns></returns>
        public static IList<tgencompcodigoconsulta> FindInDataBase(String codigoconsulta, String canal) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tgencompcodigoconsulta> ldata = null;

            ldata = contexto.tgencompcodigoconsulta.AsNoTracking().Where(x => x.cconsulta == codigoconsulta && x.ccanal == canal && x.activo == true).OrderBy(o => o.orden).ToList();

            return ldata;
        }


    }
}
