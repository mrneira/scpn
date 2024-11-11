using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using modelo;
using util.servicios.ef;

namespace dal.talentohumano
{
  public  class TnomparametroDal
    {
        /// <summary>
        /// Consulta en la base de datos la definicion de tnomparametrodetalle.
        /// </summary>
        /// <returns>IList<tnomparametrodetalle></returns>
        public static IList<tnomparametrodetalle> FindInDataBase()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tnomparametrodetalle> ldatos = ldatos = contexto.tnomparametrodetalle.AsNoTracking().ToList();
            return ldatos;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de tnomparametrodetalle por anio.
        /// </summary>
        /// <returns>IList<tnomparametrodetalle></returns>
        public static tnomparametrodetalle Find(long anio)
        {
            tnomparametrodetalle obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnomparametrodetalle.Where(x => x.verreg == 0 && x.anio == anio).Single();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }
        public static tnomparametro FindCabecera(long anio)
        {
            tnomparametro obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnomparametro.Where( x=> x.anio == anio).Single();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }
    }
}
