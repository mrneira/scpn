using modelo;
using modelo.helper;
using System;
using System.Collections.Concurrent;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.generales {
    /// <summary>
    /// Clase que implemeta, consultas manuales de la tabla TgenParametros.
    /// </summary>
    public class TgenParametrosDal {

        /// <summary>
        /// Metodo que entrega la definicion de un parametro general de la aplicaion. Busca los datos en cahce, si no encuentra los datos en cache busca en la base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="codigo">Codigo de parametro.</param>
        /// <param name="compania">Codigo de compania.</param>
        /// <returns></returns>
        public static tgenparametros Find(string codigo, int compania) {
            tgenparametros obj = null;
            string key = "" + codigo + "^" + compania;
            CacheStore cs = CacheStore.Instance;

            obj = (tgenparametros)cs.GetDatos("tgenparametros", key);
            if (obj == null) {
                ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tgenparametros");
                obj = FindInDataBase(codigo, compania);
                Sessionef.GetAtlasContexto().Entry(obj).State = System.Data.Entity.EntityState.Detached;
                m.TryAdd(key, obj);
                cs.PutDatos("tgentasareferencial", m);
            }
            return obj;
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de un parametro.
        /// </summary>
        /// <param name="codigo">Codigo de parametro.</param>
        /// <param name="compania">Codigo de compania.</param>
        /// <returns>TgenParametrosDto</returns>
        public static tgenparametros FindInDataBase(string codigo, int compania) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tgenparametros obj = null;

            obj = contexto.tgenparametros.AsNoTracking().Where(x => x.codigo == codigo && x.ccompania == compania).SingleOrDefault();
            if (obj == null) {
                throw new AtlasException("BGEN-006", "PARAMETRO NO DEFINIDO EN TGENPARAMETROS CODIGO: {0} COMPANIA: {1}", codigo, compania);
            }
            EntityHelper.SetActualizar(obj);
            return obj;
        }

        /// <summary>
        /// Metodo que entrega el valor en texto de un parametro.
        /// </summary>
        /// <param name="codigo">Codigo de parametro.</param>
        /// <param name="compania">Codigo de compania.</param>
        /// <returns></returns>
        public static String GetValorTexto(string codigo, int compania) {
            tgenparametros obj = null;

            obj = TgenParametrosDal.Find(codigo, compania);
            if (obj == null) {
                throw new AtlasException("BGEN-014", "VALOR EN TEXTO PARA EL PARAMETRO NO DEFINIDO EN TGENPARAMETROS CODIGO: {0} COMPANIA: {1}", codigo, compania);
            }
            return obj.texto;
        }

        /// <summary>
        /// Metodo que entrega el valor numerico de un parametro.
        /// </summary>
        /// <param name="codigo">Codigo de parametro.</param>
        /// <param name="compania">Codigo de compania.</param>
        /// <returns></returns>
        public static decimal GetValorNumerico(string codigo, int compania) {
            tgenparametros obj = null;

            obj = TgenParametrosDal.Find(codigo, compania);
            if (obj == null) {
                throw new AtlasException("BGEN-013",
                        "VALOR NUMERICO PARA EL PARAMETRO NO DEFINIDO EN TGENPARAMETROS CODIGO: {0} COMPANIA: {1}", codigo, compania);
            }
            return (decimal)obj.numero;
        }

    }
}
