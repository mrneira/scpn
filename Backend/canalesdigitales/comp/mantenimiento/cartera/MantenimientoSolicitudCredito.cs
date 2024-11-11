using canalesdigitales.enums;
using canalesdigitales.helper;
using core.componente;
using core.servicios.mantenimiento;
using dal.canalesdigitales;
using dal.generales;
using dal.persona;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Configuration;
using util;
using util.dto.mantenimiento;

namespace canalesdigitales.comp.mantenimiento.cartera {

    public class MantenimientoSolicitudCredito : ComponenteMantenimiento {

        private readonly string urlApiCore = ConfigurationManager.AppSettings["UrlApiCore"];
        private tcanusuario usuario;

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            usuario = TcanUsuarioDal.Find(rqmantenimiento.Cusuariobancalinea, rqmantenimiento.Ccanal);

            RqMantenimiento rq = (RqMantenimiento)rqmantenimiento.Clone();
            rq.Ccanal = "OFI";
            rq.Cmodulo = EnumGeneral.MODULO_PRESTAMOS;
            rq.Ctransaccion = 100;

            ActualizarSolicitudCanales(rq);
            AgregarDescuentos(rq);
            AgregarRequisitos(rq);
            AgregarDesembolso(rq);

            // Ejecuta transaccion para guardar solicitud
            Mantenimiento.ProcesarAnidado(rq, EnumGeneral.MODULO_PRESTAMOS, 100);

            ProcesarThreadAprobarEtapa(rq);
        }

        private void ActualizarSolicitudCanales(RqMantenimiento rq) {
            List<tcansolicitud> lsolicitudesCanales = new List<tcansolicitud>();
            long csolicitudcanales = Convert.ToInt64(rq.GetLong(nameof(csolicitudcanales)));
            tcansolicitud solicitudCanales = TcanSolicitudDal.Find(csolicitudcanales);

            if (solicitudCanales == null) {
                throw new AtlasException("CAN-036", $"SOLICITUD NO AUTORIZADA: {csolicitudcanales}");
            }
            solicitudCanales.ccarsolicitud = Convert.ToInt64(rq.GetLong("csolicitud"));
            solicitudCanales.Actualizar = true;
            solicitudCanales.Esnuevo = false;

            lsolicitudesCanales.Add(solicitudCanales);

            rq.AdicionarTabla("TCANSOLICITUD", lsolicitudesCanales, false);
        }

        /// <summary>
        /// Método que agrega los descuentos de la solicitud de crédito
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        private void AgregarDescuentos(RqMantenimiento rq) {
            List<tcarsolicituddescuentos> ldescuentos = new List<tcarsolicituddescuentos>();
            tperreferenciabancaria referenciaBancaria = TperReferenciaBancariaDal.Find(Convert.ToInt64(usuario.cpersona), EnumGeneral.COMPANIA_COD);

            if (referenciaBancaria == null || !referenciaBancaria.estado.Equals(EnumEstadosReferenciaBancaria.REFERENCIA_ACTIVA)) {
                throw new AtlasException("CAN-034", "REFERENCIA BANCARIA NO EXISTE PARA USUARIO: {0}", rq.Cusuariobancalinea);
            }

            tgencatalogodetalle detalleBanco = TgenCatalogoDetalleDal.Find(Convert.ToInt32(referenciaBancaria.tipoinstitucionccatalogo), referenciaBancaria.tipoinstitucioncdetalle);
            tgencatalogodetalle detalleCuenta = TgenCatalogoDetalleDal.Find(Convert.ToInt32(referenciaBancaria.tipocuentaccatalogo), referenciaBancaria.tipocuentacdetalle);


            //long csolicitud = Convert.ToInt64(rq.Response["csolicitud"];

            ldescuentos.Add(new tcarsolicituddescuentos {
                csolicitud = Convert.ToInt64(rq.GetLong("csolicitud")),
                autorizacion = true,
                Actualizar = false,
                Esnuevo = true,
                Mdatos = new Dictionary<string, object> {
                    ["ncuenta"] = $"{detalleBanco.nombre}-{detalleCuenta.nombre}-{referenciaBancaria.numero}"
                }
            });

            rq.AdicionarTabla("TCARSOLICITUDDESCUENTOS", ldescuentos, false);
        }

        /// <summary>
        /// Método que agrega los requisitos de la solicitud de crédito
        /// </summary>
        /// <param name="rq"></param>
        private void AgregarRequisitos(RqMantenimiento rq) {
            List<IBean> lrequisitos = rq.GetTabla("TCARPRODUCTOREQUISITOS").Lregistros;
            string comentario = "VERIFICACIÓN AUTOMÁTICA";

            foreach (tcarsolicitudrequisitos requisito in lrequisitos) {
                requisito.verificada = true;
                requisito.comentario = comentario;
            }
        }

        /// <summary>
        /// Método que agrega el desembolso de la solicitud de crédito
        /// </summary>
        /// <param name="rq"></param>
        private void AgregarDesembolso(RqMantenimiento rq) {
            List<tcarsolicituddesembolso> ldesembolsos = new List<tcarsolicituddesembolso>();
            tperpersonadetalle personaDetalle = TperPersonaDetalleDal.Find(Convert.ToInt64(usuario.cpersona), EnumGeneral.COMPANIA_COD);
            tperreferenciabancaria referenciaBancaria = TperReferenciaBancariaDal.Find(Convert.ToInt64(usuario.cpersona), EnumGeneral.COMPANIA_COD);
            tgencatalogodetalle detalleBanco = TgenCatalogoDetalleDal.Find(Convert.ToInt32(referenciaBancaria.tipoinstitucionccatalogo), referenciaBancaria.tipoinstitucioncdetalle);
            tgencatalogodetalle detalleCuenta = TgenCatalogoDetalleDal.Find(Convert.ToInt32(referenciaBancaria.tipocuentaccatalogo), referenciaBancaria.tipocuentacdetalle);

            

            ldesembolsos.Add(new tcarsolicituddesembolso {
                csolicitud = Convert.ToInt64(rq.GetLong("csolicitud")),
                secuencia = 1,
                tipo = "T",
                crubro = 1,
                csaldo = "SPI", // TODO: preguntar el tipo de saldo
                fregistro = Fecha.GetFechaSistemaIntger(),
                transferencia = true,
                pagado = false,
                valor = rq.GetDecimal("montooriginal"),
                cuentacliente = true,
                comentario = "",
                tipoidentificacionccatalogo = personaDetalle.tipoidentificaccatalogo,
                tipoidentificacioncdetalle = personaDetalle.tipoidentificacdetalle,
                identificacionbeneficiario = personaDetalle.identificacion,
                nombrebeneficiario = personaDetalle.nombre,
                tipoinstitucionccatalogo = referenciaBancaria.tipoinstitucionccatalogo,
                tipocuentaccatalogo = referenciaBancaria.tipocuentaccatalogo,
                tipoinstitucioncdetalle = referenciaBancaria.tipoinstitucioncdetalle,
                tipocuentacdetalle = referenciaBancaria.tipocuentacdetalle,
                numerocuentabancaria = referenciaBancaria.numero,
                Actualizar = false,
                Esnuevo = true,
                Mdatos = new Dictionary<string, object> {
                    ["ninstitucion"] = detalleBanco.nombre,
                    ["ntipocuenta"] = detalleCuenta.nombre
                }
            });

            rq.AdicionarTabla("TCARSOLICITUDDESEMBOLSO", ldesembolsos, false);
        }

        /// <summary>
        /// Método que procesa el HILO para realizar la aprobación de la etapa del crédito
        /// </summary>
        /// <param name="rq"></param>
        private void ProcesarThreadAprobarEtapa(RqMantenimiento rq) {
            rq.Ccanal = EnumCanalDigital.CANAL_DIGITAL;
            rq.Cmodulo = EnumCanalDigital.MODULO_CANAL_DIGITAL;
            Dictionary<string, object> parametrosThread = new Dictionary<string, object>();
            parametrosThread.Add("csolicitud", rq.GetLong("csolicitud"));
            parametrosThread.Add("secuencia", 1);
            parametrosThread.Add("c", string.Join("^", "1^1^1", usuario.cusuario, rq.Crol, "ES", rq.Ccanal, rq.Cterminal, rq.Cmodulo, "23"));

            ServicioThreadHelper servicioThread = new ServicioThreadHelper(string.Join("/", urlApiCore, "atlas-core-can/servicioRest/mantener"), parametrosThread);
            servicioThread.Ejecutar();
        }
    }
}
