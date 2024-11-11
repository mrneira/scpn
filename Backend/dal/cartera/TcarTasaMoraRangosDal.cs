using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.servicios.ef;

namespace dal.cartera {

    public class TcarTasaMoraRangosDal {

        /// <summary>
        /// Entrega una lista de tasas de mora por rangos.
        /// </summary>
        /// <returns>IList<tcartasamorarangos></returns>
        public static IList<tcartasamorarangos> Find() {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tcartasamorarangos> ldatos = null;
            ldatos = contexto.tcartasamorarangos.AsNoTracking().ToList();

            if (ldatos == null) {
                throw new AtlasException("BCAR-0030", "TASA DE MORA NO DEFINIDA EN TCARTASAMORARANGOS");
            }
            return ldatos;
        }

        /// <summary>
        /// Entrega la definicion de tasa de mora para dias de vencimiento.
        /// </summary>
        /// <param name="dias">Numero de dias de vencido una cuota.</param>
        /// <returns></returns>
        public static tcartasamorarangos Find(int dias) {
            IList<tcartasamorarangos> lrangos = TcarTasaMoraRangosDal.Find();
            tcartasamorarangos obj = null;
            foreach (tcartasamorarangos tasa in lrangos) {
                if ((tasa.diasdesde <= dias) && (tasa.diashasta >= dias)) {
                    obj = tasa;
                    break;
                }
            }
            return obj;
        }
    }
}
