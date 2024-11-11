using modelo;
using modelo.helper;
using modelo.interfaces;
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
    /// Clase que implemeta, dml's de la tabla terminal
    /// </summary>
    public class TsegTerminalDal {
        /// <summary>
        /// Entrega la definicion de un terminal.
        /// </summary>
        /// <param name="mac">Mac address del terminal.</param>
        /// <param name="compania">Codigo de compania.</param>
        /// <returns></returns>
        public static tsegterminal Find(string mac, int compania) {

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tsegterminal obj = null;

            obj = contexto.tsegterminal.Where(x => x.mac == mac && x.ccompania == compania && x.verreg == 0).Single();
            if(obj == null) {
                throw new AtlasException("BSEG-001", "TERMINAL NO DEFINO EN TSEGTERMINAL");
            }
            EntityHelper.SetActualizar(obj);
            return obj;

        }

    }
}
