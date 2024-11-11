using dal.generales;
using modelo;
using System;
using System.Collections.Concurrent;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Runtime.Remoting;
using util;
using util.dto.interfaces.lote;
using util.dto.mantenimiento;
using util.interfaces;
using util.servicios.ef;

namespace dal.lote {
    /// <summary>
    ///     Clase que implementa, dml's manuales 
    /// </summary>
    public class TlotePrevioDal {

        /// <summary>
        /// Ejecuta un backup de la base de datos
        /// </summary>
        public static void EjecutarBackup(RqMantenimiento rq) {
            int numeroejecucion = TloteControlEjecucionDal.GetNumeroEjecucion(rq.Fproceso.Value, "BACKUP_BASEDATOS");

            string SQL_INSERT_LOTECONTROLEJECUCION = "insert into tlotecontrolejecucion (fproceso, clote, numeroejecucion, ctransaccion, cmodulo, estatus) " + 
                " values (@fproceso,@clote,@numeroejecucion,@ctransaccion,@cmodulo,@estatus)";


            string NombreBaseDatos, RutaArchivoBackup;
            try {
                NombreBaseDatos  = TgenParametrosDal.Find("NOMBRE_BASE_DATOS", rq.Ccompania).texto;
                RutaArchivoBackup = @TgenParametrosDal.Find("RUTA_ARCHIVO_BACKUP", rq.Ccompania).texto;
            }catch (AtlasException) {
                throw new AtlasException("GEN-028", "PARAMETROS NO DEFINIDOS (NOMBRE_BASE_DATOS, RUTA_ARCHIVO_BACKUP)");
            }

            string infoadicional = "";
            if (rq.Mdatos["infoadicional"] != null) {
                infoadicional = rq.Mdatos["infoadicional"].ToString().Replace(" ","");
            }

            RutaArchivoBackup += @"\" + NombreBaseDatos + "_" + infoadicional.Trim() + "_FR" + DateTime.Now.Year.ToString() + String.Format("{0:00}", DateTime.Now.Month.ToString()) + String.Format("{0:00}", DateTime.Now.Day.ToString())
                                + "_" + String.Format("{0:00}", DateTime.Now.Hour) + String.Format("{0:00}", DateTime.Now.Minute) + String.Format("{0:00}", DateTime.Now.Second) + "_FC" + rq.Fconatable.ToString();  
            string SQL_BACKUP = " BACKUP DATABASE " + NombreBaseDatos +  " TO DISK = '" + @RutaArchivoBackup + "' WITH INIT, COMPRESSION";
            string connectionString = ConfigurationManager.ConnectionStrings["AtlasContexto"].ConnectionString.Replace("metadata=res://*/ModeloEF.csdl|res://*/ModeloEF.ssdl|res://*/ModeloEF.msl;provider=System.Data.SqlClient;provider connection string", "");
            connectionString = connectionString.Substring(connectionString.IndexOf("data source"));
            connectionString = connectionString.Substring(0, connectionString.Length - 1);

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try {
                contexto.Database.ExecuteSqlCommand(SQL_INSERT_LOTECONTROLEJECUCION, new SqlParameter("@fproceso", rq.Fproceso),
                                                    new SqlParameter("@clote", "BACKUP_BASEDATOS"),
                                                    new SqlParameter("@numeroejecucion", numeroejecucion),
                                                    new SqlParameter("@ctransaccion", rq.Ctransaccion),
                                                    new SqlParameter("@cmodulo", rq.Cmodulo),
                                                    new SqlParameter("@estatus", "P"));
            } catch (System.InvalidOperationException) {
                throw new AtlasException("GEN-029", "NO SE HA PODIDO OBTENER EL BACKUP DE LA BASE DE DATOS");
            }

            using (var sqlConnection = new SqlConnection(connectionString)) {
                using (var sqlCommand = new SqlCommand(SQL_BACKUP, sqlConnection)) {
                    try {
                        sqlConnection.Open();
                        sqlCommand.CommandTimeout = 0;
                        sqlCommand.ExecuteNonQuery();
                    }catch (Exception ex) {
                        throw new AtlasException("GEN-029", "NO SE HA PODIDO OBTENER EL BACKUP DE LA BASE DE DATOS");
                    }
                }
            }

            string SQL_UPDATE_LOTECONTROLEJECUCION = "update tlotecontrolejecucion set estatus = 'F' " +
                " where  fproceso = @fproceso and  clote = @clote and numeroejecucion = @numeroejecucion and " + 
                " ctransaccion = @ctransaccion and  cmodulo = @cmodulo and estatus = 'P'";
            try {
                contexto.Database.ExecuteSqlCommand(SQL_UPDATE_LOTECONTROLEJECUCION, new SqlParameter("@fproceso", rq.Fproceso),
                                                    new SqlParameter("@clote", "BACKUP_BASEDATOS"),
                                                    new SqlParameter("@numeroejecucion", numeroejecucion),
                                                    new SqlParameter("@ctransaccion", rq.Ctransaccion),
                                                    new SqlParameter("@cmodulo", rq.Cmodulo),
                                                    new SqlParameter("@estatus", "F"));
            } catch (System.InvalidOperationException) {
                throw new AtlasException("GEN-029", "NO SE HA PODIDO OBTENER EL BACKUP DE LA BASE DE DATOS");
            }

        }
    }
}
