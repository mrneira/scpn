using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.talentohumano
{
    public class TnomPermisoDal
    {
        /// <summary>
        /// Consulta en la base de datos la definicion de tnompermiso.
        /// </summary>
        /// <returns>IList<tnompermiso></returns>
        public static IList<tnompermiso> FindInDataBase()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tnompermiso> ldatos = ldatos = contexto.tnompermiso.AsNoTracking().ToList();
            return ldatos;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de tnompermiso por csolicitud.
        /// </summary>
        /// <returns>tnompermiso</returns>
        public static tnompermiso FindSolicitud(long csolicitud)
        {
            tnompermiso obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnompermiso.Where(x => x.csolicitud==csolicitud).Single();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de tnompermiso por csolicitud.
        /// </summary>
        /// <returns>IList<tnompermiso></returns>
        public static IList<tnompermiso> Find(long csolicitud)
        {
            IList<tnompermiso> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnompermiso.AsNoTracking().Where(x => x.csolicitud==csolicitud).ToList();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }
    }
}
