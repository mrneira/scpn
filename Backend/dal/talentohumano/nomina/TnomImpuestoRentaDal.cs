using modelo;
using modelo.helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.talentohumano.nomina
{
   public class TnomImpuestoRentaDal
    {
        /// <summary>
        /// Consulta en la base de datos la definicion de tnomtablaimrenta.
        /// </summary>
        /// <returns>IList<tnomtablaimrenta></returns>
        public static IList<tnomtablaimrenta> findInDataBase()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tnomtablaimrenta> ldatos = ldatos = contexto.tnomtablaimrenta.AsNoTracking().ToList();
            return ldatos;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de tnomtablaimrenta por año.
        /// </summary>
        /// <returns>IList<tnomtablaimrenta></tnomtablaimrenta></returns>
        public static List<tnomtablaimrenta> Find(long? anio)
        {
            List<tnomtablaimrenta> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnomtablaimrenta.Where(x => x.anio ==anio).ToList();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de tn por cfuncionario.
        /// </summary>
        /// <returns>IList<tnomimpuestorenta></tnomimpuestorenta></returns>
        public static tnomimpuestorenta FindGastosDeducibles(long? cfuncionario, long? anio)
        {
            tnomimpuestorenta obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tnomimpuestorenta.Where(x => x.anio == anio && x.cfuncionario == cfuncionario).SingleOrDefault();
            if (obj != null) EntityHelper.SetActualizar(obj);
            return obj;
        }
    }
}
