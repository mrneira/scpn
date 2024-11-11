using core.componente;
using System;
using System.Linq;
using System.Runtime.Remoting;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.descuentos {

    /// <summary>
    /// Clase que se encarga de ejecutar la aplicacion de descuentos
    /// </summary>
    class AplicarPago : ComponenteMantenimiento {

        /// <summary>
        /// Metodo que ejecuta el pago de las operaciones de descuentos
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            if (!rqmantenimiento.Mdatos.ContainsKey("particion")) {
                throw new AtlasException("CAR-0076", "NO EXISTEN ARCHIVOS PARA PROCESAR");
            }

            // Ejecutor de Lotes
            String componente = "lote.comp.mantenimiento.EjecutorLotes";
            ComponenteMantenimiento m = null;
            rqmantenimiento.Mdatos["CLOTE"] = "DESCUENTOS";

            string assembly = componente.Substring(0, componente.IndexOf("."));
            ObjectHandle handle = Activator.CreateInstance(assembly, componente);
            object comp = handle.Unwrap();
            m = (ComponenteMantenimiento)comp;
            m.Ejecutar(rqmantenimiento);
        }
    }
}
