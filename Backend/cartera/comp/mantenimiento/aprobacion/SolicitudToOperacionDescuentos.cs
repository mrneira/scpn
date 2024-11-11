using core.componente;
using dal.cartera;
using modelo;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.aprobacion {
    public class SolicitudToOperacionDescuentos : ComponenteMantenimiento {
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            long csolicitud = long.Parse(rqmantenimiento.Mdatos["csolicitud"].ToString());
            tcarsolicituddescuentos sol = TcarSolicitudDescuentosDal.Find(csolicitud);
            if (sol == null) {
                return;
            }

            // Asigna datos a opeacion descuentos
            tcaroperaciondescuentos ope = new tcaroperaciondescuentos();
            ope.coperacion = rqmantenimiento.Coperacion;
            ope.verreg = 0;
            ope.optlock = 0;
            ope.cusuario = rqmantenimiento.Cusuario;
            ope.fregistro = rqmantenimiento.Freal;
            ope.autorizacion = sol.autorizacion ?? false;
            ope.descuentoconyuge = sol.descuentoconyuge;
            ope.porcentajeconyuge = sol.porcentajeconyuge;
            rqmantenimiento.AdicionarTabla(typeof(tcaroperaciondescuentos).Name.ToUpper(), ope, false);
        }
    }
}
