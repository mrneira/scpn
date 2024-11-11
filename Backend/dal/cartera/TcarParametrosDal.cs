using modelo;
using System;
using System.Collections.Concurrent;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.cartera {
    /// <summary>
    /// Clase que implemeta, consultas manuales de la tabla TcarParametros.
    /// </summary>
    public class TcarParametrosDal {

        /// <summary>
        /// Metodo que entrega la definicion de un parametro general de la aplicaion. Busca los datos en cahce, si no encuentra los datos en 
        /// cache busca en la base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="codigo">Codigo de parametro.</param>
        /// <param name="ccompania">Codigo de compania a la que pertenece el parametro.</param>
        /// <returns></returns>
        public static tcarparametros Find(string codigo, int ccompania) {
            try {
                tcarparametros obj = null;
                string key = "" + codigo + "^" + ccompania;
                CacheStore cs = CacheStore.Instance;
                obj = (tcarparametros)cs.GetDatos("tcarparametros", key);
                if (obj == null) {
                    ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tcarparametros");
                    obj = TcarParametrosDal.FindInDataBase(codigo, ccompania);
                    m[key] = obj;
                    cs.PutDatos("tcarparametros", m);
                }
                return obj;
            } catch {
                return null;
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="codigo"></param>
        /// <param name="ccompania"></param>
        /// <returns></returns>
        public static tcarparametros FindInDataBase(string codigo, int ccompania) {            
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcarparametros obj = contexto.tcarparametros.AsNoTracking().Where(x => x.codigo.Equals(codigo) && x.ccompania == ccompania).SingleOrDefault();
            if(obj == null) { 
                throw new AtlasException("BCAR-0021", "PARAMETRO NO DEFINIDO EN TCARPARAMETROS CODIGO: {0} COMPANIA: {1}", codigo, ccompania);
            }
            return obj;
        }

        /// <summary>
        /// Metodo que entrega el valor en texto de un parametro.
        /// </summary>
        /// <param name="codigo">Codigo de parametro.</param>
        /// <param name="compania">Codigo de compania asociado al parametro.</param>
        /// <returns></returns>
        public static string GetValorTexto(string codigo, int compania) {
            tcarparametros obj = null;
            obj = TcarParametrosDal.Find(codigo, compania);
            if (obj.texto == null) {
                throw new AtlasException("BCAR-0022", "VALOR EN TEXTO PARA EL PARAMETRO NO DEFINIDO EN TCARPARAMETROS CODIGO: {0} COMPANIA: {1}", codigo, compania);
            }
            return obj.texto;
        }

        /// <summary>
        /// Metodo que entrega el valor Decimal de un parametro.
        /// </summary>
        /// <param name="codigo">Codigo de parametro.</param>
        /// <param name="compania">Codigo de compania asociado al parametro.</param>
        /// <returns></returns>
        public static decimal GetValorNumerico(string codigo, int compania) {
            tcarparametros obj = null;
            obj = TcarParametrosDal.Find(codigo, compania);
            if (obj.numero == null) {
                throw new AtlasException("BCAR-0023", "VALOR NUMERICO PARA EL PARAMETRO NO DEFINIDO EN TCARPARAMETROS CODIGO: {0} COMPANIA: {1}", codigo, compania);
            }
            return (decimal)obj.numero;
        }

        /// <summary>
        /// Metodo que entrega el valor enterio de un parametro numerico.
        /// </summary>
        /// <param name="codigo">Codigo de parametro.</param>
        /// <param name="compania">Codigo de compania asociado al parametro</param>
        /// <returns></returns>
        public static int GetInteger(string codigo, int compania) {
            tcarparametros obj = null;
            obj = TcarParametrosDal.Find(codigo, compania);
            if (obj.numero == null) {
                throw new AtlasException("BCAR-0023", "VALOR NUMERICO PARA EL PARAMETRO NO DEFINIDO EN TCARPARAMETROS CODIGO: {0} COMPANIA: {1}", codigo, compania);
            }
            return Int32.Parse(Math.Truncate((decimal)obj.numero).ToString());
        }

    }

}
