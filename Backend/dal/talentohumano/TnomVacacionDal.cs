using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.talentohumano
{
  public  class TnomVacacionDal
    {
        /// <summary>
        /// Consulta en la base de datos la definicion de tnomvacacion.
        /// </summary>
        /// <returns>IList<tnomvacacion></returns>
        public static IList<tnomvacacion> FindInDataBase()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tnomvacacion> ldatos = ldatos = contexto.tnomvacacion.AsNoTracking().ToList();
            return ldatos;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de tnomvacacion csolicitud
        /// </summary>
        /// <returns>tnomferiados</returns>
        public static tnomvacacion FindSolicitud(long csolicitud)
        {
            tnomvacacion obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnomvacacion.Where(x => x.csolicitud == csolicitud).Single();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }
       
    }
}
