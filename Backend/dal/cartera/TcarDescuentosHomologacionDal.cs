using modelo;
using System.Collections.Generic;
using System.Linq;
using util.servicios.ef;

namespace dal.cartera {

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TcarDescuentosHomologacionDto.
    /// </summary>
    public class TcarDescuentosHomologacionDal {

        /// <summary>
        /// Consulta en la base de datos el registro de homologacion de descuentos.
        /// </summary>
        /// <param name="cproducto">Codigo de producto.</param>
        /// <param name="ctipoproducto">Codigo de tipop producto.</param>
        /// <param name="crelacion">Codigo de relacion de persona.</param>
        /// <returns>TcarDescuentosHomologacionDto</returns>
        public static tcardescuentoshomologacion Find(int cproducto, int ctipoproducto, int crelacion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcardescuentoshomologacion obj = contexto.tcardescuentoshomologacion.Where(x => x.cproducto == cproducto &&
                                                                                            x.ctipoproducto == ctipoproducto &&
                                                                                            x.crelacion == crelacion).SingleOrDefault();

            return obj;
        }

        /// <summary>
        /// Busca en la base de datos la lista de productos homologados de descuentos.
        ///// </summary>
        /// <param name="cproductoarchivo">Codigo de producto archivo.</param>
        /// <returns>TcarDescuentosHomologacionDto</returns>
        public static IList<tcardescuentoshomologacion> Find(int cproductoarchivo)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tcardescuentoshomologacion> lhomologacion = contexto.tcardescuentoshomologacion.AsNoTracking().Where(x => x.cproductoarchivo == cproductoarchivo).ToList();
            return lhomologacion;
        }

    }
}
