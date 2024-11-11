using cartera.datos;
using core.componente;
using dal.cartera;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.solicitud.validar {
    /// <summary>
    /// Clase que se encarga de ejecutar validaciones de numero de solicitudes por socio.
    /// </summary>
    public class SolicitudesCliente : ComponenteMantenimiento {
        /// <summary>
        /// Validación de número de solicitudes
        /// </summary>
        /// <param name="RqMantenimiento">Request de Mantenimiento</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            Solicitud solicitud = SolicitudFachada.GetSolicitud();
            tcarsolicitud tcarsolicitud = solicitud.Tcarsolicitud;
            if (rqmantenimiento.GetTabla("TCAROPEARREGLOPAGO") != null && rqmantenimiento.GetTabla("TCAROPEARREGLOPAGO").Lregistros.Count == 1)
            {
                tcaroperacionarreglopago oparre = (tcaroperacionarreglopago)rqmantenimiento.GetTabla("TCAROPEARREGLOPAGO").Lregistros[0];
                tcaroperacion op = TcarOperacionDal.FindWithLock(oparre.coperacion);
                //VALIDO SI LA OPERACION A LA QUE SE LE QUIERE REALIZAR UNA NEGOCIACIÓN DE PAGO NO ES EL RESULTADO DE UNA OPERACIÓN QUE YA FUE NEGOCIADA ANTERIORMENTE
                //A EXCEPCIÓN DE LAS NEGOCIACIONES DE PAGOS DE OPERACIONES REFINANCIADAS
                if (!op.cestadooperacion.Equals("N") && !op.cestadooperacion.Equals("F"))
                {
                    //SEPONE UNA EXCEPCIÓN PARA LAS OPERACIOJNES QUE FUERON RENOVADAS Y POR ERROR SE CREARON CON ESTADO V, SIENDO LO CORECTO QUE SE ENCUENTREN CON ESTADO N
                    if (op.fapertura >= 20241107)
                    {
                        throw new Exception("CAR-0041 NO ES POSIBLE REALIZAR UNA NEGOCIACIÓN DE PAGO A UNA OPERACIÓN QUE YA FUE NEGOCIADA PREVIAMENTE");
                    }
                }
                tcaroperacionarreglopago validaoperacon = TcarOperacionArregloPagoDal.Find(op.coperacion, "PAG");
                if (validaoperacon != null)
                {
                    tcartipoarreglopago tip = TcarTipoArregloPagoDal.Find(validaoperacon.ctipoarreglopago);
                    if (tip.cestadooperacion.Equals("E"))
                    {
                        throw new Exception("CAR-0041 NO ES POSIBLE REALIZAR UNA NEGOCIACIÓN DE PAGO, A UNA OPERACIÓN QUE YA TIENE UNA NEGOCIACIÓN DE PAGO RESTRUCTURADA");
                    }
                }
            }
            if (TcarOperacionDal.FindOperacionesRestructuradasVigentesByPersona((long)tcarsolicitud.cpersona).Count > 0)
            {
                throw new Exception("CAR-0041 EL SOCIO, POSEE UNA OPERACIÓN RESTRUCTURADA VIGENTE O VENCIDA O APROBADA");
            }
            List<tcarsolicitud> lsolicitud = TcarSolicitudDal.FindPorPersona((long)tcarsolicitud.cpersona, true).ToList();
            if (lsolicitud.Count > 0) {
                throw new AtlasException("CAR-0041", "SOCIO TIENE LA SOLICITUD {0} EN ESTADO {1}", lsolicitud[0].csolicitud, TcarEstatusSolicitudDal.Find(lsolicitud[0].cestatussolicitud).nombre);
            }
        }
    }
}