using modelo;
using modelo.helper;
using System;
using System.Collections.Concurrent;
using System.Data.SqlClient;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.generales
{

    public class TgenOperacionNumeroDal {

        private static String SQL = "select * from tgenoperacionnumero t  where t.cmodulo = @cmodulo "
            + " and coalesce(cproducto,@cproducto) = @cproducto  and coalesce(ctipoproducto,@ctipoproducto) = @ctipoproducto "
            + " and coalesce(cagencia,@cagencia) = @cagencia and coalesce(csucursal,@csucursal) = @csucursal "
            + " and coalesce(ccompania,@ccompania) = @ccompania ";
        /// <summary>
        /// Entrega un objeto con la definicion de secuencias de operaciones por modulo.<br> 
        /// La secuencia se puede definir por producto, subproducto, agencia, sucursal o una combinacion de ellos.
        /// </summary>
        /// <param name="cmodulo">Codigo de modulo.</param>
        /// <param name="cproducto">Codigo de producto.</param>
        /// <param name="ctipoproducto">Codigo de tipo de producto.</param>
        /// <param name="csucursal">Codigo de sucursal.</param>
        /// <param name="cagencia">Codigo de agencia.</param>
        /// <param name="ccompania">Codigo de compania.</param>
        /// <returns></returns>
        public static tgenoperacionnumero FindWithhold(int? cmodulo, int? cproducto, int? ctipoproducto, int? csucursal, int? cagencia, int? ccompania)
        {

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tgenoperacionnumero obj = null;

            obj = contexto.tgenoperacionnumero.SqlQuery(SQL, new SqlParameter("@cmodulo", cmodulo),
                                                             new SqlParameter("@cproducto", cproducto),
                                                             new SqlParameter("@ctipoproducto", ctipoproducto),
                                                             new SqlParameter("@csucursal", csucursal),
                                                             new SqlParameter("@cagencia", cagencia),
                                                             new SqlParameter("@ccompania", ccompania)).SingleOrDefault();
            if (obj == null)
            {
                throw new AtlasException("BGEN-012", "SECUENCIA PARA OBTENER NUMERO DE OPERACION NO DEFINIDA EN TGENOPERACIONNUMERO PARA EL MODULO: {0}", cmodulo);
            }
            EntityHelper.SetActualizar(obj);
            return obj;
        }

        /// <summary>
        /// Entrega el numero de operaciones por modulo.<br> 
        /// La secuencia se puede definir por producto, subproducto, agencia, sucursal o una combinacion de ellos.
        /// </summary>
        /// <param name="cmodulo">Codigo de modulo.</param>
        /// <param name="cproducto">Codigo de producto.</param>
        /// <param name="ctipoproducto">Codigo de tipo de producto.</param>
        /// <param name="csucursal">Codigo de sucursal.</param>
        /// <param name="cagencia">Codigo de agencia.</param>
        /// <param name="ccompania">Codigo de compania.</param>
        /// <returns></returns>
        public static String GetNumeroOperacion(int cmodulo, int cproducto, int ctipoproducto, int csucursal, int cagencia, int ccompania) {
            long? numerooperacion = null;
            tgenoperacionnumero obj = TgenOperacionNumeroDal.FindWithhold(cmodulo, cproducto, ctipoproducto, csucursal, cagencia, ccompania);
            numerooperacion = obj.secoperacion;
            numerooperacion = numerooperacion + 1;
            obj.secoperacion = (long)numerooperacion;
            return numerooperacion.ToString();

        }

    }

}
