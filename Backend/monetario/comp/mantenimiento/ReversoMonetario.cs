using core.componente;
using dal.monetario;
using modelo;
using modelo.interfaces;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.enums;
using util.movimiento;

namespace monetario.comp.mantenimiento {

    /// <summary>
    /// Clase que se encarga de ejecutar reverso de transacciones monetarias. Obtiene lista de movimientos de todas las tablas de movimientos asociadas al numero de mensaje agrupadas por transaccion y numero de  operacion.
    /// Ejecuta el monetario para cada transaccion operacion, fija el numero de operacion en el request en cada iteracion de ejecucion de la lista.
    /// Cada modulo implementa la busqueda y la ejecucion de reversos de sus transacciones. 
    /// </summary>
    public class ReversoMonetario : ComponenteMantenimientoReverso {

        /// <summary>
        /// Ejecuta reversos monetarios.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void EjecutarReverso(RqMantenimiento rqmantenimiento) {
            // Por modulo se parametriza la clase que se encarga de hacer reversos.
            // se obtiene una lista de modulos a reversar, se invoca a una clase dinamica por modulo para ejecutar el reverso.
            // cada modulo reversa lo que correspondiente a su modulo.
            IList<tmonmovimiento> ldatos = TmonMovimientoDal.Find(rqmantenimiento.Mensajereverso);
            if (ldatos.Count() <= 0) {
                throw new AtlasException("MON-003", "NO EXISTE MOVIMIENTOS A REVERSAR ASOCIADOS AL MENSAJE: {0}", rqmantenimiento.Mensajereverso);
            }
            foreach (tmonmovimiento mov in ldatos) {
                if (mov.mensajereverso != null) {
                    throw new AtlasException("MON-004", "MOVIMIENTOS  ASOCIADOS AL MENSAJE: {0}  REVERSADOS PREVIAMENTE", rqmantenimiento.Mensajereverso);
                }
                // actualiza el mensaje como reversado.
                mov.mensajereverso = rqmantenimiento.Mensajereverso;
                // Ejecuta el reverso por modulo.
                IReverso reverso = EnumModulos.GetEnumModulos((int)mov.cmodulo).GetInstanciaReverso();
                reverso.Ejecutar(rqmantenimiento, mov);
            }

        }

    }
}
