using modelo;
using System.Collections.Generic;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.cartera {

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TcarSegmentoTasasFrec.
    /// </summary>
    public class TcarSegmentoTasasFrecDal {

        /// <summary>
        /// Metodo que entrega la definicion de TcarSegmentoTasasFrec asociadas a un segmento de credito. Busca los datos en cahce, si no 
        /// encuentra los datos en cache busca en la base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="csegmento">Codigo de segmento de credito.</param>
        /// <param name="cmoneda">Codigo de tipo de moneda.</param>
        /// <param name="cfrecuencia">Codigo de frecuencia.</param>
        /// <param name="plazo">Plazo de la operacion.</param>
        /// <returns>IList<TcarSegmentoTasasFrecDto></returns>
        public static List<tcarsegmentotasasfrec> Find(string csegmento, string cmoneda, int cfrecuencia, int plazo) {
            List<tcarsegmentotasasfrec> ldatos = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            ldatos = contexto.tcarsegmentotasasfrec.Where(x => x.csegmento.Equals(csegmento) &&
                                                               x.cmoneda.Equals(cmoneda) &&
                                                               x.cfrecuecia == cfrecuencia &&
                                                               x.verreg == 0 &&
                                                               x.activo.Value.Equals(true)).ToList();

            if (ldatos.Count.Equals(0)) {
                throw new AtlasException("BCAR-0028", "TASA NO DEFINIDA EN TCARSEGMENTOTASASFREC SEGMENTO: {0} MONEDA: {1} FRECUENCIA: {2} PLAZO: {3}", csegmento, cmoneda, cfrecuencia, plazo);
            }
            return ldatos;
        }

        /// <summary>
        /// Entrega la definicion de una tasa para un segmento de credito.
        /// </summary>
        /// <param name="csegmento">Codigo de segmento de credito.</param>
        /// <param name="cmoneda">Codigo de moneda.</param>
        /// <param name="csaldo">Codigo de saldo asociado a una tasa.</param>
        /// <param name="cfrecuencia">Codigo de frecuencia.</param>
        /// <param name="plazo">Plazo de la operacion.</param>
        /// <returns>TcarSegmentoTasasFrecDto</returns>
        public static tcarsegmentotasasfrec Find(string csegmento, string cmoneda, string csaldo, int cfrecuencia, int plazo) {
            tcarsegmentotasasfrec obj = null;
            List<tcarsegmentotasasfrec> ltasas = TcarSegmentoTasasFrecDal.Find(csegmento, cmoneda, cfrecuencia, plazo);
            foreach (tcarsegmentotasasfrec tasasegmento in ltasas) {
                if (tasasegmento.csaldo.Equals(csaldo)) {
                    obj = tasasegmento;
                    break;
                }
            }
            return obj;
        }

    }




}
