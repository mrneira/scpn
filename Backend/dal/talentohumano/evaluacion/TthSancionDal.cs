using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.talentohumano.evaluacion
{
   public class TthSancionDal
    {
        /// <summary>
        /// Consulta en la base de datos la definicion de tthasignacionresp, con los codigos de horario, nombre y tipo.
        /// </summary>
        /// <returns>IList<tthasignacionresp></returns>
        public static IList<tthsancion> FindInDataBase()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tthsancion> ldatos = ldatos = contexto.tthsancion.AsNoTracking().ToList();
            return ldatos;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="csancion"></param>
        /// <returns></returns>
        public static tthsancion Find(long csancion)
        {
            tthsancion ldatos;
            try
            {
                AtlasContexto contexto = Sessionef.GetAtlasContexto();
                ldatos = ldatos = contexto.tthsancion.AsNoTracking().Where(x => x.csancion == csancion).Single();


            }
            catch (Exception ex)
            {
                ldatos = null;
            }
            return ldatos;
        }
        public static IList< tthsancion> Find(long cfuncionario,long cperiodo)
        {
            IList<tthsancion> ldatos;
            IList<tthsancion> ldatosn = new List<tthsancion>();
            try
            {


                AtlasContexto contexto = Sessionef.GetAtlasContexto();

                 ldatos = ldatos = contexto.tthsancion.AsNoTracking().Where(x => x.sancionadocfuncionario == cfuncionario && x.cperiodo==cperiodo).ToList();
               
            }
            catch (Exception ex)
            {
                ldatos = null;
            }
            return ldatos;
        }

    }
}
