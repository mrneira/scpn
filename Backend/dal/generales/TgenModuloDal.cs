using modelo;
using modelo.helper;
using System;
using System.Collections.Concurrent;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.generales
{
    public class TgenModuloDal
    {

        /// <summary>
        /// Consulta en la base de datos la definicion de una tgenmodulo.
        /// </summary>
        /// <param name="cmodulo">Codigo de modulo al que pertenece la transaccion.</param>
        /// <returns></returns>
        public static tgenmodulo Find(int cmodulo)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tgenmodulo obj = null;

            obj = contexto.tgenmodulo.AsNoTracking().Where(x => x.cmodulo == cmodulo).SingleOrDefault();
            return obj;
        }


    }
}
