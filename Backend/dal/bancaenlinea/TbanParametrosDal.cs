using modelo;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.servicios.ef;

namespace dal.bancaenlinea
{
  public  class TbanParametrosDal
    {
        /// <summary>
        /// Metodo que entrega la definicion de un parametro general de la aplicaion. Busca los datos en cahce, si no encuentra los datos en 
        /// cache busca en la base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="codigo">Codigo de parametro.</param>
        /// <param name="ccompania">Codigo de compania a la que pertenece el parametro.</param>
        /// <returns></returns>
        public static tbanparametros Find(string codigo)
        {
            try
            {
                tbanparametros obj = null;
                string key = "" + codigo;
                CacheStore cs = CacheStore.Instance;
                obj = (tbanparametros)cs.GetDatos("tbanparametros", key);
                if (obj == null)
                {
                    ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tbanparametros");
                    obj = TbanParametrosDal.FindInDataBase(codigo);
                    m[key] = obj;
                    cs.PutDatos("tbanparametros", m);
                }
                return obj;
            }
            catch
            {
                return null;
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="codigo"></param>
        /// <param name="ccompania"></param>
        /// <returns></returns>
        public static tbanparametros FindInDataBase(string codigo)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tbanparametros obj = contexto.tbanparametros.AsNoTracking().Where(x => x.codigo.Equals(codigo) ).SingleOrDefault();
            if (obj == null)
            {
                throw new AtlasException("BGEN-006", "PARAMETRO NO DEFINIDO EN TBANPARAMETROS CODIGO: {0} COMPANIA: {1}", codigo);
            }
            return obj;
        }

        /// <summary>
        /// Metodo que entrega el valor en texto de un parametro.
        /// </summary>
        /// <param name="codigo">Codigo de parametro.</param>
        /// <param name="compania">Codigo de compania asociado al parametro.</param>
        /// <returns></returns>
        public static string GetValorTexto(string codigo)
        {
            tbanparametros obj = null;
            obj = TbanParametrosDal.Find(codigo);
            if (obj.texto == null)
            {
                throw new AtlasException("BGEN-014", "VALOR EN TEXTO PARA EL PARAMETRO NO DEFINIDO EN TBANPARAMETROS CODIGO: {0} COMPANIA: {1}", codigo);
            }
            return obj.texto;
        }

        /// <summary>
        /// Metodo que entrega el valor Decimal de un parametro.
        /// </summary>
        /// <param name="codigo">Codigo de parametro.</param>
        /// <param name="compania">Codigo de compania asociado al parametro.</param>
        /// <returns></returns>
        public static decimal GetValorNumerico(string codigo)
        {
            tbanparametros obj = null;
            obj = TbanParametrosDal.Find(codigo);
            if (obj.numero == null)
            {
                throw new AtlasException("BGEN-013", "VALOR NUMÉRICO PARA EL PARAMETRO NO DEFINIDO EN TBANPARAMETROS CODIGO: {0} COMPANIA: {1}", codigo);
            }
            return (decimal)obj.numero;
        }

        /// <summary>
        /// Metodo que entrega el valor enterio de un parametro numerico.
        /// </summary>
        /// <param name="codigo">Codigo de parametro.</param>
        /// <param name="compania">Codigo de compania asociado al parametro</param>
        /// <returns></returns>
        public static int GetInteger(string codigo, int compania)
        {
            tbanparametros obj = null;
            obj = TbanParametrosDal.Find(codigo);
            if (obj.numero == null)
            {
                throw new AtlasException("BGEN-013", "VALOR NUMERICO PARA EL PARAMETRO NO DEFINIDO EN TBANPARAMETROS CODIGO: {0} COMPANIA: {1}", codigo, compania);
            }
            return Int32.Parse(Math.Truncate((decimal)obj.numero).ToString());
        }
    }
}
