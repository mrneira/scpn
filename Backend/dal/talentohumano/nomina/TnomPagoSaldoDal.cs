using dal.generales;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.servicios.ef;

namespace dal.talentohumano.nomina
{
   public class TnomPagoSaldoDal
    {
        /// <summary>
        /// Consulta en la base de datos la definicion de tnompagosaldo.
        /// </summary>
        /// <returns>IList<tnompagosaldo></returns>
        public static IList<tnompagosaldo> Find()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tnompagosaldo> ldatos = ldatos = contexto.tnompagosaldo.AsNoTracking().ToList();
            return ldatos;
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de tnombeneficio por cbeneficio
        /// </summary>
        /// <returns>IList<tnombeneficio></returns>
        public static tnompagosaldo Find(int ccatalogo,string cdetalle)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tnompagosaldo obj = null;
            try
            {
                obj = contexto.tnompagosaldo.Where(x => x.saldocdetalle.Equals(cdetalle) && x.saldoccatalogo==ccatalogo).Single();
            }
            catch (Exception)
            {
                if (obj == null)
                {
                   string nombre= TgenCatalogoDetalleDal.Find(ccatalogo, cdetalle).nombre;
                    throw new AtlasException("TTH-023", "NO SE HA DEFINIDO EL PAGO DEL RUBRO {0} EN LA PARAMETRIZACIÓN DE PAGO DE SALDOS", nombre);
                }

            }
            return obj;
        }
      
    }
}
