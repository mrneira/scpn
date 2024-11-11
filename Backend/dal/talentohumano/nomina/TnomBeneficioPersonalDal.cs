using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.talentohumano.nomina
{
    public class TnomBeneficioPersonalDal
    {
        /// <summary>
        /// Consulta en la base de datos la definicion de tnombeneficiopersona.
        /// </summary>
        /// <returns>IList<tnombeneficiopersona></returns>
        public static IList<tnombeneficiopersona> findInDataBase()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tnombeneficiopersona> ldatos = ldatos = contexto.tnombeneficiopersona.AsNoTracking().ToList();
            return ldatos;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de tnombeneficiopersona por mes.
        /// </summary>
        /// <returns>tnombeneficiopersona</returns>
        public static tnombeneficiopersona beneficioMensual(String mes, long anio)
        {
            tnombeneficiopersona obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnombeneficiopersona.Where(x => x.mescdetalle.Equals(mes) && x.anio==anio && x.estado == true).Single();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de tnombeneficiopersona por mes.
        /// </summary>
        /// <returns>tnombeneficiopersona</returns>
        public static IList<tnombeneficiopersona> beneficioMensual(String mes, long? cfuncionario,long anio)
        {
            IList<tnombeneficiopersona> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnombeneficiopersona.Where(x => x.mescdetalle.Equals(mes)  && x.anio == anio && x.cfuncionario==cfuncionario && x.estado == true).ToList();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }
    }
}
