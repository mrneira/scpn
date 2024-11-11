using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.talentohumano.evaluacion
{
    public class TthSancionPonderacionDal
    {
        /// <summary>
        /// Consulta en la base de datos la definicion de tthsancionponderacion, con los codigos de horario, nombre y tipo.
        /// </summary>
        /// <returns>IList<tthsancionponderacion></returns>
        public static IList<tthsancionponderacion> FindInDataBase()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tthsancionponderacion> ldatos = ldatos = contexto.tthsancionponderacion.AsNoTracking().ToList();
            return ldatos;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="csancion"></param>
        /// <returns></returns>
        public static tthsancionponderacion Find(long csancion)
        {
            tthsancionponderacion ldatos;
            try
            {
                AtlasContexto contexto = Sessionef.GetAtlasContexto();
                ldatos = ldatos = contexto.tthsancionponderacion.AsNoTracking().Where(x => x.csancion == csancion).Single();


            }
            catch (Exception ex)
            {
                ldatos = null;
            }
            return ldatos;
        }
        public static tthsancionponderacion Find(string tipocdetalle)
        {
            tthsancionponderacion ldatos;
            try
            {
                AtlasContexto contexto = Sessionef.GetAtlasContexto();
                ldatos = ldatos = contexto.tthsancionponderacion.AsNoTracking().Where(x => x.tipocdetalle.Equals(tipocdetalle)).First();

            }
            catch (Exception ex)
            {
                ldatos = null;
            }
            return ldatos;
        }
        /// <summary>
        /// Retorna un promedio de tipo sanción en su ponderación 
        /// </summary>
        /// <param name="cdetalle"></param>
        /// <returns></returns>
        public static decimal FindPromedio(string cdetalle)
        {
            IList<tthsancionponderacion> ldatos;
            decimal total = 0;
            try
            {
                AtlasContexto contexto = Sessionef.GetAtlasContexto();
                total = contexto.tthsancionponderacion
                    .AsNoTracking()
                    .Where(x => x.tipocdetalle.Equals(cdetalle)).ToList()
                    .Select(x => x.ponderacion)
                    .Average();

            }
            catch (Exception ex)
            {
                ldatos = null;
            }


            return total;
        }
    }
}
