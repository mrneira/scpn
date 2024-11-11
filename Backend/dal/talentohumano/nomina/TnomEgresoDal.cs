using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.talentohumano.nomina
{
    public class TnomEgresoDal
    {
        /// <summary>
        /// Consulta en la base de datos la definicion de tnomegreso.
        /// </summary>
        /// <returns>IList<tnomegreso></returns>
        public static IList<tnomegreso> findInDataBase()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tnomegreso> ldatos = ldatos = contexto.tnomegreso.AsNoTracking().ToList();
            return ldatos;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de tnomingreso por cegreso.
        /// </summary>
        /// <returns>IList<tnomegreso></returns>
        public static IList<tnomegreso> Find(long? cegreso)
        {
            IList<tnomegreso> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnomegreso.Where(x => x.cegreso== cegreso).ToList();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }
        public static IList<tnomegreso> FindNomina(long? cnomina)
        {
            IList<tnomegreso> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnomegreso.Where(x => x.tnomrol.cnomina == cnomina).ToList();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }
        public static IList<tnomegreso> FindRol(long? crol)
        {
            IList<tnomegreso> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnomegreso.Where(x => x.crol == crol).ToList();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }
    }
}
