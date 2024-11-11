using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.talentohumano.nomina
{
  public  class TnomParamHorasExtrasDal
    {
        /// <summary>
        /// Consulta en la base de datos la definicion de tnomhoras.
        /// </summary>
        /// <returns>IList<tnomhoras></returns>
        public static IList<tnomhoras> findInDataBase()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tnomhoras> ldatos = ldatos = contexto.tnomhoras.AsNoTracking().ToList();
            return ldatos;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de tnomhoras por año.
        /// </summary>
        /// <returns>tnomhoras</returns>
        public static tnomhoras Find(long anio,string ctipo, string cregimen)
        {
            tnomhoras obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnomhoras.Where(x => x.anio == anio && x.regimencdetalle.Equals(cregimen) && x.tipocdetalle.Equals(ctipo)).Single();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }
    }
}
