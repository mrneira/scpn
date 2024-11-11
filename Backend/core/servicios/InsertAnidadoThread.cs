using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace core.servicios
{
    public class InsertAnidadoThread
    {
        /// <summary>
        /// Actualiza el bean en la base de datos.
        /// </summary>
        /// <param name="ccompania"></param>
        /// <param name="bean"></param>
        public static void Grabar(int? ccompania, IBean bean)
        {
            Dictionary<string, object> mdatos = new Dictionary<string, object>
            {
                ["cia"] = ccompania,
                ["bean"] = bean
            };
            InsertAnidadoThread upd = new InsertAnidadoThread();
            Thread thread = new Thread(upd.Ejecutar);
            thread.Start(mdatos); // Nunca poner un join para que se ejecute el insert en un hilo diferente.
        }
        public static void GrabarJoin(int? ccompania, IBean bean)
        {
            Dictionary<string, object> mdatos = new Dictionary<string, object>
            {
                ["cia"] = ccompania,
                ["bean"] = bean
            };
            InsertAnidadoThread upd = new InsertAnidadoThread();
            Thread thread = new Thread(upd.Ejecutar);
            thread.Start(mdatos); // Nunca poner un join para que se ejecute el insert en un hilo diferente.
            thread.Join();
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
                    IBean bean = (IBean)mdatos["bean"];  //string csecuencia = (string)mdatos["csecuencia"];
                    var set = contexto.Set(bean.GetType());
                    set.Add(bean);
                    //contexto.Database.Log = sql => Debug.Write(sql);
                    contexto.SaveChanges();
                    contextoDB.Commit();
                    
                }
                catch(Exception e)
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
