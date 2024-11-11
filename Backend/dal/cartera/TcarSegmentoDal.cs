using modelo;
using System.Collections.Concurrent;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.cartera {
    public class TcarSegmentoDal {

        /// <summary>
        /// Metodo que entrega la definicion de un segmento de credito. Busca los datos en cahce, si no encuentra los datos en cache busca en la
        /// base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="csegmento">Codigo de segmento de cartera.</param>
        /// <returns></returns>
        public static tcarsegmento Find(string csegmento) {
            try {
                tcarsegmento obj = null;
                CacheStore cs = CacheStore.Instance;
                string key = "" + csegmento;
                obj = (tcarsegmento)cs.GetDatos("tcarsegmento", key);
                if (obj == null) {
                    ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tcarsegmento");
                    obj = TcarSegmentoDal.FindInDataBase(csegmento);
                    m.TryAdd(key, obj);
                    cs.PutDatos("tcarsegmento", m);
                }
                return obj;
            } catch {
                return null;
            }
        }


        /// <summary>
        /// Entrega la defincion de un segmento de cartera.
        /// </summary>
        /// <param name="csegmento">Codigo de segmento</param>
        /// <returns></returns>
        public static tcarsegmento FindInDataBase(string csegmento) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcarsegmento.AsNoTracking().Where(x => x.csegmento.Equals(csegmento)).SingleOrDefault();
        }

        /// <summary>
        /// Valida tasa maxima legal por segmento.
        /// </summary>
        /// <param name="csegmento">Codigo de segmento de cartera.</param>
        /// <param name="tasaEfectiva">Valor de la tasa a validar que no pase la maxima legal.</param>
        /// <returns></returns>
        public static void ValidaTasaMaximaLegal(string csegmento, decimal tasaEfectiva) {
            tcarsegmento tcs = TcarSegmentoDal.Find(csegmento);
            if (tasaEfectiva > tcs.tasamaxima) {
                throw new AtlasException("BCAR-0025", "TASA EFECTIVA {0} EXECE DE LA MAXIMA LEGAL {1} DEL SEGMENTO {2}", tasaEfectiva,
                        tcs.tasamaxima, csegmento + "-" + TcarSegmentoDal.Find(csegmento).nombre);
            }

        }
    }

}
