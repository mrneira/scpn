using core.componente;
using modelo;
using System.Collections.Generic;
using System.Linq;
using util.dto.mantenimiento;

namespace talentohumano.comp.mantenimiento.funcionario
{

    /// <summary>
    /// Clase que se encarga de completar los datos faltantes de una direccion
    /// </summary>
 
    public  class CargasFamiliares : ComponenteMantenimiento {

        /// <summary>
        /// Metodo que se encarga de completar los datos faltantes de cargas familiares para el funcionario 
        /// </summary>
        /// <param name="rm">Request del mantenimiento</param>
        public override void Ejecutar(RqMantenimiento rm) {
            if (rm.GetTabla("CARGASFAMILIARES") == null || !rm.GetTabla("CARGASFAMILIARES").Lregistros.Any()) {
                return;
            }
            long? cfuncionario = rm.GetLong("cfuncionario");
            List<tthfamiliar> ldatos = rm.GetTabla("CARGASFAMILIARES").Lregistros.Cast<tthfamiliar>().ToList();
            foreach (tthfamiliar obj in ldatos) {
                if (obj.cfuncionario == 0) {
                    obj.cfuncionario = (long)cfuncionario;
                }
            }
        }

    }
}
