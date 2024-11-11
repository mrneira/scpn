using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using modelo;
using modelo.servicios;
using modelo.helper;
using System.Data.SqlClient;
using util.servicios.ef;
using System.Configuration;

namespace dal.prestaciones
{
    /// <summary>
    /// Clase que implemeta, dml's de la tabla expediente asignacion
    /// </summary>
    public class TpreExpedienteAsignacionDal
    {
        private static string connectionString;
        /// <summary>
        /// Método que busca la asignación de expediente de una persona que a ún no se encuentra creado el expediente
        /// </summary>
        /// <param name="cpersona"></param>
        /// <returns></returns>
        public static tpreexpedienteasignacion FindAsigExpFreeByPerson(long cpersona)
        {
            tpreexpedienteasignacion obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            //obj = contexto.tpreexpedienteasignacion.AsNoTracking().Where(x => x.cpersona == cpersona && x.estadoasignacion == false).SingleOrDefault();
            obj = contexto.tpreexpedienteasignacion.AsNoTracking().Where(x => x.cpersona == cpersona && x.estadoasignacion == false).OrderByDescending(x => x.fingreso).Take(1).SingleOrDefault();// MNE 20240910
            return obj;
        }
        /// <summary>
        /// Método que busca los secuenciales de los expedientes de asignación
        /// </summary>
        /// <param name="filterlike"></param>
        /// <returns></returns>
        public static List<tgensecuencia> FindLastValueExpedients(string filterlike)
        {
            List<tgensecuencia> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tgensecuencia.AsNoTracking().Where(x => x.csecuencia.StartsWith(filterlike)).ToList();
            return obj;
        }
    }
}
