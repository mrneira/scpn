using dal.generales;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using util;

namespace core.servicios {

    public class Secuencia {

        private static object syncRoot = new Object();

        /// <summary>
        /// Entrega el proximo numero de secuencia dado el codigo de secuencia.
        /// </summary>
        /// <param name="csecuencia">Codigo de secuencia.</param>
        public static long GetProximovalor(string csecuencia) {
            Dictionary<string, object> mdatos = new Dictionary<string, object> {
                ["csecuencia"] = csecuencia
            };
            Secuencia secuencia = new Secuencia();
            Thread thread = new Thread(secuencia.Ejecutar);
            thread.Start(mdatos);
            thread.Join();
            if (!mdatos.ContainsKey("sec")) {
                throw new AtlasException("GEN-026", "SECUENCIA: {0} NO DEFINIDA EN LA TABLA SECUENCIAS", csecuencia);
            }
            return (long)mdatos["sec"];
        }

        /// <summary>
        /// Obtiene y actualiza en la base el proximo codigo de secuencia.
        /// </summary>
        /// <param name="datos"></param>
        public void Ejecutar(object datos) {
            AtlasContexto contexto = new AtlasContexto();

            using (var contextoDB = contexto.Database.BeginTransaction()) {
                try {
                    Dictionary<string, object> mdatos = (Dictionary<string, object>)datos;
                    string csecuencia = (string)mdatos["csecuencia"];

                    long numsecuencia = TgenSecuenciaDal.GetProximoValor(contexto, csecuencia);
                    mdatos["sec"] = numsecuencia;
                    contextoDB.Commit();
                } catch (Exception) {
                    contextoDB.Rollback();
                } finally {
                    contextoDB.Dispose();
                }
            }
        }
    }

}
