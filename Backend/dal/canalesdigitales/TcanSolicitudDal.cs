using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.canalesdigitales {
    public class TcanSolicitudDal {

        #region METODOS
        public static tcansolicitud Find(long solicitud) {
            tcansolicitud obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tcansolicitud.AsNoTracking().FirstOrDefault(x => x.csolicitud == solicitud);
            return obj;
        }

        public static tcansolicitud FindPorUsuario(string cusuario, string token) {
            tcansolicitud obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tcansolicitud.AsNoTracking().FirstOrDefault(x => x.cusuario == cusuario && x.token == token);
            return obj;
        }

        public static long FindMaxValue() {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcansolicitud.AsNoTracking().Select(x => x.csolicitud).DefaultIfEmpty(0).Max();
        }
        #endregion

        #region MANTERNIMIENTO
        /// <summary>
        /// Se ingresa un registro
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static tcansolicitud Crear(tcansolicitud obj) {

            Sessionef.Grabar(obj);

            return obj;
        }

        /// <summary>
        /// Se actualiza un registro existente
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static tcansolicitud Actualizar(tcansolicitud obj) {

            Sessionef.Actualizar(obj);

            return obj;
        }

        /// <summary>
        /// Se elimina un registro en la base de datos        
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static tcansolicitud Eliminar(tcansolicitud obj) {

            Sessionef.Eliminar(obj);

            return obj;
        }

        #endregion


    }
}
