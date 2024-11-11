using modelo;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.cartera {

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TcarAccrual.
    /// </summary>
    public class TcarAccrualDal {

        /// <summary>
        /// Metodo que entrega la definicion de una codigos de saldo a calcular accruales de cartera. Busca los datos en cahce, si no encuentra 
        /// los datos en cache busca en la base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <returns>IList<TcarAccrualDto></returns>
        public static IList<tcaraccrual> FindAll() {
            IList<tcaraccrual> ldatos = null;
            String key = "tcaraccrual";
            CacheStore cs = CacheStore.Instance;
            ldatos = (List<tcaraccrual>)cs.GetDatos("tcaraccrual", key);
            if (ldatos == null) {
                ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tcaraccrual");
                ldatos = FindInDataBase();
                m[key] = ldatos;
                cs.PutDatos("tcaraccrual", m);
            }
            return ldatos;
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de tcaraccrual, con los codigos de saldo a calcular accruales diarios.
        /// </summary>
        /// <returns>IList<TcarAccrualDto></returns>
        public static IList<tcaraccrual> FindInDataBase() {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tcaraccrual> ldatos = ldatos = contexto.tcaraccrual.AsNoTracking().ToList();
            return ldatos;
        }

        /// <summary>
        /// Entrega la defincion de un codigo de saldo de accrual.
        /// </summary>
        /// <param name="laccrual">Definicion de codigos de saldo de accrual asociado a cartera.</param>
        /// <param name="csaldo">Codigo de saldo a buscar defincion de accual.</param>
        /// <returns>TcarAccrualDto</returns>
        public static tcaraccrual Find(IList<tcaraccrual> laccrual, String csaldo) {
            tcaraccrual obj = null;
            foreach (tcaraccrual tcarAccrual in laccrual) {
                if (tcarAccrual.csaldoaccrual.CompareTo(csaldo) == 0) {
                    obj = tcarAccrual;
                    break;
                }
            }
            return obj;
        }

    }
}
