using cartera.datos;
using cartera.enums;
using core.componente;
using dal.cartera;
using dal.seguridades;
using modelo;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.solicitud {

    /// <summary>
    /// Clase que se encarga de completar datos del producto en la solicitud.
    /// </summary>
    public class CompletarSolicitud : ComponenteMantenimiento {

        /// <summary>
        /// Completa informacion de la solicitud.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            Solicitud solicitud = SolicitudFachada.GetSolicitud();
            // completa datos del producto.
            solicitud.CompletaDatosdelProducto();
            // completa datos de radicacion.
            tcarsolicitud sol = solicitud.Tcarsolicitud;
            if (sol.monto == null || sol.monto != sol.montooriginal) {
                sol.monto = sol.montooriginal;
            }
            //if (sol.cagencia == null) {
            tsegusuariodetalle usuario = TsegUsuarioDetalleDal.Find(rqmantenimiento.Cusuario, rqmantenimiento.Ccompania);
            sol.ccompania = rqmantenimiento.Ccompania;
            sol.cagencia = usuario.cagencia;
            sol.csucursal = usuario.csucursal;
            sol.cusuarioingreso = rqmantenimiento.Cusuario;
            if (rqmantenimiento.Mdatos.ContainsKey("essimulacion") && (bool)rqmantenimiento.Mdatos["essimulacion"]) {
                sol.cestatussolicitud = "SIM";
            } else {
                sol.cestatussolicitud = "ING";
            }
            sol.fingreso = rqmantenimiento.Ftrabajo;
            sol.fgeneraciontabla = rqmantenimiento.Ftrabajo;
            sol.diapago = TcarParametrosDal.GetInteger("DIA-FIJO-PAGO", rqmantenimiento.Ccompania);
            sol.cestadooperacion = solicitud.Tcarsolicitud.cestadooperacion ?? EnumEstadoOperacion.ORIGINAL.CestadoOperacion;
            //}
        }
    }
}
