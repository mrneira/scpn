using dal.generales;
using dal.monetario;
using modelo;
using modelo.helper;
using modelo.interfaces;
using modelo.servicios;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace dal.contabilidad {

    public class TconPlantillaDal {

        /// <summary>
        /// Metodo que entrega la definicion de una plantilla contable
        /// </summary>
        /// <returns></returns>
        public static tconplantilla Find(int cplantilla, int ccompania) {
            tconplantilla obj = null;
            String key = "" + cplantilla + "^" + ccompania;
            CacheStore cs = CacheStore.Instance;
            obj = (tconplantilla)cs.GetDatos("tconplantilla", key);
            if (obj == null) {
                ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tconplantilla");
                obj = FindInDatabase(cplantilla, ccompania);
                m[key] = obj;
                cs.PutDatos("tconplantilla", m);
            }
            return obj;
        }


        /// <summary>
        /// Entrega definicion de una plantilla.
        /// </summary>
        public static tconplantilla FindInDatabase(int cplantilla, int ccompania) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tconplantilla obj = null;
            obj = contexto.tconplantilla.Where(x => x.cplantilla.Equals(cplantilla) && x.ccompania.Equals(ccompania)).SingleOrDefault();
            if (obj != null) {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }
    }

}
