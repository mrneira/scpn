using core.componente;
using modelo.interfaces;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace contabilidad.comp.mantenimiento.reportes {

    /// <summary>
    /// Clase que se encarga de realizar el rollup de saldos creando la tabla temporal TconSaldosUsuario, la informacion de esta tabla se puede  utilizar para reportes y/o consultas.
    /// </summary>
    class RollupSaldos : ComponenteMantenimiento {

        /// <summary>
        /// Actualiza saldos en cuentas padre o rollup de saldos para presentar en reportes y/o consultas.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            // Obtiene la fecha de ejecucion del reporte.
            if (rqmantenimiento.Mdatos["fejecucion"] == null) {
                // si no llega la fecha no puede hacer el rollup de saldos.
                throw new AtlasException("CONTA-002", "FECHA DE PROCESO REQUERIDA PARA REALIZAR EL ROLLUP DE SALDOS");
            }
            int fejecucion = (int)rqmantenimiento.GetInt("fejecucion");
        }

    }
}
