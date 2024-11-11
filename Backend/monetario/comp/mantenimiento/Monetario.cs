using core.componente;
using dal.monetario;
using modelo;
using modelo.interfaces;
using monetario.util;
using System.Collections.Generic;
using System.Linq;
using util.dto.mantenimiento;

namespace monetario.comp.mantenimiento {

    /// <summary>
    /// Clase que se encarga de ejecutar transacciones monetarias.
    /// </summary>
    public class Monetario : ComponenteMantenimiento {

        /// <summary>
        /// Ejecuta monetario. 
        /// </summary>
        /// <param name="rqmantenimiento">Request que contien informacion para ejecutar el monetario.</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            tgentransaccion tran = (tgentransaccion)rqmantenimiento.Tgentransaccion;
            bool reverso = rqmantenimiento.Reverso != "N" ? true : false;
            if (!reverso && (bool)tran.mapearubros) {
                // mapea rubros del request con los definidos en tmonrubromapeoconcepto
                TmonRubroMapeoConceptoDal.MapearRubros(rqmantenimiento);
            }
            new ComprobanteMonetario(rqmantenimiento);
        }

    }
}


