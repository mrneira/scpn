using modelo;
using modelo.helper;
using modelo.servicios;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.servicios.ef;

namespace dal.seguridades {

    /// <summary>
    /// Clase que implemeta, consultas manuales de la tabla TsegHorarioUsuario.
    /// </summary>
    public class TsegHorarioUsuarioDal {


        /// <summary>
        /// Metodo que entrega la definicion de horarios, crear, editar, eliminar. Busca los datos en cahce, si no encuentra
        /// los datos en cache busca en la base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="cusuario">Codigo de usuario.</param>
        /// <param name="ccompania">Codigo de compania al que pertence el usuario.</param>
        /// <param name="diasemana">Dia de la semana, Domingo->1, Lunes->2 etc</param>
        /// <returns>TsegHorarioUsuarioDto</returns>
        public static tseghorariousuario FindActivo(int ccompania, string cusuario, int diasemana) {
            tseghorariousuario obj = null;
            //String key = "" + ccompania + "^" + cusuario + "^" + diasemana;
            //CacheStore cs = CacheStore.Instance;
            //obj = (tseghorariousuario)cs.GetDatos("tseghorariousuario", key);
            //if(obj == null) {
             //   ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tseghorariousuario");
                obj = FindInDataBase(ccompania, cusuario, diasemana);
                if(obj == null || obj.activo == null || obj.activo == false) {
                    return null;
                }
                //m.TryAdd(key, obj);
                //cs.PutDatos("tseghorariousuario", m);
            //}
            return obj;
        }
        /// <summary>
        /// Metodo que entrega consulta el horario a la base de datos
        /// </summary>
        /// <param name="cusuario">Codigo de usuario.</param>
        /// <param name="ccompania">Codigo de compania al que pertence el usuario.</param>
        /// <param name="diasemana">Dia de la semana, Domingo->1, Lunes->2 etc</param>
        /// <returns>TsegHorarioUsuarioDto</returns>
        public static tseghorariousuario FindInDataBase(int ccompania, string cusuario, int diasemana) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tseghorariousuario obj = null;
            obj = contexto.tseghorariousuario.AsNoTracking().Where(x => x.ccompania == ccompania && x.cusuario == cusuario && x.diasemana == diasemana && x.verreg == 0).SingleOrDefault();
            if(obj == null) {
                return null;
            }
            EntityHelper.SetActualizar(obj);
            return obj;
        }

        /**
 * Sentencia que entrega la definicion de TsegHorarioUsuario por usuario.
 */
        /*private static string JPQL_HORARIO_USR = "select (select p.nombre from TperPersonaDetalle p"
            + "where p.cpersona = u.cpersona and p.ccompania = u.ccompania and p.verreg = @verreg) as NOMBRE"
            + ",t.* from TsegHorarioUsuario t, TsegUsuarioDetalle u where t.cusuario = u.cusuario"
            + "and t.ccompania = u.ccompania and t.cusuario = @cusuario and t.ccompania = @ccompania and t.verreg = @verreg and u.verreg = @verreg";*/

        public static IList<tseghorariousuario> FindInDataBase(int ccompania, string cusuario) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tseghorariousuario> ldata = new List<tseghorariousuario>();
            ldata = contexto.tseghorariousuario.AsNoTracking().Where(x => x.cusuario == cusuario && x.ccompania == ccompania && x.verreg == 0).ToList();
            return ldata;
        }
        public static tseghorariousuario Crear() {
            tseghorariousuario obj = new tseghorariousuario();
            return obj;
        }


    }
}
