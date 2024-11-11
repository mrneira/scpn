using modelo;
using modelo.helper;
using modelo.interfaces;
using System;
using System.Data.SqlClient;
using System.Linq;
using util.servicios.ef;

namespace dal.generales {
    /// <summary>
    /// Clase que implementa dml's manuales contra la base de datos.
    /// </summary>
    public class TgenSecuenciaDal {

        /// <summary>
        /// Metodo que entrega los datos de una secuencia.
        /// </summary>
        /// <param name="csecuencia">Codigo de secuencia.</param>
        /// <returns></returns>
        public static tgensecuencia Find(AtlasContexto contexto, string csecuencia) {
            tgensecuencia obj = null; 

            obj = contexto.tgensecuencia.Where(x => x.csecuencia == csecuencia).SingleOrDefault();
            if (obj == null) {
                return null;
            }
            EntityHelper.SetActualizar(obj);
            return obj;
        }

        public static void Bloquear(string csecuencia) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tgensecuencia obj = null;

            obj = contexto.tgensecuencia.AsNoTracking().Where(x => x.csecuencia == csecuencia).SingleOrDefault();
        }

        /// <summary>
        /// Entrega el proximo valor de una secuencia.
        /// </summary>
        /// <param name="csecuencia">Codigo de secuencia a buscar el proximo valor.</param>
        /// <returns></returns>
        public static long GetProximoValor(AtlasContexto contexto, string csecuencia) {

            tgensecuencia s = TgenSecuenciaDal.Find(contexto, csecuencia);
            s.valoractual = s.valoractual + s.valorincremento;
            contexto.SaveChanges();
            IBean bean = (IBean)s;
            var set = contexto.Set(bean.GetType());
            set.Add(bean);

            return (long)s.valoractual;
        }

        public static void ActualizarSecuenciaPorSqlCommand(string csecuencia, long valoractual) {
            string SQL_UPDATE = "update tgensecuencia set valoractual = @valoractual where csecuencia = @csecuencia";
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try {
                contexto.Database.ExecuteSqlCommand(SQL_UPDATE, new SqlParameter("@valoractual", valoractual),
                                                            new SqlParameter("@csecuencia", csecuencia));
            } catch (System.InvalidOperationException) {

            }

        }
    }
}
