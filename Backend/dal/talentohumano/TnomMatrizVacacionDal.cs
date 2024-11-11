using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using modelo;
using util.servicios.ef;

namespace dal.talentohumano
{
   public class TnomMatrizVacacionDal
    {
        /// <summary>
        /// Consulta en la base de datos la definicion de tnommatrizvacacion.
        /// </summary>
        /// <returns>IList<tnommatrizvacacion></returns>
        public static IList<tnommatrizvacacion> FindInDataBase()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tnommatrizvacacion> ldatos = ldatos = contexto.tnommatrizvacacion.AsNoTracking().ToList();
            return ldatos;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de tnommatrizvacacion por anio.
        /// </summary>
        /// <returns>tnommatrizvacacion</returns>
        public static tnommatrizvacacion FindAnio(long anio)
        {
            tnommatrizvacacion obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnommatrizvacacion.Where(x =>x.anio == anio).Single();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de tnomferiados por anio.
        /// </summary>
        /// <returns>IList<tnomferiados></returns>
        public static IList<tnommatrizvacacion> Find(long anio)
        {
            IList<tnommatrizvacacion> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnommatrizvacacion.AsNoTracking().Where(x => x.anio == anio).ToList();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }
    }
}
