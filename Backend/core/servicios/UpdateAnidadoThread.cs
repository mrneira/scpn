using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace core.servicios
{
    public class UpdateAnidadoThread
    {
        /// <summary>
        /// Actualiza el bean en la base de datos.
        /// </summary>
        /// <param name="ccompania"></param>
        /// <param name="bean"></param>
        public static void Actualizar(int ccompania, IBean bean)
        {
            Dictionary<string, object> mdatos = new Dictionary<string, object>
            {
                ["cia"] = ccompania,
                ["bean"] = bean
            };
            UpdateAnidadoThread upd = new UpdateAnidadoThread();
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
                    IBean bean = (IBean)mdatos["bean"];  //string csecuencia = (string)mdatos["csecuencia"];
                    var set = contexto.Set(bean.GetType());
                    set.Add(bean);
                    contexto.Entry(bean).State = System.Data.Entity.EntityState.Modified;
                    contexto.SaveChanges();
                    contextoDB.Commit();
                }
                catch (Exception e)
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