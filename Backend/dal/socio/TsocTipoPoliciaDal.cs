using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.socio {
    /// <summary>
    /// Clase que implemeta, dml's de la tabla tipo policia
    /// </summary>
    public class TsocTipoPoliciaDal {
        /// <summary>
        /// Entrega datos vigentes de una persona.
        /// </summary>
        /// <param name="cpersona">Codigo de persona.</param>
        /// <param name="ccompania">Codigo de compania.</param>
        /// <returns></returns>
        public static tsoctipopolicia Find(long ctipopolicia) {
            tsoctipopolicia obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try {
                obj = contexto.tsoctipopolicia.Where(x => x.ctipopolicia == ctipopolicia).Single();
            } catch(Exception) {
                obj = null;
            }

            return obj;
        }
        /// <summary>
        /// Busca el tipo de policia por decripcion
        /// </summary>
        /// <param name="descripcion"></param>
        /// <returns></returns>
        public static tsoctipopolicia FindToDescripcion(string descripcion) {
            tsoctipopolicia obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try {
                obj = contexto.tsoctipopolicia.Where(x => x.descripcion == descripcion).Single();
            } catch(Exception) {
                obj = null;
            }

            return obj;
        }
    }
}
