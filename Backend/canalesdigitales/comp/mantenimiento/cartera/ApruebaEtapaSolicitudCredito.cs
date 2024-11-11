using canalesdigitales.enums;
using canalesdigitales.helper;
using core.componente;
using core.servicios.mantenimiento;
using dal.cartera;
using modelo;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace canalesdigitales.comp.mantenimiento.cartera {

    public class ApruebaEtapaSolicitudCredito : ComponenteMantenimiento {

        private readonly string urlApiCore = ConfigurationManager.AppSettings["UrlApiCore"];

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {

            long csolicitud = Convert.ToInt64(rqmantenimiento.GetLong(nameof(csolicitud)));
            tcarsolicitud solicitud = TcarSolicitudDal.Find(csolicitud);

            if (solicitud == null) {
                ProcesarThreadAprobarEtapa(rqmantenimiento);
            } else {
                string[] cestatussolicitudes = { "ING", "PAP", "APR" };
                if (cestatussolicitudes.Contains(solicitud.cestatussolicitud)) {
                    RqMantenimiento rq = (RqMantenimiento)rqmantenimiento.Clone();
                    rq.Ccanal = "OFI";
                    rq.Cmodulo = EnumGeneral.MODULO_PRESTAMOS;
                    rq.Ctransaccion = 120;
                    rq.AddDatos("aprobar", true);
                    rq.AddDatos("comentario", "APROBADO AUTOMÁTICAMENTE");
                    rq.Mdatos.Add("cflujo", 700);

                    switch (solicitud.cestatussolicitud) {
                        case "ING":
                            solicitud.cestatussolicitud = "PAP";
                            break;
                        case "PAP":
                            solicitud.cestatussolicitud = "APR";
                            break;
                        case "APR":
                            ProcesarThreadDesembolso(rq);
                            break;
                        default:
                            throw new AtlasException("CAN-036", $"SOLICITUD NO AUTORIZADA: {solicitud.cestatussolicitud}");
                    }

                    List<tcarsolicitud> lsolicitudes = new List<tcarsolicitud>();
                    solicitud.Esnuevo = false;
                    solicitud.Actualizar = true;
                    lsolicitudes.Add(solicitud);

                    rq.AdicionarTabla(typeof(tcarsolicitud).Name.ToUpper(), lsolicitudes, false);

                    Mantenimiento.ProcesarAnidado(rq, EnumGeneral.MODULO_PRESTAMOS, 120);
                    ProcesarThreadAprobarEtapa(rq);
                } else {
                    throw new AtlasException("CAN-036", $"SOLICITUD NO AUTORIZADA: {solicitud.cestatussolicitud}");
                }

            }
        }

        private void ProcesarThreadAprobarEtapa(RqMantenimiento rq) {
            int secuencia = Convert.ToInt32(rq.GetInt(nameof(secuencia)));
            if (secuencia > 5) {
                throw new AtlasException("CAN-036", $"SOLICITUD NO AUTORIZADA: {secuencia}");
            }
            rq.Ccanal = EnumCanalDigital.CANAL_DIGITAL;
            rq.Cmodulo = EnumCanalDigital.MODULO_CANAL_DIGITAL;
            Dictionary<string, object> parametrosThread = new Dictionary<string, object>();
            parametrosThread.Add("csolicitud", rq.GetLong("csolicitud"));
            parametrosThread.Add(nameof(secuencia), secuencia + 1);
            parametrosThread.Add("c", string.Join("^", "1^1^1", rq.Cusuario, rq.Crol, "ES", rq.Ccanal, rq.Cterminal, rq.Cmodulo, "23"));

            ServicioThreadHelper servicioThread = new ServicioThreadHelper(string.Join("/", urlApiCore, "atlas-core-can/servicioRest/mantener"), parametrosThread);
            servicioThread.Ejecutar();
        }

        private void ProcesarThreadDesembolso(RqMantenimiento rq) {
            int secuencia = Convert.ToInt32(rq.GetInt(nameof(secuencia)));
            if (secuencia > 5) {
                throw new AtlasException("CAN-036", $"SOLICITUD NO AUTORIZADA: {secuencia}");
            }
            rq.Ccanal = EnumCanalDigital.CANAL_DIGITAL;
            rq.Cmodulo = EnumCanalDigital.MODULO_CANAL_DIGITAL;
            Dictionary<string, object> parametrosThread = new Dictionary<string, object>();
            parametrosThread.Add("csolicitud", rq.GetLong("csolicitud"));
            parametrosThread.Add(nameof(secuencia), secuencia + 1);
            parametrosThread.Add("c", string.Join("^", "1^1^1", rq.Cusuario, rq.Crol, "ES", rq.Ccanal, rq.Cterminal, rq.Cmodulo, "24"));

            ServicioThreadHelper servicioThread = new ServicioThreadHelper(string.Join("/", urlApiCore, "atlas-core-can/servicioRest/mantener"), parametrosThread);
            servicioThread.Ejecutar();
        }
    }
}
