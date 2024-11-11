using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.talentohumano.nomina
{
   public class TnomsaldoVacacionDal
    {
        /// <summary>
        /// Consulta en la base de datos la definicion de tnomsaldovacaciones.
        /// </summary>
        /// <returns>IList<tnomsaldovacaciones></returns>
        public static IList<tnomsaldovacaciones> Find()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tnomsaldovacaciones> ldatos = ldatos = contexto.tnomsaldovacaciones.AsNoTracking().ToList();
            return ldatos;
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de tnomsaldovacaciones.
        /// </summary>
        /// <returns>Total vacaciones</returns>
        public static decimal Total(long? cfuncionario)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            decimal t = 0;
            List<tnomsaldovacaciones> ldatos= new List<tnomsaldovacaciones>();
            try
            {
                ldatos = contexto.tnomsaldovacaciones.Where(x => x.cfuncionario == cfuncionario).ToList();
                t = ldatos.Sum(x => x.dias).Value;
            }
            catch (Exception)
            {
                t = 0;

            }
            
            return t;
        }


        /// <summary>
        /// Consulta en la base de datos la definicion de tnomsaldovacaciones por cfuncionario
        /// </summary>
        /// <returns>IList<tnomsaldovacaciones></returns>
        public static IList<tnomsaldovacaciones> Find(long? cfuncionario)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
           IList< tnomsaldovacaciones> obj = null;
            try
            {
                obj = contexto.tnomsaldovacaciones.Where(x => x.cfuncionario == cfuncionario).ToList();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }
    }
}
