using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.talentohumano
{
   public class TnomDecimosDal
    {
        /// <summary>
        /// Consulta en la base de datos la definicion de tnomdecimos.
        /// </summary>
        /// <returns>IList<tnomdecimos></returns>
        public static IList<tnomdecimos> FindInDataBase()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tnomdecimos> ldatos = ldatos = contexto.tnomdecimos.AsNoTracking().ToList();
            return ldatos;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de tnomdecimos por anio.
        /// </summary>
        /// <returns>tnomdecimos</returns>
        public static tnomdecimos FindAnio(long anio, long cfuncionario)
        {
            tnomdecimos obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnomdecimos.Where(x => x.anio == anio && x.cfuncionario==cfuncionario).Single();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de tnomdecimos por anio.
        /// </summary>
        /// <returns>IList<tnomdecimos></returns>
        public static IList<tnomdecimos> Find(long anio)
        {
            IList<tnomdecimos> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnomdecimos.AsNoTracking().Where(x => x.anio == anio).ToList();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }
    }
}
