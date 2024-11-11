using modelo;
using System;
using System.Collections.Concurrent;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.prestaciones {
    /// <summary>
    /// Clase que implemeta, dml's de la tabla parametros de la liquidacion 
    /// </summary>
    public class TpreParametrosDal {
        /// <summary>
        /// Metodo que entrega la definicion de un parametro general de la aplicaion. Busca los datos en cahce, si no encuentra los datos en 
        /// cache busca en la base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="codigo">Codigo de parametro.</param>
        /// <param name="ccompania">Codigo de compania a la que pertenece el parametro.</param>
        /// <returns></returns>
        public static tpreparametros Find(string codigo) {
            try {
                tpreparametros obj = null;
                string key = codigo;
                CacheStore cs = CacheStore.Instance;
                obj = (tpreparametros)cs.GetDatos("tpreparametros", key);
                if(obj == null) {
                    ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tpreparametros");
                    obj = TpreParametrosDal.FindInDataBase(codigo);
                    m[key] = obj;
                    cs.PutDatos("tpreparametros", m);
                }
                return obj;
            } catch {
                return null;
            }
        }

        /// <summary>
        /// Obtiene los parametros consultando a la base de datos refresxando el cache
        /// </summary>
        /// <param name="codigo"></param>
        /// <param name="ccompania"></param>
        /// <returns></returns>
        public static tpreparametros FindInDataBase(string codigo) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tpreparametros obj = contexto.tpreparametros.AsNoTracking().Where(x => x.codigo.Equals(codigo) && x.estado == true).SingleOrDefault();
            if(obj == null) {
                throw new AtlasException("PRE-023", "PARÁMETRO NO DEFINIDO EN TPREPARAMETROS CÓDIGO: {0}", codigo);
            }
            return obj;
        }

        /// <summary>
        /// Metodo que entrega el valor en texto de un parametro.
        /// </summary>
        /// <param name="codigo">Codigo de parametro.</param>
        /// <param name="compania">Codigo de compania asociado al parametro.</param>
        /// <returns></returns>
        public static string GetValorTexto(string codigo) {
            tpreparametros obj = null;
            obj = TpreParametrosDal.Find(codigo);
            if(obj.texto == null) {
                throw new AtlasException("PRE-024", "VALOR EN TEXTO PARA EL PARAMETRO NO DEFINIDO EN TPREPARAMETROS CÓDIGO: {0}", codigo);
            }
            return obj.texto;
        }

        /// <summary>
        /// Metodo que entrega el valor Decimal de un parametro.
        /// </summary>
        /// <param name="codigo">Codigo de parametro.</param>
        /// <param name="compania">Codigo de compania asociado al parametro.</param>
        /// <returns></returns>
        public static decimal GetValorNumerico(string codigo) {
            tpreparametros obj = null;
            obj = TpreParametrosDal.Find(codigo);
            if(obj.numero == null) {
                throw new AtlasException("PRE-025", "VALOR NUMÉRICO PARA EL PARÁMETRO NO DEFINIDO EN TPREPARAMETROS CÓDIGO: {0}", codigo);
            }
            return (decimal)obj.numero;
        }

        /// <summary>
        /// Metodo que entrega el valor enterio de un parametro numerico.
        /// </summary>
        /// <param name="codigo">Codigo de parametro.</param>
        /// <param name="compania">Codigo de compania asociado al parametro</param>
        /// <returns></returns>
        public static int GetInteger(string codigo) {
            tpreparametros obj = null;
            obj = TpreParametrosDal.Find(codigo);
            if(obj.numero == null || obj.numero<=0) {
                throw new AtlasException("PRE-026", "VALOR NUMÉRICO PARA EL PARAMETRO NO DEFINIDO EN TPREPARAMETROS CÓDIGO: {0}", codigo);
            }
            return Int32.Parse(Math.Truncate((decimal)obj.numero).ToString());
        }
    }
}
