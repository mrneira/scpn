using modelo;
using modelo.helper;
using System;
using System.Linq;
using util.servicios.ef;

namespace dal.generales
{

    /// <summary>
    /// Clase que implementa dml's manuales contra la base de datos.
    /// </summary>
    public class TgenSucursalDal
    {

        /// <summary>
        /// Entrega la definicion de una sucursal.
        /// </summary>
        /// <param name="csucursal">Codigo de sucursal.</param>
        /// <param name="ccompania">Codigo de compania.</param>
        /// <returns></returns>
        public static tgensucursal Find( int csucursal, int ccompania)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tgensucursal obj = null;

            obj = contexto.tgensucursal.AsNoTracking().Where(x => x.csucursal.Equals(csucursal) && x.ccompania.Equals(ccompania)).SingleOrDefault();
            if (obj == null)
            {
                return null;
            }
            EntityHelper.SetActualizar(obj);
            return obj;
        }
    }
}
