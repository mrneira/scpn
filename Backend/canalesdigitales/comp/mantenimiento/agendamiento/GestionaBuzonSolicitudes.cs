using canalesdigitales.enums;
using canalesdigitales.helper;
using canalesdigitales.validaciones;
using core.componente;
using dal.canalesdigitales;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto;
using util.dto.mantenimiento;

namespace canalesdigitales.comp.mantenimiento.agendamiento {
    class GestionaBuzonSolicitudes : ComponenteMantenimiento {

        private readonly Validar validar = new Validar();
        private readonly ComponenteHelper componenteHelper = new ComponenteHelper();
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            ValidarAgendamiento(rqmantenimiento);
            ValidarSolicitud(rqmantenimiento);
            GestionarSolicitud(rqmantenimiento);
        }

        private void ValidarAgendamiento(RqMantenimiento rqmantenimiento) {
            long cagendamiento = Convert.ToInt64(rqmantenimiento.GetLong(nameof(cagendamiento)));
            long cpersona = Convert.ToInt64(rqmantenimiento.GetLong(nameof(cpersona)));

            tcanagendamiento agendamiento = TcanAgendamientoDal.Find(cagendamiento);
            if(agendamiento == null) {
                throw new AtlasException("CAN-044", $"AGENDAMIENTO INCORRECTO O NO EXISTE | {agendamiento}");
            }

            if(!agendamiento.cpersona.Equals(cpersona)) {
                throw new AtlasException("CAN-044", $"AGENDAMIENTO INCORRECTO O NO EXISTE | {agendamiento} | {cpersona}");
            }
        }

        private void ValidarSolicitud(RqMantenimiento rqmantenimiento) {
            var aprobado = rqmantenimiento.GetDatos("aprobado");

            if (aprobado != null) {
                string cusuario = rqmantenimiento.GetString(nameof(cusuario));
                long csolicitud = Convert.ToInt64(rqmantenimiento.GetLong(nameof(csolicitud)));
                int cproducto = Convert.ToInt32(rqmantenimiento.GetInt(nameof(cproducto)));
                int ctipoproducto = Convert.ToInt32(rqmantenimiento.GetInt(nameof(ctipoproducto)));

                validar.Solicitud(csolicitud, cproducto, ctipoproducto, cusuario);
            }
        }

        private void GestionarSolicitud(RqMantenimiento rqmantenimiento) {
            long csolicitud = Convert.ToInt64(rqmantenimiento.GetLong(nameof(csolicitud)));
            long cagendamiento = Convert.ToInt64(rqmantenimiento.GetLong(nameof(cagendamiento)));
            var aprobado = rqmantenimiento.GetDatos("aprobado");
            

            List<tcanagendamiento> lagendamientos = new List<tcanagendamiento>();
            tcanagendamiento agendamiento = TcanAgendamientoDal.Find(cagendamiento);
            agendamiento.Actualizar = true;
            agendamiento.Esnuevo = false;
            agendamiento.atendido = true;

            if (aprobado != null) {
                agendamiento.aprobado = (bool)aprobado;
                if (Convert.ToBoolean(aprobado) == true) {
                    long ccarsolicitud = IngresarSolicitudCartera(rqmantenimiento);
                    ActualizarSolicitudCanales(rqmantenimiento, csolicitud, ccarsolicitud);
                }
            }

            lagendamientos.Add(agendamiento);
            rqmantenimiento.AdicionarTabla("TCANAGENDAMIENTO", lagendamientos, false);

        }

        private long IngresarSolicitudCartera(RqMantenimiento rqmantenimiento) {
            string cusuario = rqmantenimiento.GetString(nameof(cusuario));
            long csolicitud = Convert.ToInt64(rqmantenimiento.GetLong(nameof(csolicitud)));
            int cproducto = Convert.ToInt32(rqmantenimiento.GetInt(nameof(cproducto)));
            int ctipoproducto = Convert.ToInt32(rqmantenimiento.GetInt(nameof(ctipoproducto)));

            tcansolicituddetalle solicitudDetalle = TcanSolicitudDetalleDal.Find(csolicitud, cproducto, ctipoproducto);

            //RqMantenimiento rq = new RqMantenimiento();
            //rq = RqMantenimiento.Copiar(rqmantenimiento);
            RqMantenimiento rq = (RqMantenimiento)rqmantenimiento.Clone();

            rq.Cusuariobancalinea = cusuario;
            rq.Ccanal = EnumCanalDigital.CANAL_DIGITAL;
            rq.AddDatos("csolicitud", csolicitud);
            rq.AddDatos("cproducto", cproducto);
            rq.AddDatos("ctipoproducto", ctipoproducto);
            rq.AddDatos("ctabla", 1);
            rq.AddDatos("montooriginal", solicitudDetalle.montosolicitado);
            rq.AddDatos("numerocuotas", solicitudDetalle.plazosolicitado);
            rq.AddDatos("tasa", solicitudDetalle.tasasolicitada);
            rq.AddDatos("capacidadpago", solicitudDetalle.capacidadpago);
            rq.AddDatos("valorcuota", solicitudDetalle.cuotasolicitada);
            rq.Response = new Response();

            componenteHelper.ProcesarComponenteMantenimiento(rq, EnumComponentes.INGRESO_SOLICITUD_CREDITO);

            return Convert.ToInt64(rq.GetLong("csolicitud"));
        }

        private void ActualizarSolicitudCanales(RqMantenimiento rqmantenimiento, long csolicitud, long ccarsolicitud) {
            List<tcansolicitud> lsolicitudesCanales = new List<tcansolicitud>();

            tcansolicitud solicitud = TcanSolicitudDal.Find(csolicitud);

            if (solicitud == null) {
                throw new AtlasException("CAN-036", $"SOLICITUD NO AUTORIZADA: {csolicitud}");
            }

            solicitud.ccarsolicitud = ccarsolicitud;
            solicitud.Actualizar = true;
            solicitud.Esnuevo = false;

            lsolicitudesCanales.Add(solicitud);

            rqmantenimiento.AdicionarTabla("TCANSOLICITUD", lsolicitudesCanales, false);
        }
    }
}
