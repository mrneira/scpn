using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.talentohumano.nomina
{
    public class TnomBeneficioDal
    {
        /// <summary>
        /// Consulta en la base de datos la definicion de tnombeneficio.
        /// </summary>
        /// <returns>IList<tnombeneficio></returns>
        public static IList<tnombeneficio> Find()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tnombeneficio> ldatos = ldatos = contexto.tnombeneficio.AsNoTracking().ToList();
            return ldatos;
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de tnombeneficio por cbeneficio
        /// </summary>
        /// <returns>IList<tnombeneficio></returns>
        public static tnombeneficio Find(long? cbeneficio)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tnombeneficio obj = null;
            try
            {
                obj = contexto.tnombeneficio.Where(x => x.cbeneficio==cbeneficio).Single();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de tnombeneficio por mes.
        /// </summary>
        /// <returns>tnombeneficio</returns>
        public static tnombeneficio beneficioMensualPatronal(String mes)
        {
            tnombeneficio obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnombeneficio.Where(x => x.mescdetalle.Equals(mes) && x.estado == true).Single();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de tnombeneficio por mes.
        /// </summary>
        /// <returns>tnombeneficio</returns>
        public static IList<tnombeneficio> beneficioPatronalMensual(String mes)
        {
            IList<tnombeneficio> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnombeneficio.Where(x => x.mescdetalle.Equals(mes) && x.estado == true && x.aportepatrono== true && x.asignacion== false).ToList();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }


    }
}
