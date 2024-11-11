using cartera.datos;
using cartera.enums;
using core.componente;
using dal.cartera;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;

/// <summary>
/// Clase que se encarga de anular operaciones de credito aprobadas.
/// </summary>
namespace cartera.comp.mantenimiento.anular {
    public class AnularAprobados : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            tcaroperacion oper = OperacionFachada.GetOperacion(rqmantenimiento).tcaroperacion;
            // manejo de historia de la operacion, el estatus se maneja en el registro vigente.
            TcarOperacionHistoriaDal.CreaHistoria(oper, rqmantenimiento.Mensaje, rqmantenimiento.Fconatable);
            oper.cestatus = EnumEstatus.NEGADA.Cestatus;
            oper.Actualizar = true;

            tcarsolicitud sol = TcarSolicitudDal.Find(oper.csolicitud.Value);
            sol.cestatussolicitud = "ANU";
            sol.Actualizar = true;

            rqmantenimiento.AdicionarTabla("tcaroperacion", oper, false);
            rqmantenimiento.AdicionarTabla("tcarsolicitud", sol, false);

            //RRO anulacion 20210414 todo if
            // Si es RENOVACION cambia el status en la tabla tcaroperacionarreglopago
            if (TcarOperacionArregloPagoDal.ExisteOperacion(oper.csolicitud.Value))//RRO anulacion 20210421
            {
                //RRO 20210315 Cambia el status en la tabla tcaroperacionarreglopago
                tcaroperacionarreglopago oap = TcarOperacionArregloPagoDal.FindBySolicitud(oper.csolicitud.Value);
                oap.cestatus = "ANU";
                oap.Actualizar = true;
                rqmantenimiento.AdicionarTabla("tcaroperacionarreglopago", oap, false);//RRO 20210315 Envia actualizacion a la tabla
            }
        }        
    }
}
