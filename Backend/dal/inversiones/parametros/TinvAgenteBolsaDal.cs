using modelo;
using modelo.helper;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.inversiones {

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla tinvagentebolsa.
    /// </summary>
    public class TinvAgenteBolsaDal {


        /// <summary>
        /// Metodo que entrega un agente de bolsa. Si la transaccion maneja cache, busca los datos en cache, si no encuentra los datos en cache busca en la base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="cinvagentebolsa">código del agente.</param>
        /// <returns>tinvagentebolsa</returns>
        public static tinvagentebolsa Find(int cinvagentebolsa)
        {
            tinvagentebolsa obj = null;
            String key = "" + cinvagentebolsa ;
            CacheStore cs = CacheStore.Instance;
            obj = (tinvagentebolsa)cs.GetDatos("tinvagentebolsa", key);
            if (obj == null)
            {
                ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tinvagentebolsa");
                obj = FindInDatabase(cinvagentebolsa);
                m[key] = obj;
                cs.PutDatos("tinvagentebolsa", m);
            }
            return obj;
        }


        /// <summary>
        /// Entrega definicion de un agente de bolsa.
        /// </summary>
        /// <param name="cinvagentebolsa">código del agente.</param>
        /// <returns>tinvagentebolsa</returns>
        public static tinvagentebolsa FindInDatabase(int cinvagentebolsa)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tinvagentebolsa obj = null;
            obj = contexto.tinvagentebolsa.Where(x => x.cinvagentebolsa == cinvagentebolsa).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

        /// <summary>
        /// Entrega una lista de tinvagentebolsa que tienen el mismo dominio de correo
        /// </summary>
        /// <param name="sdominio">Dominio del correo</param>
        /// <returns>List<Tinvagentebolsa></returns>
        public static List<tinvagentebolsa> ListaporDominioEmail(string sdominio) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tinvagentebolsa>  lista;
            lista = contexto.tinvagentebolsa.AsNoTracking().Where(x => x.direccionelectronica01.EndsWith(sdominio)).ToList();
            return lista;
        }
        
    }
}
