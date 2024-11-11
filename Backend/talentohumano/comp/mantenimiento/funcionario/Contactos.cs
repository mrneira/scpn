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
    /// <author>amerchan</author>
    public  class Contactos : ComponenteMantenimiento {

        /// <summary>
        /// Metodo que se encarga de completar los datos faltantes
        /// </summary>
        /// <param name="rm">Request del mantenimiento</param>
        public override void Ejecutar(RqMantenimiento rm) {
            if (rm.GetTabla("CONTACTO") == null || !rm.GetTabla("CONTACTO").Lregistros.Any()) {
                return;
            }
            long? cfuncionario = rm.GetLong("cfuncionario");
            List<tthcontacto> ldatos = rm.GetTabla("CONTACTO").Lregistros.Cast<tthcontacto>().ToList();
            foreach (tthcontacto obj in ldatos) {
                if (obj.cfuncionario == 0) {
                    obj.cfuncionario = (long)cfuncionario;
                }
            }
        }
    }
}
