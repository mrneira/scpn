using modelo;
using System.Linq;
using util.servicios.ef;

namespace dal.bancaenlinea
{
    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TbanSuscripcion.
    /// </summary>
    public class TbanSuscripcionDal
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="cusuario"></param>
        /// <returns></returns>
        public static tbansuscripcion FindPorUsuario(string cusuario)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tbansuscripcion.AsNoTracking().Where(x => x.cusuario == cusuario).SingleOrDefault();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="identificacion"></param>
        /// <returns></returns>
        public static tbansuscripcion FindPorIdentificacion(string identificacion) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tbansuscripcion.AsNoTracking().Where(x => x.identificacion == identificacion).SingleOrDefault();
        }

        /// <summary>
        /// Crea un objeto TbanUsuarios
        /// </summary>
        /// <param name="tbansubscripcion"></param>
        /// <param name="cpersona"></param>
        /// <returns></returns>
        public static tbanusuarios ToTbanUsuarios(tbansuscripcion tbansubscripcion, long cpersona) {
            tbanusuarios t = new tbanusuarios();
            t.cusuario = tbansubscripcion.cusuario;
            t.verreg = 0;
            t.cpersona = cpersona;
            t.email = tbansubscripcion.email;
            t.estatuscusuariocatalogo = 2302;
            t.estatuscusuariocdetalle = "ACT";
            t.fregistro = tbansubscripcion.fingreso;
            t.password = tbansubscripcion.password;
            Sessionef.Grabar(t);
            return t;
        }


    }

}
