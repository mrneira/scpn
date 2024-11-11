using dal.generales;
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

    public class TconTipoComprobanteTransaccionDal
    {

        public static tcontipocomprobantetransaccion Find(int cmodulo, int ctransaccion) {
            tcontipocomprobantetransaccion obj = null;
            String key = "" + cmodulo + "^" + ctransaccion;
            CacheStore cs = CacheStore.Instance;
            obj = (tcontipocomprobantetransaccion)cs.GetDatos("tcontipocomprobantetransaccion", key);
            if (obj == null) {
                ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tcontipocomprobantetransaccion");
                obj = FindInDatabase(cmodulo, ctransaccion);
                m[key] = obj;
                cs.PutDatos("tcontipocomprobantetransaccion", m);
            }
            return obj;
        }


        /// <summary>
        /// Entrega definicion de una cuenta contable.
        /// </summary>
        /// <param name="ccompania">Codigo de compania.</param>
        /// <param name="ccuenta">Codigo de cuenta contable.</param>
        /// <returns>TconCatalogoDto</returns>
        public static tcontipocomprobantetransaccion FindInDatabase(int cmodulo, int ctransaccion) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcontipocomprobantetransaccion obj = null;
            obj = contexto.tcontipocomprobantetransaccion.Where(x => x.cmodulo == cmodulo && x.ctransaccion == ctransaccion ).SingleOrDefault();
            if (obj != null) {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }


    }

}
