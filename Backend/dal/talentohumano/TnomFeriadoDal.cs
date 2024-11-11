using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.talentohumano
{
   public class TnomFeriadoDal
    {
        /// <summary>
        /// Consulta en la base de datos la definicion de tnomferiados.
        /// </summary>
        /// <returns>IList<tnomferiados></returns>
        public static IList<tnomferiados> FindInDataBase()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tnomferiados> ldatos = ldatos = contexto.tnomferiados.AsNoTracking().ToList();
            return ldatos;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de tnomferiados por anio.
        /// </summary>
        /// <returns>tnomferiados</returns>
        public static tnomferiados FindAnio(long anio,string mes)
        {
            tnomferiados obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnomferiados.Where(x => x.anio == anio && x.mescdetalle.Equals(mes)).Single();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de tnomferiados por anio.
        /// </summary>
        /// <returns>IList<tnomferiados></returns>
        public static IList<tnomferiados> Find(long anio)
        {
            IList<tnomferiados> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnomferiados.AsNoTracking().Where(x => x.anio == anio).ToList();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de tnomferiados por anio,mes,dia
        /// </summary>
        /// <returns>IList<tnomferiados></returns>
        public static IList<tnomferiados> Find(long anio,string mes,int dia)
        {
            IList<tnomferiados> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnomferiados.AsNoTracking().Where(x => x.anio == anio && x.mescdetalle.Equals(mes) && x.dia==dia).ToList();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }
    }
}
