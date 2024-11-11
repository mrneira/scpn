using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.talentohumano
{
   public class TthProcesoDal
    {
        /// <summary>
        /// Consulta en la base de datos la definicion de tthproceso.
        /// </summary>
        /// <returns>IList<tthproceso></returns>
        public static IList<tthproceso> FindInDataBase()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tthproceso> ldatos = ldatos = contexto.tthproceso.AsNoTracking().ToList();
            return ldatos;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de tthproceso por cproceso.
        /// </summary>
        /// <returns>tthproceso</returns>
        public static tthproceso FindPrceso(long cproceso)
        {
            tthproceso obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tthproceso.Where(x => x.cproceso==cproceso).Single();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }
       
    }
}
