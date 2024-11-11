using core.componente;
using modelo;
using System.Linq;
using util.dto.mantenimiento;

namespace persona.comp.mantenimiento.juridica {

    /// <summary>
    /// Completa detalle de personas juridicas.
    /// </summary>
    /// <author>amerchan</author>
    public  class Detalle : ComponenteMantenimiento {

        /// <summary>
        /// Completa nombre del cliente.
        /// </summary>
        /// <param name="rm">Request del mantenimiento</param>
        public override void Ejecutar(RqMantenimiento rm) {
            if (rm.GetTabla("JURIDICA") != null || rm.GetTabla("DETALLE") != null) {
                long? cpersona = rm.GetLong("c_pk_cpersona");
                tperpersonadetalle tperPersonaDetalle;
                if (rm.GetTabla("DETALLE") != null) {
                    tperPersonaDetalle = (tperpersonadetalle)rm.GetTabla("DETALLE").Lregistros.ElementAt(0);
                    //if (tperPersonaDetalle.Pk == null) {
                    //    TperPersonaDetalleDtoKey tperPersonaDetalleKey = new TperPersonaDetalleDtoKey();
                    //    tperPersonaDetalle.Pk = tperPersonaDetalleKey;
                    //}
                    if (tperPersonaDetalle.cpersona == 0) {
                        tperPersonaDetalle.cpersona = (long)cpersona;
                        tperPersonaDetalle.ccompania = rm.Ccompania;
                        tperPersonaDetalle.tipodepersona = "J";
                    }
                }
            }
        }


    }
}
