using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.talentohumano.nomina
{
   public class TnomDescuentoDal
    {
        /// <summary>
        /// Consulta en la base de datos la definicion de tnomdescuento.
        /// </summary>
        /// <returns>IList<tnomdescuento></returns>
        public static IList<tnomdescuento> Find()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tnomdescuento> ldatos = ldatos = contexto.tnomdescuento.AsNoTracking().ToList();
            return ldatos;
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de tnomdescuento por cdescuento
        /// </summary>
        /// <returns>tnomdescuento</returns>
        public static tnomdescuento Find(long? cdescuento)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tnomdescuento obj = null;
            try
            {
                obj = contexto.tnomdescuento.Where(x => x.cdescuento ==cdescuento).Single();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }
        

        /// <summary>
        /// Consulta en la base de datos la definicion de tnomdescuento por mes.
        /// </summary>
        /// <returns>tnomdescuento</returns>
        public static IList<tnomdescuento> descuentoPatronalMensual(String mes)
        {
            IList<tnomdescuento> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnomdescuento.Where(x => x.mescdetalle.Equals(mes) && x.estado == true && x.asignacion == true).ToList();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }
    }
}
