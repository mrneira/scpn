using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using modelo;
using util.servicios.ef;

namespace dal.inversiones.reajustes
{
   public class TinvPortafolioHistoricoDal
    {

        /// <summary>
        /// Consulta en la base de datos la definicion de tinvportafoliohistorico.
        /// </summary>
        /// <returns>IList<tinvportafoliohistorico></returns>
        public static IList<tinvportafoliohistorico> FindInDataBase()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tinvportafoliohistorico> ldatos = ldatos = contexto.tinvportafoliohistorico.AsNoTracking().ToList();
            return ldatos;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de tinvportafoliohistorico por Fecha de proceso.
        /// </summary>
        /// <returns>IList<tinvportafoliohistorico></returns>
        public static IList<tinvportafoliohistorico> FindFechaProceso(int fprceso, long cinversion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tinvportafoliohistorico> ldatos = ldatos = contexto.tinvportafoliohistorico.Where( x=> x.fproceso>=fprceso && x.cinversion==cinversion  && x.grupo>1).ToList();
            return ldatos;
        }

    }
}
