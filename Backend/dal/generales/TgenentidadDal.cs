using modelo;
using modelo.helper;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.servicios.ef;

namespace dal.generales {

    /// <summary>
    /// Clase que implementa dml's manuales contra la base de datos del dto tgenentidad.
    /// </summary>
    public class TgenentidadDal {


        /// <summary>
        /// Metodo que entrega la definicion de una transaccion. Si la transaccion maneja cache, busca los datos en cahce, si no encuentra los datos en cache busca en la base, 
        /// alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="bean">Nombre del entity bean.</param>
        /// <returns></returns>
        public static tgenentidad Find(string bean) {
            tgenentidad obj = null;
            string key = bean;
            CacheStore cs = CacheStore.Instance;

            obj = (tgenentidad)cs.GetDatos("tgenentidad", key);
            if (obj == null) {
                ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tgenentidad");
                obj = FindInDataBase(bean);                
                m.TryAdd(key, obj);
                cs.PutDatos("tgenentidad", m);
            }
            return obj;
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de un dto.
        /// </summary>
        /// <param name="bean">Nombre del entity bean.</param>
        /// <returns>tgenentidad</returns>
        public static tgenentidad FindInDataBase(string bean) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tgenentidad obj = null;

            obj = contexto.tgenentidad.AsNoTracking().Where(x => x.entity == bean).SingleOrDefault();
            if (obj == null)
            {
                throw new AtlasException("BGEN-007", "BEAN {0} NO DEFINIDO EN TGENENTIDAD", bean);
            }
            EntityHelper.SetActualizar(obj);
            return obj;
        }

    }

}
