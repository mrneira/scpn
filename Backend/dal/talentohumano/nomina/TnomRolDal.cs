using modelo;
using modelo.helper;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.talentohumano.nomina
{
 public   class TnomRolDal
    {
        /// <summary>
        /// Consulta en la base de datos la definicion de tnomrol.
        /// </summary>
        /// <returns>IList<tnomrol></returns>
        public static IList<tnomrol> Find()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tnomrol> ldatos = ldatos = contexto.tnomrol.AsNoTracking().ToList();
            return ldatos;
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de tnomrol por crol
        /// </summary>
        /// <returns>IList<tnomrol></returns>
        public static tnomrol Find(long? crol)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tnomrol obj = null;
            try
            {
                obj = contexto.tnomrol.Where(x => x.crol==crol).Single();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de tnomrol por mes y año.
        /// </summary>
        /// <returns>tnomrol</returns>
        public static IList<tnomrol> mes(String mes, long anio)
        {
            List<tnomnomina> obj = null;
            List<tnomrol> rol = null;

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnomnomina.Where(x => x.mescdetalle.Equals(mes) && x.anio == anio).ToList();
                
            }
            catch (Exception)
            {
                obj = null;

            }


            return rol;
        }
        public static decimal FindRol( long cnomina,string centrocostocdetalle)
        {
            decimal total = 0;
          

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                 total = contexto.tnomrol.Where(x => x.cnomina == cnomina && x.centrocostocdetalle.Equals(centrocostocdetalle)).Sum(x => x.totalley.Value);

            }
            catch (Exception)
            {
                total = 0;

            }


            return total;
        }
        public static tnomrol BusquedaUltimoRol(long cfuncionario,string mes,long anio) {
            tnomrol obj = null;


            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnomrol.Where(x => x.cfuncionario == cfuncionario && x.tnomnomina.mescdetalle.Equals(mes) && x.tnomnomina.anio == anio).Single();

            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }
        public static IList<tnomrol> FindNomina(long cnomina)
        {
            List<tnomrol> obj = null;
           

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnomrol.Where(x => x.cnomina==cnomina).ToList();
                EntityHelper.SetActualizar(obj.ToList<IBean>());
            }
            catch (Exception)
            {
                obj = null;

            }


            return obj;
        }

        public static IList<tnomrol> FindRoles(long cfuncionario)
        {
            List<tnomrol> obj = null;


            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnomrol.Where(x => x.cfuncionario == cfuncionario).ToList();
                EntityHelper.SetActualizar(obj.ToList<IBean>());
            }
            catch (Exception)
            {
                obj = null;

            }


            return obj;
        }

    }
}
