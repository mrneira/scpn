using System;
using modelo;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;
using util;

namespace dal.cartera {
    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TcarProductoRangos.
    /// </summary>
    public class TcarProductoRangosDal {
        /// <summary>
        /// Metodo que entrega la definicion de TcarProductoRangos
        /// </summary>
        /// <param name="cmodulo">Codigo de modulo</param>
        /// <param name="cproducto">Codigo de producto</param>
        /// <param name="ctipoproducto">Codigo de tipo de producto</param>
        /// <param name="monto">Monto de rango</param>
        /// <returns>List<TcarProductoRangos></returns>
        public static List<tcarproductorangos> find(int cmodulo, int cproducto, int ctipoproducto, decimal monto)
        {
            List<tcarproductorangos> ldatos = null;
            ldatos = TcarProductoRangosDal.findInDataBase(cmodulo, cproducto, ctipoproducto, monto);
            return ldatos;
        }

        /// <summary>
        /// Metodo que entrega la definicion de TcarProductoRangos
        /// </summary>
        /// <param name="cmodulo">Codigo de modulo</param>
        /// <param name="cproducto">Codigo de producto</param>
        /// <param name="ctipoproducto">Codigo de tipo de producto</param>
        /// <param name="monto">Monto de rango</param>
        /// <returns>TcarProductoRangos</returns>
        public static tcarproductorangos findRango(int cmodulo, int cproducto, int ctipoproducto, decimal monto)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcarproductorangos obj = null;
            obj = contexto.tcarproductorangos.AsNoTracking().Where(x => x.cmodulo == cmodulo
                                                                        && x.cproducto == cproducto
                                                                        && x.ctipoproducto == ctipoproducto
                                                                        && x.montominimo <= monto
                                                                        && x.montomaximo >= monto).SingleOrDefault();
            if (obj == null) {
                throw new AtlasException("CAR-0031", "MONTO NO SE ENCUENTRA PARAMETRIZADO");
            }
            return obj;
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de rango de montos asociados a un producto de cartera
        /// </summary>
        /// <param name="cmodulo">Codigo de modulo</param>
        /// <param name="cproducto">Codigo de producto</param>
        /// <param name="ctipoproducto">Codigo de tipo de producto</param>
        /// <param name="monto">Monto de rango</param>
        /// <returns>List<TcarProductoRangos></returns>
        public static List<tcarproductorangos> findInDataBase(int cmodulo, int cproducto, int ctipoproducto, decimal monto)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tcarproductorangos> ldatos = null;

            ldatos = contexto.tcarproductorangos.AsNoTracking().Where(x => x.cmodulo == cmodulo
                                                                       && x.cproducto == cproducto
                                                                       && x.ctipoproducto == ctipoproducto
                                                                       && x.montominimo <= monto
                                                                       && x.montomaximo >= monto).ToList();
            return ldatos;
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de rangos
        /// </summary>
        /// <param name="cmodulo">Codigo de modulo</param>
        /// <param name="cproducto">Codigo de producto</param>
        /// <param name="ctipoproducto">Codigo de tipo de producto</param>
        /// <param name="monto">Monto de rango</param>
        /// <returns>List<TcarProductoRangos></returns>
        public static List<tcarproductorangos> findInDataBase(int cmodulo, int cproducto, int ctipoproducto)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tcarproductorangos> ldatos = null;

            ldatos = contexto.tcarproductorangos.AsNoTracking().Where(x => x.cmodulo == cmodulo
                                                                       && x.cproducto == cproducto
                                                                       && x.ctipoproducto == ctipoproducto).ToList();
            return ldatos;
        }
    }
}
