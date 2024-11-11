using cartera.datos;
using cartera.enums;
using core.componente;
using dal.cartera;
using modelo;
using Newtonsoft.Json;
using System.Collections.Generic;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.solicitud {

    /// <summary>
    /// Clase que se encarga de completar datos para convenio.
    /// </summary>
    public class CompletarSolicitudConvenio : ComponenteMantenimiento {

        /// <summary>
        /// Completa informacion para convenio
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            if (rqmantenimiento.Mdatos.ContainsKey("essimulacion") && (bool)rqmantenimiento.Mdatos["essimulacion"]) {
                return;
            }

            //Solicitud
            Solicitud solicitud = SolicitudFachada.GetSolicitud();
            tcarsolicitud tcarsolicitud = solicitud.Tcarsolicitud;
            tcarproducto producto = TcarProductoDal.Find((int)tcarsolicitud.cmodulo, (int)tcarsolicitud.cproducto, (int)tcarsolicitud.ctipoproducto);

            if (producto.convenio != null && (bool)producto.convenio) {
                CompletaConvenio(rqmantenimiento, tcarsolicitud, producto);
            } else {
                throw new AtlasException("CAR-0085", "PRODUCTO DE CRÉDITO NO ES CONVENIO");
            }
        }

        /// <summary>
        /// Completa los datos de convenio.
        /// </summary>
        /// <param name="rq">Request de mantenimiento.</param>
        /// <param name="solicitud">Objeto de contiene los datos de solicitud del credito.</param>
        /// <param name="producto">Objeto de contiene los datos del producto de credito.</param>
        private static void CompletaConvenio(RqMantenimiento rq, tcarsolicitud solicitud, tcarproducto producto)
        {
            tcarconvenio convenio = TcarConvenioDal.Find((int)producto.cconvenio);

            // Desembolso
            tcarsolicituddesembolso desembolso = new tcarsolicituddesembolso {
                csolicitud = solicitud.csolicitud,
                secuencia = Constantes.UNO,
                fregistro = rq.Fconatable,
                tipo = "T",
                valor = solicitud.montooriginal,
                crubro = Constantes.UNO,
                csaldo = "SPI",
                tipoidentificacionccatalogo = convenio.ccatalogoidentificacion,
                tipoidentificacioncdetalle = convenio.cdetalleidentificacion,
                identificacionbeneficiario = convenio.identificacion,
                nombrebeneficiario = convenio.razonsocial,
                tipoinstitucionccatalogo = convenio.ccatalogoinstitucion,
                tipoinstitucioncdetalle = convenio.cdetalleinstitucion,
                tipocuentaccatalogo = convenio.ccatalogocuenta,
                tipocuentacdetalle = convenio.cdetallecuenta,
                numerocuentabancaria = convenio.numerocuenta,
                cuentacliente = false
            };
            rq.AdicionarTabla(typeof(tcarsolicituddesembolso).Name.ToUpper(), desembolso, false);

            // Descuento
            tcarsolicituddescuentos descuento = new tcarsolicituddescuentos {
                csolicitud = solicitud.csolicitud,
                autorizacion = true
            };
            rq.AdicionarTabla(typeof(tcarsolicituddescuentos).Name.ToUpper(), descuento, false);

            // Requisitos
            if (rq.Mdatos.ContainsKey("REQUISITOS")) {
                List<tcarsolicitudrequisitos> lrequisitos = JsonConvert.DeserializeObject<List<tcarsolicitudrequisitos>>(rq.Mdatos["REQUISITOS"].ToString());
                foreach (tcarsolicitudrequisitos req in lrequisitos) {
                    if ((!(bool)req.opcional) && (req.verificada == null || !(bool)req.verificada)) {
                        throw new AtlasException("CAR-0039", "EXISTEN REQUISITOS OBLIGATORIOS NO VERIFICADOS");
                    }
                    req.csolicitud = solicitud.csolicitud;
                    req.cusuarioverifica = rq.Cusuario;
                    req.freal = rq.Freal;
                }
                rq.AdicionarTabla(typeof(tcarsolicitudrequisitos).Name.ToUpper(), lrequisitos, false);
            }

            // Aprobar solicitud
            solicitud.cestatussolicitud = EnumEstatus.PRE_APROBADA.Cestatus;
            rq.Mdatos.Add("aprobar", true);
        }
    }
}
