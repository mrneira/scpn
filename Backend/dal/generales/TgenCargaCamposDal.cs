using modelo;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.generales
{
    /// <summary>
    /// Clase que implemeta, consultas manuales de la tabla TgenCargaCamposDto.
    /// </summary>
    public class TgenCargaCamposDal {

        /// <summary>
        /// Metodo que entrega la definicion de campos de un tipo de archvio. Busca los datos en cache, si no encuentra los datos en cache busca en la base, 
        /// alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="ctipoarchivo">Codigo de tipo de archivo.</param>
        /// <returns></returns>
        public static IList<tgencargacampos> Find(int cmodulo,int ctipoarchivo)
        {
            IList<tgencargacampos> ldata = null;
            // Si maneja cache de transaccion.
            String key = "" + ctipoarchivo;
            CacheStore cs = CacheStore.Instance;
            ldata = (IList<tgencargacampos>)cs.GetDatos("tgencargacampos", key);
            if (ldata == null) {
                ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tgencargacampos");
                ldata = TgenCargaCamposDal.FindInDataBase(cmodulo,ctipoarchivo);
                //foreach (TgenCargaCamposDto obj in ldata) {
                //    Sessionhb.GetSession().Evict(obj);
                //}
                m[key] = ldata;
                cs.PutDatos("tgencargacampos", m);
            }
            return ldata;
        }

        /// <summary>
        /// Busca en la base de datos definicon de campos asociados a un tipo de archivo.
        /// </summary>
        /// <param name="ctipoarchivo">Codigo de tipo de archivo.</param>
        /// <returns></returns>
        public static List<tgencargacampos> FindInDataBase(int cmodulo,int ctipoarchivo) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tgencargacampos> ldata = null;

            ldata = contexto.tgencargacampos.AsNoTracking().Where(x => x.cmodulo == cmodulo && x.ctipoarchivo == ctipoarchivo).OrderBy(x=>x.ccampo).ToList();

            if (ldata.Count.Equals(0))
            {
                throw new AtlasException("BGEN-017", "TIPO DE ARCHIVO: {0} NO DEFINIDO", ctipoarchivo);
            }
            return ldata;
        }

    }
    

}
