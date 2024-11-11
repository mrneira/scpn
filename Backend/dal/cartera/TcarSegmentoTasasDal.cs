using modelo;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.cartera
{
    public class TcarSegmentoTasasDal
    {

        /// <summary>
        /// Metodo que entrega la definicion de TcarSegmentoTasas asociadas a un segmento de credito. Busca los datos en cahce, si no encuentra 
        /// los datos en cache busca en la base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="csegmento">Codigo de segmento de credito.</param>
        /// <param name="cmoneda">Codigo de tipo de moneda.</param>
        /// <returns></returns>
        public static IList<tcarsegmentotasas> Find(string csegmento, string cmoneda) {
            IList<tcarsegmentotasas> ldatos = null;
            string key = csegmento + "^" + cmoneda;
            CacheStore cs = CacheStore.Instance;
            ldatos = (IList<tcarsegmentotasas>)cs.GetDatos("tcarsegmentotasas", key);
            if (ldatos == null) {
                ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tcarsegmentotasas");
                ldatos = FindInDataBase(csegmento, cmoneda);
                m[key] = ldatos;
                cs.PutDatos("tcarsegmentotasas", m);
            }
            return ldatos;
        }        

        /// <summary>
        /// Consulta en la base de datos la definicion tasas asociadas a un segmento de credito.
        /// </summary>
        /// <param name="csegmento">Codigo de segmento de credito.</param>
        /// <param name="cmoneda">Codigo de tipo de moneda.</param>
        /// <returns></returns>
        public static IList<tcarsegmentotasas> FindInDataBase(string csegmento, string cmoneda) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcarsegmentotasas.AsNoTracking().Where(x => x.csegmento.Equals(csegmento) &&
                                                                x.cmoneda.Equals(cmoneda) &&
                                                                x.verreg == 0 &&
                                                                x.activo.Value.Equals(true)).ToList();
        }
    }

}
