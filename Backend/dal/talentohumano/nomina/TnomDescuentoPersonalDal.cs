using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.talentohumano.nomina
{
   public class TnomDescuentoPersonalDal
    {
        /// <summary>
        /// Consulta en la base de datos la definicion de tnomdescuentopersona.
        /// </summary>
        /// <returns>IList<tnomdescuentopersona></returns>
        public static IList<tnomdescuentopersona> findInDataBase()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tnomdescuentopersona> ldatos = ldatos = contexto.tnomdescuentopersona.AsNoTracking().ToList();
            return ldatos;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de tnomdescuentopersona por mes.
        /// </summary>
        /// <returns>tnomdescuentopersona</returns>
        public static tnomdescuentopersona descuentoMensual(String mes,long anio)
        {
            tnomdescuentopersona obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnomdescuentopersona.Where(x => x.mescdetalle.Equals(mes) && x.anio==anio && x.estado == true).Single();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de tnomdescuentopersona por mes y cfuncionario
        /// </summary>
        /// <returns>tnomdescuentopersona</returns>
        public static IList<tnomdescuentopersona> descuentoMensual(String mes, long? cfuncionario,long anio)
        {
            IList<tnomdescuentopersona> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnomdescuentopersona.Where(x => x.mescdetalle.Equals(mes) && x.anio==anio && x.cfuncionario==cfuncionario && x.estado == true).ToList();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }
        //CCA 20240117
        public static IList<tnomdescuentopersona> descuentoLiquidacionMensual(String mes, long? cfuncionario, long anio)
        {
            IList<tnomdescuentopersona> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnomdescuentopersona.Where(x => x.anio == anio && x.cfuncionario == cfuncionario && x.estado == true).ToList();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }
    }
}
