using util.servicios.ef;
using modelo;
using System.Data.SqlClient;
using System.Collections.Generic;
using System;

using System.Linq;
using modelo.helper;
using modelo.interfaces;
using System.Data;
using modelo.servicios;

namespace dal.inversiones.tablaamortizacion
{
    /// <summary>
    /// Clase que encapsula los procedimientos funcionales para las tablas de amortización.
    /// </summary>
    public class TinvTablaAmortizacionDal
    {

        /// <summary>
        /// Obtiene la tabla de dividendos, dado el identificador de la inversión.
        /// </summary>
        /// <param name="cinversion">Identificador de la inversión.</param>
        /// <returns>IList<Dictionary<string, object>></returns>
        public static IList<Dictionary<string, object>> GetTablaPagos(long cinversion)
        {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();
            string storeprocedure = "sp_InvConTablaPagos";
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@icinversion"] = cinversion;
            DataTable DataTable = dal.storeprocedure.StoreProcedureDal.GetDataTable(storeprocedure, parametros,0);
            IList<Dictionary<string, object>> list = DataTable.AsEnumerable().Select(dr => {
                var dic = new Dictionary<string, object>();
                dr.ItemArray.Aggregate(-1, (int i, object v) => {
                    i += 1; dic.Add(DataTable.Columns[i].ColumnName, v);
                    return i;
                });
                return dic;
            }).ToList();

            return list;
        }


        /// <summary>
        /// Obtiene la tabla de amortización, dado el identificador de la inversión.
        /// </summary>
        /// <param name="cinversion">Identificador de la inversión.</param>
        /// <returns>List<tinvtablaamortizacion></returns>
        public static List<tinvtablaamortizacion> Find(long cinversion)
        {

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tinvtablaamortizacion> lista = new List<tinvtablaamortizacion>();

            lista = contexto.tinvtablaamortizacion.AsNoTracking().Where(x => x.cinversion == cinversion).ToList();

            return lista;

        }

        /// <summary>
        /// Obtiene los dividendos pendientes y vencidos de una tabla de amortización, por estados.
        /// </summary>
        /// <returns>IList<tinvtablaamortizacion></returns>
        public static IList<tinvtablaamortizacion> FindEstado()
        {
            IList<tinvtablaamortizacion> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tinvtablaamortizacion.AsNoTracking().Where(x => (x.estadocdetalle.Equals("VEN")  || x.estadocdetalle.Equals("PEN")) && x.tinvinversion.estadocdetalle.Equals("APR")).ToList();
            }
            catch (Exception ex)
            {
                obj = null;

            }
            return obj;
        }


        /// <summary>
        /// Obtiene la tabla de amortización de las inversiones aprobadas, ordenadas por fecha de vencimiento.
        /// </summary>
        /// <returns>IList<Dictionary<string, object>><tinvtablaamortizacion></returns>
        public static IList<Dictionary<string, object>> GetVencimientos()
        {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            Dictionary<string, object> parametros = new Dictionary<string, object>();

            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, "select distinct ttabamo.fvencimiento fvencimiento from tinvtablaamortizacion ttabamo inner join tinvinversion tinv on tinv.cinversion = ttabamo.cinversion where tinv.estadocdetalle = 'APR' order by ttabamo.fvencimiento");

            ch.registrosporpagina = 900000000;

            IList<Dictionary<string, object>> ldatos = ch.GetRegistrosDictionary();
            return ldatos;
        }


        /// <summary>
        /// Obtiene la tabla de inversiones, dado un estado de la inversión.
        /// </summary>
        /// <param name="estado">Identificador del estado de la inversión.</param>
        /// <returns>IList<tinvinversion></returns>
        public static IList<tinvinversion> FindEstados(string estado)
        {
            IList<tinvinversion> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tinvinversion.AsNoTracking().Where(x => x.estadocdetalle.Equals(estado)).ToList();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }

        private static string UPDESTADO = "update tinvtablaamortizacion set estadocdetalle = @estadocdetalle where cinvtablaamortizacion in (SELECT distinct cinvtablaamortizacion FROM tinvcontabilizacion"
            + " where ccomprobante = @ccomprobante "
            + " and ccompania = @ccompania "
            + " and fcontable = @fcontable )";

        /// <summary>
        /// Actualiza el estado de una tabla de amortización, dado el comprobante contable.
        /// </summary>
        /// <param name="iccomprobante">Identificador del comprobante contable.</param>
        /// <param name="ifcontable">Fecha contable.</param>
        /// <param name="iccompania">Identificador de la compañía.</param>
        /// <param name="iestadocdetalle">Nuevo estado de los dividendos.</param>
        /// <returns></returns>
        public void UpdateEstado(string iccomprobante, int ifcontable, int iccompania, string iestadocdetalle)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(
                UPDESTADO,
                new SqlParameter("@estadocdetalle ", iestadocdetalle),
                new SqlParameter("@ccomprobante", iccomprobante),
                new SqlParameter("@ccompania", iccompania),
                new SqlParameter("@fcontable", ifcontable));
        }


        private static string UPDPRECANCELA = "UPDATE tinvtablaamortizacion SET estadocdetalle = 'PRECAN', cusuariomod = @cusuariomod, fmodificacion = getdate() where cinversion = @cinversion and estadocdetalle not in ('PAG','PRECAN')";

        /// <summary>
        /// Asigna el estado precancelado a los dividendos de una tabla de amortización, dado el identificador de la inversión.
        /// </summary>
        /// <param name="icinversion">Identificador la inversión.</param>
        /// <param name="icusuariomod">Usuario que ejecuta el cambio de estado.</param>
        /// <returns></returns>
        public void UpdatePrecancela(long icinversion, string icusuariomod)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(
                UPDPRECANCELA,
                new SqlParameter("@cusuariomod", icusuariomod),
                new SqlParameter("@cinversion", icinversion));
        }

        /// <summary>
        /// Obtiene los dividendos pendientes de una inversión.
        /// </summary>
        /// <param name="cinversion">Identificador la inversión.</param>
        /// <returns>List<tinvtablaamortizacion></returns>
        public static List<tinvtablaamortizacion> FindCuotasPorInversionPendientes(long cinversion)
        {
            List<tinvtablaamortizacion> obj = new List<tinvtablaamortizacion>();
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tinvtablaamortizacion.AsNoTracking().Where(x => x.cinversion == cinversion && x.estadocdetalle== "PEN").OrderBy(x => x.cinvtablaamortizacion).ToList();
            EntityHelper.SetActualizar(obj.ToList<IBean>());
            return obj;
        }

        /// <summary>
        /// Obtiene un dividendo de la tabla de amortización, dado su identificador.
        /// </summary>
        /// <param name="cinvtablaamortizacion">Identificador del dividendo de la tabla de amortización.</param>
        /// <returns>tinvtablaamortizacion</returns>
        public static tinvtablaamortizacion FindCuotaPrimeraPendiente(long cinvtablaamortizacion)
        {
            tinvtablaamortizacion obj = new tinvtablaamortizacion();
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tinvtablaamortizacion.Where(x => x.cinvtablaamortizacion == cinvtablaamortizacion).SingleOrDefault();
            EntityHelper.SetActualizar(obj);
            return obj;
        }

        /// <summary>
        /// Obtiene la primera cuota pendiente de una tabla de amortización, dado el identificador de la inversión.
        /// </summary>
        /// <param name="cinversion">Identificador de la inversión.</param>
        /// <returns>tinvtablaamortizacion</returns>
        public static tinvtablaamortizacion FindCuotaPrimeraPendientePor(long cinversion)
        {
            tinvtablaamortizacion obj = new tinvtablaamortizacion();
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tinvtablaamortizacion.Where(x => x.cinversion == cinversion && x.estadocdetalle == "PEN").OrderBy(x => x.cinvtablaamortizacion).SingleOrDefault();
            EntityHelper.SetActualizar(obj);
            return obj;
        }

        /// <summary>
        /// Obtiene la cuotas pendientes de una tabla de amortización, dado el identificador de la inversión.
        /// </summary>
        /// <param name="cinversion">Identificador de la inversión.</param>
        /// <returns>tinvtablaamortizacion</returns>
        public static List<tinvtablaamortizacion> FindCuotasPendientes(long cinversion)
        { 
            List<tinvtablaamortizacion> obj = new List<tinvtablaamortizacion>();
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tinvtablaamortizacion.Where(x => x.cinversion == cinversion && x.estadocdetalle == "PEN").OrderBy(x => x.cinvtablaamortizacion).ToList();
            EntityHelper.SetActualizar(obj.ToList<IBean>());
            return obj;
        }

        /// <summary>
        /// Entrega la lista de cuotas pagadas de una inversion.
        /// </summary>
        /// <param name="cinversion">Identificador de la inversión.</param>
        /// <returns>tinvtablaamortizacion</returns>
        public static tinvtablaamortizacion FindCuotaUltimaPagada(long cinversion)
        {
            tinvtablaamortizacion obj = new tinvtablaamortizacion();
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tinvtablaamortizacion.Where(x => x.cinversion == cinversion && x.estadocdetalle=="PAG").OrderByDescending(x=> x.cinvtablaamortizacion).SingleOrDefault();
            EntityHelper.SetActualizar(obj);
            return obj;
        }

        private static string DEL = "delete from tinvtablaamortizacion where cinversion = @cinversion ";

        /// <summary>
        /// Elimina los dividendos de una inversión, dado el identificador de la inversión.
        /// </summary>
        /// <param name="icinversion">Identificador de la inversión.</param>
        /// <returns></returns>
        public static void Delete(long icinversion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(
                DEL,
                new SqlParameter("cinversion", icinversion));
        }


        private static string DELE = "delete from tinvtablaamortizacion";

        /// <summary>
        /// Elimina todas las tablas de amortización.
        /// </summary>
        /// <returns></returns>
        public static void DeleteAll()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(
                DELE);
        }



    }
}
