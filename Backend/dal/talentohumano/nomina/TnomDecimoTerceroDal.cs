using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.talentohumano.nomina
{
 public   class TnomDecimoTerceroDal
    {
        // <summary>
        /// Consulta en la base de datos la definicion de tnomdecimotercero.
        /// </summary>
        /// <returns>IList<tnomdecimotercero></returns>
        public static IList<tnomdecimotercero> findInDataBase()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tnomdecimotercero> ldatos = ldatos = contexto.tnomdecimotercero.AsNoTracking().ToList();
            return ldatos;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de tnomdecimotercero por funcionario.
        /// </summary>
        /// <returns>IList<tnomdecimotercero></returns>
        public static IList<tnomdecimotercero> Find(long? cfuncionario)
        {
            IList<tnomdecimotercero> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnomdecimotercero.Where(x => x.cfuncionario == cfuncionario && x.contabilizado == false).ToList();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }
       

    }
}
