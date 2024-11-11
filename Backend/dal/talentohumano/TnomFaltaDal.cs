using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.talentohumano
{
    public    class TnomFaltaDal
    {
        /// <summary>
        /// Consulta en la base de datos la definicion de tnomfalta.
        /// </summary>
        /// <returns>IList<tthcargo></returns>
        public static IList<tnomfalta> FindInDataBase()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tnomfalta> ldatos = ldatos = contexto.tnomfalta.AsNoTracking().ToList();
            return ldatos;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de tnomfalta por ccargo.
        /// </summary>
        /// <returns>tnomfalta</returns>
        public static tnomfalta FindInDataBaseCodigo(long cfalta)
        {
            tnomfalta obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnomfalta.Where(x => x.cfalta == cfalta).Single();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }
    }
}
