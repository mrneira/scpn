using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace core.servicios
{
    public class QueryAnidadoThread
    {
        /// <summary>
        /// Actualiza el bean en la base de datos.
        /// </summary>
        /// <param name="ccompania"></param>
        /// <param name="mparams"></param>
        /// <param name="hql"></param>
        public static void Actualizar(int ccompania, Dictionary<string, object> mparams, string hql)
        {
            Dictionary<string, object> mdatos = new Dictionary<string, object>
            {
                ["cia"] = ccompania,
                ["mparams"] = mparams,
                ["hql"] = hql
            };
            QueryAnidadoThread upd = new QueryAnidadoThread();
            Thread thread = new Thread(upd.Ejecutar);
            thread.Start(mdatos);
        }

        /// <summary>
        /// Actulia en la base de datos los datos del bean.
        /// </summary>
        /// <param name="datos"></param>    
        public void Ejecutar(object datos)
        {
            AtlasContexto contexto = new AtlasContexto();

            using (var contextoDB = contexto.Database.BeginTransaction())
            {
                try
                {
                    Dictionary<string, object> mdatos = (Dictionary<string, object>)datos;
                    // IBean bean = (IBean)mdatos["bean"];  //string csecuencia = (string)mdatos["csecuencia"];
                    Dictionary<string, object> mparams = (Dictionary<string, object>)mdatos["mparams"];
                    string hql = (string)mdatos["hql"];
                    Dictionary<string, object>.KeyCollection s = mparams.Keys;
                    object[] paramsobj = new object[s.Count()];
                    int i = 0;
                    foreach (string key in s) {
                        paramsobj[i] = new SqlParameter(key, mparams[key]);
                        i++;
                    }
                    contexto.Database.ExecuteSqlCommand(hql, paramsobj);
                    contexto.SaveChanges();
                    contextoDB.Commit();
                    
                }
                catch (Exception)
                {
                    contextoDB.Rollback();
                }
                finally
                {
                    contextoDB.Dispose();
                }
            }




        }

    }
}


