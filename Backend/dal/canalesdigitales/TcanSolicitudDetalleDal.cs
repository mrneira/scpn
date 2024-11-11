using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.canalesdigitales {
    public class TcanSolicitudDetalleDal {


        #region METODOS
        public static tcansolicituddetalle Find(long csolicitud, int cproducto, int ctipoproducto) {

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcansolicituddetalle.AsNoTracking().FirstOrDefault(x => x.csolicitud == csolicitud && x.cproducto == cproducto && x.ctipoproducto == ctipoproducto);
        }
        #endregion

        #region MANTERNIMIENTO
        public static tcansolicituddetalle Crear(tcansolicituddetalle obj) {
            Sessionef.Grabar(obj);
            return obj;
        }

        public static tcansolicituddetalle Actualizar(tcansolicituddetalle obj) {
            Sessionef.Actualizar(obj);
            return obj;
        }
        #endregion
    }
}
