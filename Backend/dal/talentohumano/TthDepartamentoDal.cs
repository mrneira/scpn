using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.talentohumano
{
    public class TthDepartamentoDal
    {
        /// <summary>
        /// Consulta en la base de datos la definicion de tthdepartamento.
        /// </summary>
        /// <returns>IList<tthdepartamento></returns>
        public static IList<tthdepartamento> FindInDataBase()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tthdepartamento> ldatos = ldatos = contexto.tthdepartamento.AsNoTracking().ToList();
            return ldatos;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de tthdepartamento por cdepartamento.
        /// </summary>
        /// <returns>tthdepartamento</returns>
        public static tthdepartamento FindDepartamento(long cdepartamento)
        {
            tthdepartamento obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tthdepartamento.Where(x => x.cdepartamento== cdepartamento).Single();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }
    }
}
