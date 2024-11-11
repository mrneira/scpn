using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.talentohumano.nomina
{
  public  class TnomPagoRegionesDecimoDal
    {
        /// <summary>
        /// Consulta en la base de datos la definicion de tnompagoregionesdecimo.
        /// </summary>
        /// <returns>IList<tnompagoregionesdecimo></returns>
        public static IList<tnompagoregionesdecimo> Find()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tnompagoregionesdecimo> ldatos = ldatos = contexto.tnompagoregionesdecimo.AsNoTracking().ToList();
            return ldatos;
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de tnombeneficio por anio
        /// </summary>
        /// <returns>IList<tnombeneficio></returns>
        public static tnompagoregionesdecimo Find(long? anio)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tnompagoregionesdecimo obj = null;
            try
            {
                obj = contexto.tnompagoregionesdecimo.Where(x => x.anio==anio).Single();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }
        public static tnompagoregionesdecimo Find(long? anio,string mes)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tnompagoregionesdecimo obj = null;
            try
            {
                obj = contexto.tnompagoregionesdecimo.Where(x => x.anio == anio && x.mescdetalle==mes).Single();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }
        public static tnompagoregionesdecimo FindRegion(long? anio, string region)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tnompagoregionesdecimo obj = null;
            try
            {
                obj = contexto.tnompagoregionesdecimo.Where(x => x.anio == anio && x.regioncdetalle == region).Single();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }

    }
}
