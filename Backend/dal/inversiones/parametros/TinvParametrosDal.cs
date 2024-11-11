using modelo;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.servicios.ef;

namespace dal.inversiones.parametros
{
   public class TinvParametrosDal
    {
        /// <summary>
        /// Metodo que entrega la definicion de un parametro general de la aplicaion. Busca los datos en cahce, si no encuentra los datos en 
        /// cache busca en la base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="codigo">Codigo de parametro.</param>
        /// <param name="ccompania">Codigo de compania a la que pertenece el parametro.</param>
        /// <returns></returns>
        public static tinvparametros Find(string codigo, int ccompania)
        {
            try
            {
                tinvparametros obj = null;
                string key = "" + codigo + "^" + ccompania;
                CacheStore cs = CacheStore.Instance;
                obj = (tinvparametros)cs.GetDatos("tinvparametros", key);
                if (obj == null)
                {
                    ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tinvparametros");
                    obj = TinvParametrosDal.FindInDataBase(codigo, ccompania);
                    m[key] = obj;
                    cs.PutDatos("tinvparametros", m);
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
        public static tinvparametros FindInDataBase(string codigo, int ccompania)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tinvparametros obj = contexto.tinvparametros.AsNoTracking().Where(x => x.codigo.Equals(codigo) && x.ccompania == ccompania).SingleOrDefault();
            if (obj == null)
            {
                throw new AtlasException("INV-007", "PARÁMETRO NO DEFINIDO EN PARÁMETROS GENERALES, CODIGO: {0} COMPANIA: {1}", codigo, ccompania);
            }
            return obj;
        }

        /// <summary>
        /// Metodo que entrega el valor en texto de un parametro.
        /// </summary>
        /// <param name="codigo">Codigo de parametro.</param>
        /// <param name="compania">Codigo de compania asociado al parametro.</param>
        /// <returns></returns>
        public static string GetValorTexto(string codigo, int compania)
        {
            tinvparametros obj = null;
            obj = TinvParametrosDal.Find(codigo, compania);
            if (obj.texto == null)
            {
                throw new AtlasException("INV-008", "VALOR EN TEXTO NO DEFINIDO EN PARÁMETROS CODIGO: {0} COMPANIA: {1}", codigo, compania);
            }
            return obj.texto;
        }

        /// <summary>
        /// Metodo que entrega el valor Decimal de un parametro.
        /// </summary>
        /// <param name="codigo">Codigo de parametro.</param>
        /// <param name="compania">Codigo de compania asociado al parametro.</param>
        /// <returns></returns>
        public static decimal GetValorNumerico(string codigo, int compania)
        {
            tinvparametros obj = null;
            obj = TinvParametrosDal.Find(codigo, compania);
            if (obj.numero == null)
            {
                throw new AtlasException("INV-009", "VALOR NUMÉRICO NO DEFINIDO EN PÁRAMETROS GENERALES, CODIGO: {0} COMPANIA: {1}", codigo, compania);
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
            tinvparametros obj = null;
            obj = TinvParametrosDal.Find(codigo, compania);
            if (obj == null || obj.numero == null)
            {
                throw new AtlasException("INV-010", "VALOR NUMÉRICO NO DEFINIDO EN PARÁMETROS GENERALES, CODIGO: {0} COMPANIA: {1}", codigo, compania);
            }
            return Int32.Parse(Math.Truncate((decimal)obj.numero).ToString());
        }
    }
}
