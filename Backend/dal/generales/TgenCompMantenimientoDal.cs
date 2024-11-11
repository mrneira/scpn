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
    public class TgenCompMantenimientoDal {
        /// <summary>
        /// Metodo que entrega la definicion de componentes de una transaccion. Si la transaccion maneja cache, busca los datos en cahce, si no encuentra los datos en cache busca en la base, 
        /// alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="tgencompmantenimiento">Objeto que contiene la definicion de una transaccion.</param>
        /// <param name="canal">Codigo de canal.</param>
        /// <returns></returns>
        public static IList<tgencompmantenimiento> Find(tgentransaccion tgentransaction, String canal) {
            IList<tgencompmantenimiento> obj = null;
            // Si maneja cache de transaccion.
            String key = tgentransaction.cmodulo + "^" + tgentransaction.ctransaccion + "^" + canal;
            CacheStore cs = CacheStore.Instance;

            obj = (IList<tgencompmantenimiento>)cs.GetDatos("tgencompmantenimiento", key);
            if (obj == null) {
                ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tgencompmantenimiento");
                obj = FindInDataBase(tgentransaction, canal);

                m.TryAdd(key, obj);
                cs.PutDatos("tgencompmantenimiento", m);
            }
            return obj;

        }

        /// <summary>
        /// Busca en la base de datos definicon de un componente de consulta.
        /// </summary>
        /// <param name="tgentransaction">Objeto que contiene la definicion de una transaccion.</param>
        /// <param name="ccanal">Codigo de canal.</param>
        /// <param name="cconsulta">Codigo de consulta.</param>
        /// <returns></returns>
        public static IList<tgencompmantenimiento> FindInDataBase(tgentransaccion tgentransaction, string ccanal) {
            IList<tgencompmantenimiento> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();

            obj = contexto.tgencompmantenimiento.AsNoTracking().Where(x => x.ctransaccion == tgentransaction.ctransaccion
                                                                        && x.cmodulo == tgentransaction.cmodulo
                                                                        && x.ccanal == ccanal
                                                                        && x.activo == true).OrderBy(o => o.orden).ToList();
            return obj;
        }

    }
}
