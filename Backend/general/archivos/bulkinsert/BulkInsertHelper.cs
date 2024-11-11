using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Reflection;
using util;

namespace general.archivos.bulkinsert
{
    /// <summary>
    /// Clase que se encarga de procesar un datatable para realizar un bulkinsert
    /// </summary>
    public static class BulkInsertHelper
    {

        /// <summary>
        /// Funcion que permite realizar el bulkinsert a la base de datos
        /// </summary>
        /// <param name="lista"></param>
        /// <param name="nombretabla"></param>
        /// <returns></returns>
        public static bool Grabar<T>(this IList<T> lista, string nombretabla) {
            string connectionString = ConfigurationManager.ConnectionStrings["AtlasContexto"].ConnectionString.Replace("metadata=res://*/ModeloEF.csdl|res://*/ModeloEF.ssdl|res://*/ModeloEF.msl;provider=System.Data.SqlClient;provider connection string", "");
            connectionString = connectionString.Substring(connectionString.IndexOf("data source"));
            connectionString = connectionString.Substring(0, connectionString.Length - 1);
            DataTable tabla = ToDataTable(lista);
            using (SqlBulkCopy bulkCopy = new SqlBulkCopy(connectionString)) {
                bulkCopy.BulkCopyTimeout = 0;
                bulkCopy.DestinationTableName = nombretabla;
                try {
                    bulkCopy.WriteToServer(tabla);
                } catch (AtlasException) {
                    throw new AtlasException("GEN-030", "NO SE HA PODIDO REALIZAR EL BULK INSERT PARA TABLA {0}", nombretabla);
                }
            }
            return true;
        }

        /// <summary>
        /// Transforma una lista de objetos a datatable
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="items"></param>
        /// <returns></returns>
        public static DataTable ToDataTable<T>(this IList<T> list) {
            DataTable dataTable = new DataTable(typeof(T).Name);
            //Get all the properties by using reflection   
            PropertyInfo[] Props = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance | BindingFlags.DeclaredOnly);
            foreach (PropertyInfo prop in Props) {
                if (prop.PropertyType.FullName.Contains("modelo")) {
                    continue;
                }
                dataTable.Columns.Add(prop.Name);
            }
            foreach (T item in list) {
                var values = new object[dataTable.Columns.Count];
                for (int i = 0; i < dataTable.Columns.Count; i++) {
                    values[i] = Props[i].GetValue(item, null);
                }
                dataTable.Rows.Add(values);
            }

            return dataTable;

            //PropertyDescriptorCollection props = TypeDescriptor.GetProperties(typeof(T));
            //DataTable table = new DataTable();
            //for (int i = 0; i < props.Count; i++) {
            //    PropertyDescriptor prop = props[i];
            //    if (prop.IsBrowsable)
            //    table.Columns.Add(prop.Name, Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType);
            //}
            //object[] values = new object[props.Count];
            //foreach (T item in list) {
            //    for (int i = 0; i < values.Length; i++)
            //        values[i] = props[i].GetValue(item) ?? DBNull.Value;
            //    table.Rows.Add(values);
            //}
            //return table;
        }

    }

}
