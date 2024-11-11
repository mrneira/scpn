using modelo;
using modelo.helper;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.facturacion
{

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla tconparametros.
    /// </summary>
    public class TfacProductoDal
    {

        /// <summary>
        /// 
        /// </summary>
        /// <param name="cproducto"></param>
        /// <returns></returns>
        public static tfacproducto FindInDataBase(long? cproducto)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tfacproducto obj = null;
            obj = contexto.tfacproducto.Where(x => x.cproducto == cproducto).SingleOrDefault();

            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

        /// <summary>
        /// Entrega el codigo contable, dada un producto a facturar.
        /// </summary>
        /// <param name="cproducto"></param>
        /// <returns>Codigo contabledel producto</returns>
        public static string GetCodigoContable(long? cproducto) {
            tfacproducto p = TfacProductoDal.FindInDataBase(cproducto);
            if (p.codigocontable == null || p.codigocontable.Equals("")) {
                throw new AtlasException("FAC-006", "CODIGO CONTABLE NO DEFINIDO PARA EL PRODUCTO: [{0}] [{1}]", cproducto, p.nombre);
            }
            return p.codigocontable;
        }

    }
}
