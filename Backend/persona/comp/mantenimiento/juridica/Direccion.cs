using core.componente;
using modelo;
using System.Collections.Generic;
using System.Linq;
using util.dto.mantenimiento;

namespace persona.comp.mantenimiento.juridica {

    /// <summary>
    /// Clase que se encarga de completar los datos faltantes de una direccion
    /// </summary>
    /// <author>amerchan</author>
    public  class Direccion : ComponenteMantenimiento {

        /// <summary>
        /// Metodo que se encarga de completar los datos faltantes
        /// </summary>
        /// <param name="rm">Request del mantenimiento</param>
        public override void Ejecutar(RqMantenimiento rm) {
            if (rm.GetTabla("DIRECCION") == null || !rm.GetTabla("DIRECCION").Lregistros.Any()) {
                return;
            }
            long? cpersona = rm.GetLong("c_pk_cpersona");
            List<tperpersonadireccion> ldatos = rm.GetTabla("DIRECCION").Lregistros.Cast<tperpersonadireccion>().ToList();
            foreach (tperpersonadireccion obj in ldatos) {
                //if (obj.Pk == null) {
                //    TperPersonaDireccionDtoKey tperPersonaDireccionKey = new TperPersonaDireccionDtoKey();
                //    obj.Pk = tperPersonaDireccionKey;
                //}
                if (obj.cpersona == 0) {
                    obj.ccompania = rm.Ccompania;
                    obj.cpersona = (long)cpersona;
                }
            }
        }

    }
}
