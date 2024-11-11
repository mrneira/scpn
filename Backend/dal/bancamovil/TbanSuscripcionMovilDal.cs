using modelo;
using System.Collections.Generic;
using System.Linq;
using util.servicios.ef;

namespace dal.bancamovil
{
    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TbanSuscripcionMovil.
    /// </summary>
    public class TbanSuscripcionMovilDal
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="cusuario"></param>
        /// <returns></returns>
        public static tbansuscripcionmovil Find(string cusuario, string serial)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tbansuscripcionmovil.AsNoTracking().Where(x => x.cusuario == cusuario && x.serial==serial).SingleOrDefault();
        }

        public static List<tbansuscripcionmovil> FindActivoPorUsuario(string cusuario) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tbansuscripcionmovil.AsNoTracking().Where(x => x.cusuario == cusuario && x.estatuscusuariocdetalle == "ACT").ToList();
        }

        public static tbansuscripcionmovil FindActivoPorUsuario(string cusuario, string serial) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tbansuscripcionmovil.AsNoTracking().Where(x => x.cusuario.Equals( cusuario) && x.estatuscusuariocdetalle.Equals( "ACT") && x.serial.Equals(serial)).SingleOrDefault();
        }

    }

}
