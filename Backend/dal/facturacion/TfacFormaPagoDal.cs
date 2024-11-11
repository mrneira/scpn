using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.servicios.ef;

namespace dal.facturacion {

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla tfacformapago.
    /// </summary>
    public class TfacFormaPagoDal {

        /// <summary>
        /// Entrega la definicion de una forma de pago de facturas.
        /// </summary>
        /// <param name="cformapago">Codigo de forma de pago</param>
        /// <returns></returns>
        public static tfacformapago FindInDataBase(string cformapago) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tfacformapago obj = null;
            obj = contexto.tfacformapago.Where(x => x.cformapago == cformapago).SingleOrDefault();
            return obj;
        }

        /// <summary>
        /// Entrega el codigo contable, dada una forma de pago.
        /// </summary>
        /// <param name="cformapago"></param>
        /// <returns></returns>
        public static string GetCodigoContable(string cformapago) {
            tfacformapago fp = TfacFormaPagoDal.FindInDataBase(cformapago);
            if(fp.codigocontable == null || fp.codigocontable.Equals("")) {
                throw new AtlasException("FAC-004", "CODIGO CONTABLE NO DEFINIDO PARA EL TIPO DE PAGO: [{0}] [{1}]", cformapago, fp.nombre);
            }
            return fp.codigocontable;
        }
    }
}
