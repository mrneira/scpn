using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.talentohumano
{
    public class TnomSolicitudDal
    {
        /// <summary>
        /// Consulta en la base de datos la definicion de tnomsolicitud.
        /// </summary>
        /// <returns>IList<tnomsolicitud></returns>
        public static IList<tnomsolicitud> FindInDataBase()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tnomsolicitud> ldatos = ldatos = contexto.tnomsolicitud.AsNoTracking().ToList();
            return ldatos;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de tnomsolicitud por csolicitud.
        /// </summary>
        /// <returns>tnomsolicitud</returns>
        public static tnomsolicitud FindAnio(long csolicitud)
        {
            tnomsolicitud obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnomsolicitud.Where(x => x.csolicitud == csolicitud).Single();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de tnomsolicitud por csolicitud.
        /// </summary>
        /// <returns>IList<tnomsolicitud></returns>
        public static IList<tnomsolicitud> Find(long csolicitud)
        {
            IList<tnomsolicitud> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnomsolicitud.AsNoTracking().Where(x => x.csolicitud == csolicitud).ToList();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de tnomsolicitud por tipo.
        /// </summary>
        /// <returns>IList<tnomsolicitud></returns>
        public static IList<tnomsolicitud> FindTipoEstado(string tipo,bool estado)
        {
            IList<tnomsolicitud> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnomsolicitud.AsNoTracking().Where(x =>  x.tipocdetalle.Equals(tipo) && x.finalizada==true && x.aprobada ==estado).ToList();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de tnomsolicitud para el director ejecutivo no aprobadas.
        /// </summary>
        /// <returns>IList<tnomsolicitud></returns>
        public static IList<tnomsolicitud> FindDE(bool estado)
        {
            IList<tnomsolicitud> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnomsolicitud.AsNoTracking().Where(x =>x.adir==estado && x.finalizada==false).ToList();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de tnomsolicitud para el jefe no aprobadas.
        /// </summary>
        /// <returns>IList<tnomsolicitud></returns>
        public static IList<tnomsolicitud> FindJefe(bool estado, long jefecfuncionario)
        {
            IList<tnomsolicitud> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnomsolicitud.AsNoTracking().Where(x => x.ajefe == estado && x.cfuncionariojefe == jefecfuncionario && x.finalizada == false).ToList();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de tnomsolicitud para el departamento de Talento Humano no aprobadas.
        /// </summary>
        /// <returns>IList<tnomsolicitud></returns>
        public static IList<tnomsolicitud> FindTalentoHumano(bool estado)
        {
            IList<tnomsolicitud> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnomsolicitud.AsNoTracking().Where(x => x.estado == estado && x.finalizada == false).ToList();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de tnomsolicitud para el empleado.
        /// </summary>
        /// <returns>IList<tnomsolicitud></returns>
        public static IList<tnomsolicitud> FindEmpleado(bool estado, long cfuncionario)
        {
            IList<tnomsolicitud> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnomsolicitud.AsNoTracking().Where(x => x.estado == estado && x.cfuncionario == cfuncionario).OrderBy(x => x.fingreso).ToList();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }
    }
}
