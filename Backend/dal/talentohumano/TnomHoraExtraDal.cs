using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.talentohumano
{
  public  class TnomHoraExtraDal
    {
        /// <summary>
        /// Consulta en la base de datos la definicion de tnomhoraextra.
        /// </summary>
        /// <returns>IList<tnomhoraextra></returns>
        public static IList<tnomhoraextra> FindInDataBase()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tnomhoraextra> ldatos = ldatos = contexto.tnomhoraextra.AsNoTracking().ToList();
            return ldatos;
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de tnomhoraextra.
        /// </summary>
        /// <returns>tnomhoraextra</returns>
        public static tnomhoraextra FindSolicitud(long csolicitud)
        {
            tnomhoraextra obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnomhoraextra.Where(x => x.csolicitud == csolicitud).Single();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de tnomhoraextra.
        /// </summary>
        /// <returns>IList<tnomhoraextra></returns>
        public static IList<tnomhoraextra> Find(long csolicitud)
        {
            IList<tnomhoraextra> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnomhoraextra.AsNoTracking().Where(x => x.csolicitud == csolicitud).ToList();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }
    }
}
