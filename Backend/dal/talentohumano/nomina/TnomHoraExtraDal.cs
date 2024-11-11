using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.talentohumano.nomina
{
 public   class TnomHoraExtraDal
    {
        /// <summary>
        /// Consulta en la base de datos la definicion de tnomhoraextranomina.
        /// </summary>
        /// <returns>IList<tnomhoraextranomina></returns>
        public static IList<tnomhoraextranomina> findInDataBase()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tnomhoraextranomina> ldatos = ldatos = contexto.tnomhoraextranomina.AsNoTracking().ToList();
            return ldatos;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de tnomhoraextranomina por mes y funcionario
        /// </summary>
        /// <returns>tnomhoraextranomina</returns>
        public static IList<tnomhoraextranomina> Find(String mes, long? cfuncionario,long anio)
        {
            IList<tnomhoraextranomina> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnomhoraextranomina.Where(x =>x.anio== anio && x.mescdetalle.Equals(mes) && x.cfuncionario == cfuncionario && x.aprobada == true && x.contabilizada == false).ToList();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }
    }
}
