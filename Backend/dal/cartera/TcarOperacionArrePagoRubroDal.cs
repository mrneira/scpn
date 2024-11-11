using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using util.servicios.ef;

namespace dal.cartera {

    public class TcarOperacionArrePagoRubroDal {

        /// <summary>
        /// Entrega la defincion de rubros a aplicar en el arreglo de pagos.
        /// </summary>
        /// <param name="coperacion"></param>
        /// <returns></returns>
        public static List<tcaroperacionarrepagorubro> Find(string coperacion, long csolicitud)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcaroperacionarrepagorubro.Where(x => x.coperacion == coperacion && x.csolicitud == csolicitud && x.pagoobligatorio == true).ToList();
        }

        /// <summary>
        /// Entrega la defincion de rubros a aplicar en el arreglo de pagos.
        /// </summary>
        /// <param name="coperacion"></param>
        /// <returns></returns>
        public static List<tcaroperacionarrepagorubro> FindAprobacion(string coperacion, long csolicitud)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcaroperacionarrepagorubro.Where(x => x.coperacion == coperacion && x.csolicitud == csolicitud).ToList();
        }

        /// <summary>
        /// Entrega la definicion de un rubro dado el codigo de saldo.
        /// </summary>
        /// <param name="lRubros">Lista de rubros a buscar por codigo de saldo.</param>
        /// <param name="csaldo">Codigo de saldo a buscar en la lista.</param>
        /// <returns></returns>
        public static tcaroperacionarrepagorubro Find(List<tcaroperacionarrepagorubro> lRubros, String csaldo)
        {
            tcaroperacionarrepagorubro obj = null;
            foreach (tcaroperacionarrepagorubro rubro in lRubros) {
                if (rubro.csaldo.Equals(csaldo)) {
                    obj = rubro;
                    break;
                }
            }
            return obj;
        }

    }

}
