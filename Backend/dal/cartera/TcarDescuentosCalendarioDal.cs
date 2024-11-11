using modelo;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.cartera {

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TcarDescuentosCalendarioDto.
    /// </summary>
    public class TcarDescuentosCalendarioDal {

        /// <summary>
        /// Metodo que entrega el listado de fechas de ejecucion de de descuentos. Busca los datos en cache, si no encuentra los datos en cache
        /// busca en la base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="anio">Anio de generacion de descuentos.</param>
        /// <returns>IList<TcarDescuentosCalendarioDto></returns>
        public static IList<tcardescuentoscalendario> Find(int anio)
        {
            IList<tcardescuentoscalendario> ldatos = null;
            string key = "tcardescuentoscalendario";
            CacheStore cs = CacheStore.Instance;
            ldatos = (IList<tcardescuentoscalendario>)cs.GetDatos("tcardescuentoscalendario", key);
            if (ldatos == null) {
                ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tcardescuentoscalendario");
                ldatos = FindInDatabase(anio);
                m[key] = ldatos;
                cs.PutDatos("tcardescuentoscalendario", m);
            }
            return ldatos;
        }

        /// <summary>
        /// Busca en la base de datos la lista de archivos.
        ///// </summary>
        /// <param name="anio">Anio de generacion de descuentos.</param>
        /// <returns>TcarDescuentosCalendarioDto</returns>
        private static IList<tcardescuentoscalendario> FindInDatabase(int anio)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tcardescuentoscalendario> ldatos = contexto.tcardescuentoscalendario.AsNoTracking().Where(x => x.anio == anio && x.verreg == 0).ToList();
            return ldatos;
        }

        /// <summary>
        /// Busca en la base de datos el archivo de descuentos.
        ///// </summary>
        /// <param name="fejecucion">Fecha de generacion de descuentos.</param>
        /// <returns>TcarDescuentosCalendarioDto</returns>
        public static tcardescuentoscalendario FindEjecucion(int fejecucion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcardescuentoscalendario obj = contexto.tcardescuentoscalendario.AsNoTracking().Where(x => x.fejecucion == fejecucion && x.verreg == 0).SingleOrDefault();
            return obj;
        }
    }
}
