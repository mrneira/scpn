using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.talentohumano
{
    public class TthcargoDal
    {
        /// <summary>
        /// Consulta en la base de datos la definicion de tthcargo.
        /// </summary>
        /// <returns>IList<tthcargo></returns>
        public static IList<tthcargo> FindInDataBase()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tthcargo> ldatos = ldatos = contexto.tthcargo.AsNoTracking().ToList();
            return ldatos;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de tthcargo por ccargo.
        /// </summary>
        /// <returns>IList<tthcargo></returns>
        public static tthcargo FindInDataBaseCodigo(long ccargo)
        {
            tthcargo obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tthcargo.Where(x => x.ccargo == ccargo && x.activo == true).Single();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }

    }
}
