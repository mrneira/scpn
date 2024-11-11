using modelo;
using modelo.servicios;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using util.dto;

namespace core.util
{
    public class SqlExceptionUtil
    {
        public static void LlenarMensajeSqlException(System.Data.SqlClient.SqlException e, Response response)
        {
            Dictionary<string, object> mdatos = new Dictionary<string, object>
            {
                ["exce"] = e,
                ["resp"] = response
            };
            SqlExceptionUtil eu = new SqlExceptionUtil();
            AtlasContexto contexto = new AtlasContexto();
            eu.GetMensajeSqlException(e, response, contexto); 

        }

        public void Ejecutar(object datos)
        {
            AtlasContexto contexto = new AtlasContexto();
            using (var atlasdb = contexto.Database.BeginTransaction())
            {
                try
                {
                    Dictionary<string, object> mdatos = (Dictionary<string, object>)datos;
                    System.Data.SqlClient.SqlException e = (System.Data.SqlClient.SqlException)mdatos["exce"];
                    Response response = (Response)mdatos["resp"];
                    this.GetMensajeSqlException(e, response, contexto);
                }
                catch (Exception)
                {
                    atlasdb.Rollback();
                }
                finally
                {
                    atlasdb.Dispose();
                }
            }
        }

        /// <summary>
        /// Manejod e mensajes de base de datos.
        /// </summary>
        /// <param name="e"></param>
        /// <returns></returns>
        public void GetMensajeSqlException(System.Data.SqlClient.SqlException e, Response response, AtlasContexto contexto)
        {

            if (e.Number.CompareTo(2627) == 0)
            {  // PK duplicado
                response.SetCod("2627");
                response.SetMsgusu(GetPKMessage(e.Message, contexto));
                return;
            }
            if (e.Number.CompareTo(547) == 0)
            {  // FK 
                response.SetCod("547");
                response.SetMsgusu(GetFKMessage(e.Message, contexto));
                return;
            }
            response.SetCod(e.Number.ToString());
            response.SetMsgusu(e.Message);
        }

        /// <summary>
        /// Entrega el mensaje de error de usuario cuando esta ingresando registros duplicados.
        /// </summary>
        /// <param name="mensaje"></param>
        /// <returns></returns>
        private string GetPKMessage(string mensaje, AtlasContexto contexto)
        {
            int ini = mensaje.IndexOf("'") + 1;
            int fin = mensaje.IndexOf("'.");
            string pk = mensaje.Substring(ini, fin - ini);
            //return "ESTA INSERTANDO REGISTROS DUPLICADOS EN LA TABLA: [" + SqlExceptionUtil.GetNombreTablaPk(pk, contexto) + "]";
            return "ESTA INSERTANDO REGISTROS DUPLICADOS";
        }

        private string GetFKMessage(string mensaje,AtlasContexto contexto)
        {
            int ini = mensaje.IndexOf("\"") + 1;
            int fin = mensaje.IndexOf("\".");
            string fk = mensaje.Substring(ini, fin - ini);
            object[] obj = GetNombreTablaFk(fk,contexto);
            string tabla = (string)obj[0];
            string tablapadre = (string)obj[1];
            //return "ESTA ELIMINANDO REGISTROS DE LA TABLA: [" + tablapadre + "] PERO EXISTE REGISTROS DEPENDIENTES EN LA TABLA [" + tabla + "]";
            return "ESTA ELIMINANDO REGISTROS, PERO EXISTE REGISTROS DEPENDIENTES";
        }

        /// <summary>
        /// Entrega el nombre de tabla dado el nombre de 
        /// </summary>
        /// <param name="pkconstraint">Nombre del constraint de pk a buscar la tabla.</param>
        /// <returns>string</returns>
        private static string GetNombreTablaPk(string pkconstraint, AtlasContexto contexto)
        {
            string nombre = string.Empty;
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@pkconstraint"] = pkconstraint;
            ConsultaHelper consultaHelper = new ConsultaHelper(contexto, parametros, SqlExceptionUtil.SQL_PK);
            IList<Dictionary<string, object>> ldatos = consultaHelper.GetRegistroDictionary();
            foreach (Dictionary<string, object> item in ldatos)
            {
                nombre = item["nombre"].ToString();
            }
            return nombre;
        }

        private static object[] GetNombreTablaFk(string fkconstraint,AtlasContexto contexto)
        {
            object[] obj = null;
            Dictionary <string, object> parametros = new Dictionary<string, object>();
            parametros["@fkconstraint"] = fkconstraint;
            ConsultaHelper consultaHelper = new ConsultaHelper(contexto, parametros, SqlExceptionUtil.SQL_FK);
            IList<Dictionary<string, object>> ldatos = consultaHelper.GetRegistrosDictionary();
            foreach(Dictionary<string, object> item in ldatos)
            {
                obj = new object[item.Count];
                obj[0] = item["tname"];
                obj[1] = item["tnamepadre"];
            }
            return obj;
            
        }

        private static string SQL_PK = "SELECT t.Name as nombre "
            + " FROM sys.tables t "
            + " INNER JOIN  sys.key_constraints dc ON t.object_id = dc.parent_object_id "
            + " and dc.name = @pkconstraint order by nombre ";

        private static string SQL_FK = "SELECT object_name(parent_object_id) as tname, object_name(referenced_object_id) as tnamepadre "
            + " FROM sys.foreign_keys "
            + "  where name = @fkconstraint order by tname ";
    }
}
