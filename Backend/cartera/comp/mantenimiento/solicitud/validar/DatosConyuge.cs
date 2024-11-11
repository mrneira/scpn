using cartera.datos;
using cartera.enums;
using core.componente;
using dal.cartera;
using dal.persona;
using modelo;
using modelo.interfaces;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.solicitud.validar {
    /// <summary>
    /// Clase que se encarga de ejecutar validaciones sobre el conyuge.
    /// </summary>
    public class DatosConyuge : ComponenteMantenimiento {
        /// <summary>
        /// Objeto de contiene los datos de la referencia personal.
        /// </summary>
        private tperreferenciapersonales conyuge;

        /// <summary>
        /// Validación de operaciones del cónyuge
        /// </summary>
        /// <param name="RqMantenimiento">Request de Mantenimiento</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            Solicitud solicitud = SolicitudFachada.GetSolicitud();

            // Operaciones de arreglo de pagos
            if (!solicitud.Tcarsolicitud.cestadooperacion.Equals(EnumEstadoOperacion.ORIGINAL.CestadoOperacion)) {
                return;
            }

            tcarsolicitud tcarsolicitud = solicitud.Tcarsolicitud;
            ValidarConyuge(rqmantenimiento, tcarsolicitud);

            if (conyuge != null) {
                tcarproducto producto = TcarProductoDal.Find((int)tcarsolicitud.cmodulo, (int)tcarsolicitud.cproducto, (int)tcarsolicitud.ctipoproducto);
                if ((producto.productoconyuge != null) && ((bool)producto.productoconyuge)) {
                    OperacionesConyuge(tcarsolicitud, (int)tcarsolicitud.ccompania);
                }
            }
        }

        /// <summary>
        /// Valida datos de conyuge
        /// </summary>
        /// <param name="tcarsolicitud">Registro de solicitud.</param>
        /// <param name="ccompania">Codigo de compania asociada a la solicitud.</param>
        private void ValidarConyuge(RqMantenimiento rqmantenimiento, tcarsolicitud tcarsolicitud)
        {
            if (rqmantenimiento.GetTabla("TCARSOLICITUDPERSONA") == null || rqmantenimiento.GetTabla("TCARSOLICITUDPERSONA").Lregistros.Count() < 0) {
                return;
            }

            List<IBean> lpersona = rqmantenimiento.GetTabla("TCARSOLICITUDPERSONA").Lregistros;
            List<IBean> leliminados = rqmantenimiento.GetTabla("TCARSOLICITUDPERSONA").Lregeliminar;
            IList<tcarsolicitudpersona> lbasedatos = TcarSolicitudPersonaDal.Find(tcarsolicitud.csolicitud, (int)rqmantenimiento.Ccompania);
            List<IBean> lfinal = DtoUtil.GetMergedList(lbasedatos.Cast<IBean>().ToList(), lpersona.Cast<IBean>().ToList(), leliminados);

            foreach (tcarsolicitudpersona p in lfinal) {
                if (p.crelacion == EnumPersonas.CODEUDOR.Ctipo) {
                    conyuge = TperReferenciaPersonalesDal.FindByCpersona((long)tcarsolicitud.cpersona, (int)tcarsolicitud.ccompania);
                    if (conyuge == null || conyuge.cpersonaconyugue == null) {
                        throw new AtlasException("CAR-0069", "CÓNYUGE NO REGISTRADO EN VINCULACIÓN DEL SOCIO");
                    }
                    if (p.cpersona != conyuge.cpersonaconyugue) {
                        throw new AtlasException("CAR-0070", "CÓNYUGE NO CORRESPONDE AL VINCULADO DEL SOCIO");
                    }
                    break;
                }
            }
        }

        /// <summary>
        /// Valida operaciones de cónyuge.
        /// </summary>
        /// <param name="tcarsolicitud">Registro de solicitud.</param>
        /// <param name="ccompania">Codigo de compania asociada a la solicitud.</param>
        public void OperacionesConyuge(tcarsolicitud tcarsolicitud, int ccompania)
        {
            List<tcaroperacion> loperacion = TcarOperacionDal.FindPorPersona((long)conyuge.cpersonaconyugue).ToList();
            foreach (tcaroperacion op in loperacion) {
                tcarestatus estatus = TcarEstatusDal.FindInDataBase(op.cestatus);
                if (!estatus.cestatus.Equals(EnumEstatus.CANCELADA.Cestatus)) {
                    // Operacion mismo producto
                    if ((op.cproducto == tcarsolicitud.cproducto) && (op.ctipoproducto == tcarsolicitud.ctipoproducto)) {
                        throw new AtlasException("CAR-0050", "CÓNYUGE TIENE UNA OPERACIÓN ACTIVA DEL MISMO PRODUCTO");
                    }
                }
            }
        }
    }
}
