using modelo;
using util.servicios.ef;
using System.Data.SqlClient;

using System.Collections.Generic;

using System.Linq;
using System.Data;
using modelo.helper;


using dal.generales;
using dal.monetario;
using modelo.interfaces;
using modelo.servicios;
using System;
using util;
using util.dto.mantenimiento;


namespace dal.inversiones.plantillacontable
{
    /// <summary>
    /// Clase que encapsula los procedimientos funcionales de la plantilla contable.
    /// </summary>
    public class TinvPlantillaContableDal
    {

        private static string DELE = "delete tinvplantillacontable where entidadccatalogo = @ccatalogo ";

        /// <summary>
        /// Elimina una plantilla contable, dado el identificador del catálogo de la entidad.
        /// </summary>
        /// <param name="ientidadccatalogo">Identificador del catálogo de la entidad.</param>
        /// <returns></returns>
        public static void Delete(int ientidadccatalogo = 1213)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(
                DELE,
                new SqlParameter("ccatalogo", ientidadccatalogo));
        }

        /// <summary>
        /// Genera la plantilla contable.
        /// </summary>
        /// <param name="cusuario">Identificador del usuario.</param>
        /// <returns>IList<Dictionary<string, object>></returns>
        public static IList<Dictionary<string, object>> generaPlantilla(string cusuario)
        {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();
            string storeprocedure = "sp_InvManPlantillaContable";
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@cusuarioing"] = cusuario;
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
        /// Busca un emisor por su identificador.
        /// </summary>
        /// <param name="icdetalle">Identificador del detalle del catálogo.</param>
        /// <param name="iccatalogo">Identificador del catálogo.</param>
        /// <returns>tgencatalogodetalle</returns>
        public static List<tinvplantillacontable> FindPorCDetalle(string irubrocdetalle, int irubroccatalogo = 1219)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tinvplantillacontable> lista = new List<tinvplantillacontable>();
            //tinvplantillacontable obj = null;
            lista = contexto.tinvplantillacontable.AsNoTracking().Where(x => x.rubroccatalogo == irubroccatalogo && x.rubrocdetalle.Equals(irubrocdetalle)).ToList();
            return lista;

        }

        public static List<tinvplantillacontable> FindBancos(string irubrocdetalle, int irubroccatalogo, int ientidadccatalogo, string ientidadcdetalle)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tinvplantillacontable> lista = new List<tinvplantillacontable>();
            //tinvplantillacontable obj = null;
            lista = contexto.tinvplantillacontable.AsNoTracking().Where(x => x.rubroccatalogo == irubroccatalogo 
                && x.rubrocdetalle.Equals(irubrocdetalle)
                && x.entidadccatalogo == ientidadccatalogo 
                && x.entidadcdetalle.Equals(ientidadcdetalle)).ToList();
            return lista;

        }

        // select distinct ccuenta from tinvplantillacontable where rubrocdetalle = 'BANCOS' and entidadccatalogo = 1224 and entidadcdetalle = 'BC'


    }
}
