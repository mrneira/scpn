using cartera.datos;
using core.componente;
using dal.cartera;
using modelo;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.arreglopago {

    /// <summary>
    /// Clase que se encarga de completar información de la capacidad de pago para operaciones de arreglo de pago
    /// </summary>
    public class CapacidadPagoArregloPago : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            if (rqmantenimiento.Mdatos.ContainsKey("essimulacion") && (bool)rqmantenimiento.Mdatos["essimulacion"]) {

                tcaroperacion ope = OperacionFachada.GetOperacion(rqmantenimiento).Tcaroperacion;
                tcarproducto pro = TcarProductoDal.Find((int)ope.cmodulo, (int)ope.cproducto, (int)ope.ctipoproducto);

                TcarSolicitudCapacidadPagoDal.PorcentajeCapacidadPago(rqmantenimiento);
                rqmantenimiento.Response["absorberoperaciones"] = pro.absorberoperaciones ?? false;
                rqmantenimiento.Response["INGRESOS"] = TcarSolicitudCapacidadPagoDal.ListaIngresos("I", (int)ope.ccompania, (int)ope.cpersona, pro);
                rqmantenimiento.Response["EGRESOS"] = TcarSolicitudCapacidadPagoDal.ListaEgresos("E", rqmantenimiento.Fconatable, (long)ope.cpersona, rqmantenimiento.GetString("coperacion"));
            }

        }

    }
}
