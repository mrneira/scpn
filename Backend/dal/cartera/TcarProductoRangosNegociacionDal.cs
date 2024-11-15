using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;
using util;

namespace dal.cartera
{
    public class TcarProductoRangosNegociacionDal
    {
        /// <summary>
        /// Metodo que entrega la definicion de TcarProductoRangos
        /// </summary>
        /// <param name="cmodulo">Codigo de modulo</param>
        /// <param name="cproducto">Codigo de producto</param>
        /// <param name="ctipoproducto">Codigo de tipo de producto</param>
        /// <param name="monto">Monto de rango</param>
        /// <returns>TcarProductoRangos</returns>
        public static tcarproductorangosnegociacion findRango(int cmodulo, int cproducto, int ctipoproducto, decimal monto)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcarproductorangosnegociacion obj = null;
            return obj = contexto.tcarproductorangosnegociacion.AsNoTracking().Where(x => x.cmodulo == cmodulo && x.cproducto == cproducto && x.ctipoproducto == ctipoproducto && x.montominimo <= monto && x.montomaximo >= monto).SingleOrDefault();
        }
    }
}
