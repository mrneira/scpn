using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.talentohumano.nomina
{
    public class TnomFondoReservaDal
    {
        /// <summary>
        /// Consulta en la base de datos la definicion de tnomfondoreserva.
        /// </summary>
        /// <returns>IList<tnomfondoreserva></returns>
        public static IList<tnomfondoreserva> findInDataBase()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tnomfondoreserva> ldatos = ldatos = contexto.tnomfondoreserva.AsNoTracking().ToList();
            return ldatos;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de tnombeneficiopersona por mes.
        /// </summary>
        /// <returns>tnombeneficiopersona</returns>
        public static IList<tnomfondoreserva> Find(long anio,String mes, long? cfuncionario)
        {
            IList<tnomfondoreserva> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnomfondoreserva.Where(x => x.anio==anio && x.mescdetalle.Equals(mes) && x.cfuncionario == cfuncionario && x.contabilizado == false && x.tienederecho == true && x.mensualiza == true).ToList();
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
        public static IList<tnomfondoreserva> Find( long? cfuncionario)
        {
            IList<tnomfondoreserva> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnomfondoreserva.Where(x => x.cfuncionario == cfuncionario && x.contabilizado == false && x.tienederecho==true && x.mensualiza== true).ToList();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }


    }
}
