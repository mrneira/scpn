using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace canalesdigitales.servicios {
    public class DeleteAnidadoThread {
        public static void Eliminar(int? ccompania, IBean bean) {
            Dictionary<string, object> mdatos = new Dictionary<string, object> {
                ["cia"] = ccompania,
                ["bean"] = bean
            };
            DeleteAnidadoThread upd = new DeleteAnidadoThread();
            Thread thread = new Thread(upd.Ejecutar);
            thread.Start(mdatos);
        }

        public void Ejecutar(object datos) {
            AtlasContexto contexto = new AtlasContexto();

            using (var contextoDB = contexto.Database.BeginTransaction()) {
                try {
                    Dictionary<string, object> mdatos = (Dictionary<string, object>)datos;
                    IBean bean = (IBean)mdatos["bean"];
                    var set = contexto.Set(bean.GetType());
                    set.Add(bean);
                    contexto.Entry(bean).State = System.Data.Entity.EntityState.Deleted;
                    contexto.SaveChanges();
                    contextoDB.Commit();

                } catch (Exception e) {
                    contextoDB.Rollback();
                } finally {
                    contextoDB.Dispose();
                }
            }
        }
    }
}
