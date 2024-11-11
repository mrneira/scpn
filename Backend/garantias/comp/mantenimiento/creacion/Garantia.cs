using core.componente;
using dal.generales;
using modelo;
using System.Linq;
using util.dto.mantenimiento;

namespace garantias.comp.mantenimiento.creacion {

    /// <summary>
    /// Clase que se encarga de completar informacion de una garantia.
    /// </summary>
    public class Garantia : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            if (rqmantenimiento.GetTabla("TGAROPERACION") == null || rqmantenimiento.GetTabla("TGAROPERACION").Lregistros == null || rqmantenimiento.GetTabla("TGAROPERACION").Lregistros.Count() <= 0) {
                return;
            }
            tgaroperacion garantia = (tgaroperacion)rqmantenimiento.GetTabla("TGAROPERACION").Lregistros.ElementAt(0);
            if (garantia.cagencia == null) {
                garantia.ccompania = rqmantenimiento.Ccompania;
                garantia.cagencia = rqmantenimiento.Cagencia;
                garantia.csucursal = rqmantenimiento.Csucursal;
            }
            if (garantia.coperacion== null) {
                garantia.cmodulo = 9;
                garantia.cproducto = 1;
                garantia.ctipoproducto = 1;
                garantia.cestatus = "ING";
                garantia.fvigencia = rqmantenimiento.Fconatable;
                garantia.mensaje = rqmantenimiento.Mensaje;
                garantia.cusuarioapertura = rqmantenimiento.Cusuario;

                // Genera numero de garantia.
                string coperacion = TgenOperacionNumeroDal.GetNumeroOperacion(garantia.cmodulo??0, garantia.cproducto??0,
                        garantia.ctipoproducto??0, garantia.csucursal??0, garantia.cagencia??0, garantia.ccompania??0);

                garantia.coperacion = coperacion;
                rqmantenimiento.Coperacion = coperacion;
            }
            rqmantenimiento.AddDatos("coperacion", garantia.coperacion);
        }

    }
}
