using modelo;
using modelo.helper;
using System;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.generales
{

    public class TgenResultadosDal
    {
        /// <summary>
        /// Consulta en la base de datos la definicion de una transaccion.
        /// </summary>
        /// <param name="cresultado">Codigo de resultado.</param>
        /// <returns></returns>
        public static tgenresultados Find(string cresultado)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tgenresultados obj = null;

            obj = contexto.tgenresultados.AsNoTracking().Where(x => x.cresultado == cresultado).SingleOrDefault();
            if (obj == null)
            {
                throw new AtlasException("BGEN-010", "MENSAJE APLICATIVO NO DEFINIDO EN TGENRESULTADOS CODIGO: {0}", cresultado);
            }
            EntityHelper.SetActualizar(obj);
            return obj;
        }
    }

}
