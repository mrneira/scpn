using modelo;
using System.Collections.Generic;
using System.Linq;
using util.servicios.ef;

namespace dal.seguros {
    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TsgsPolizaDto.
    /// </summary>

    public class TsgsPolizaDal {
        /// <summary>
        /// Consulta en la base de datos la definicion de la poliza.
        /// </summary>
        /// <param name="coperacioncartera">Codigo de operacion de cartera.</param>
        /// <param name="coperaciongarantia">Codigo de operacion de garantia.</param>
        /// <returns>IList<TsgsPolizaDto></returns>
        public static List<tsgspoliza> Find(string coperacioncartera, string coperaciongarantia)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tsgspoliza.AsNoTracking().Where(x => x.coperacioncartera == coperacioncartera && x.coperaciongarantia == coperaciongarantia).ToList();
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de la poliza.
        /// </summary>
        /// <param name="coperacioncartera">Codigo de operacion de cartera.</param>
        /// <param name="coperaciongarantia">Codigo de operacion de garantia.</param>
        /// <returns>IList<TsgsPolizaDto></returns>
        public static tsgspoliza FindPolizaPen(string coperacioncartera, string coperaciongarantia)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tsgspoliza.AsNoTracking().Where(x => x.coperacioncartera == coperacioncartera && x.coperaciongarantia == coperaciongarantia && x.cdetalleestado == "PEN").SingleOrDefault();
        }

        /// <summary>
        /// Secuencia de poliza por Operacion de Cartera y Garantia.
        /// </summary>
        /// <param name="coperacioncartera">Codigo de operacion de cartera.</param>
        /// <param name="coperaciongarantia">Codigo de operacion de garantia.</param>
        /// <returns>int</returns>
        public static int GetSecuencia(string coperacioncartera, string coperaciongarantia)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            int secuencia = 1;

            IList<tsgspoliza> lpoliza = Find(coperacioncartera, coperaciongarantia);
            if (lpoliza.Count > 0) {
                secuencia = lpoliza.Max(x => x.secuencia) + 1;
            }
            return secuencia;
        }

        /// <summary>
        /// Poliza vigente por Operacion de Cartera y Garantia.
        /// </summary>
        /// <param name="coperacioncartera">Codigo de operacion de cartera.</param>
        /// <param name="coperaciongarantia">Codigo de operacion de garantia.</param>
        /// <param name="fpoliza">Fecha de validacion de poliza.</param>
        /// <returns>TsgsPolizaDto</returns>
        public static tsgspoliza GetPolizaVigente(string coperacioncartera, string coperaciongarantia, int fpoliza)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tsgspoliza polizavigente = null;

            IList<tsgspoliza> lpoliza = Find(coperacioncartera, coperaciongarantia);
            foreach (tsgspoliza pol in lpoliza) {
                if (pol.finicio <= fpoliza && pol.fvencimiento >= fpoliza) {
                    polizavigente = pol;
                }
            }
            return polizavigente;
        }

        /// <summary>
        /// Consulta el número de documento
        /// </summary>
        /// <param name="numeropoliza">Número de poliza.</param>
        public static tsgspoliza FindNumeroPoliza(string numeropoliza)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tsgspoliza obj = contexto.tsgspoliza.Where(x => x.numeropoliza == numeropoliza).SingleOrDefault();
            return obj;
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de la poliza actual en base al seguro.
        /// </summary>
        /// <param name="coperacioncartera">Codigo de operacion de cartera.</param>
        /// <param name="coperaciongarantia">Codigo de operacion de garantia.</param>
        /// <returns>IList<TsgsPolizaDto></returns>
        public static tsgspoliza FindPoliza(tsgsseguro tsgsseguro)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tsgspoliza.AsNoTracking().Where(x => x.coperacioncartera == tsgsseguro.coperacioncartera
                                                              && x.coperaciongarantia == tsgsseguro.coperaciongarantia
                                                              && x.secuencia == tsgsseguro.secuenciapoliza).SingleOrDefault();
        }


        /// <summary>
        /// Consulta en la base de datos la definicion de la poliza actual en base al seguro.
        /// </summary>
        /// <param name="coperacioncartera">Codigo de operacion de cartera.</param>
        /// <param name="coperaciongarantia">Codigo de operacion de garantia.</param>
        /// <param name="secuenciapoliza">secuencia max de garantia.</param>
        /// <returns>IList<TsgsPolizaDto></returns>
        public static tsgspoliza FindPolizaCan(string coperacioncartera, string coperaciongarantia, int secuenciapoliza)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tsgspoliza obj = contexto.tsgspoliza.AsNoTracking().Where(x => x.coperacioncartera == coperacioncartera
                                                               && x.coperaciongarantia == coperaciongarantia
                                                               && x.secuencia == secuenciapoliza).SingleOrDefault();

            return obj;
        }

    }
}
