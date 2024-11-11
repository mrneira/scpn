using modelo;
using modelo.helper;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.facturacion
{

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla tfacimpuesto.
    /// </summary>
    public class TfacImpuestoDal
    {
       
        /// <summary>
        /// 
        /// </summary>
        /// <param name="cfactura"></param>
        /// <returns></returns>
        public static tfacimpuesto FindInDataBase(long? cimpuesto)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tfacimpuesto obj = null;
            obj = contexto.tfacimpuesto.Where(x => x.cimpuesto == cimpuesto).SingleOrDefault();

            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

        /// <summary>
        /// Entrega el codigo contable, para el impuesto a facturar.
        /// </summary>
        /// <param name="cimpuesto">Codigo de impuesto.</param>
        /// <returns>Codigo contabledel producto</returns>
        public static string GetCodigoContable(int? cimpuesto) {
            tfacimpuesto imp = TfacImpuestoDal.FindInDataBase(cimpuesto);
            if (imp.codigocontable == null || imp.codigocontable.Equals("")) {
                throw new AtlasException("FAC-007", "CODIGO CONTABLE NO DEFINIDO PARA EL IMPUESTO: [{0}] [{1}]", cimpuesto, imp.nombre);
            }
            return imp.codigocontable;
        }
    }
}
