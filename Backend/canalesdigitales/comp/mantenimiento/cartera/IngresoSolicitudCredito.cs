using canalesdigitales.enums;
using core.componente;
using core.servicios.mantenimiento;
using dal.canalesdigitales;
using modelo;
using System;
using System.Collections.Generic;
using util;
using util.dto.mantenimiento;

namespace canalesdigitales.comp.mantenimiento.cartera {
    public class IngresoSolicitudCredito : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {

            long csolicitud = Convert.ToInt64(rqmantenimiento.GetLong(nameof(csolicitud)));
            int cproducto = Convert.ToInt32(rqmantenimiento.GetInt(nameof(cproducto)));
            int ctipoproducto = Convert.ToInt32(rqmantenimiento.GetInt(nameof(ctipoproducto)));

            tcanusuario usuario = TcanUsuarioDal.Find(rqmantenimiento.Cusuariobancalinea, rqmantenimiento.Ccanal);
            tcansolicituddetalle solicitudDetalle = TcanSolicitudDetalleDal.Find(csolicitud, cproducto, ctipoproducto);

            //Armar data de tcarsolicitud
            RqMantenimiento rq = (RqMantenimiento)rqmantenimiento.Clone();

            rq.Ccanal = "OFI";
            rq.Cmodulo = EnumGeneral.MODULO_PRESTAMOS;
            rq.Ctransaccion = 98;
            rq.Cagencia = 2;
            rq.AddDatos("montoabsorcionaportes", 0);
            rq.AddDatos("essimulacion", false);

            AgregarSolicitud(rq, usuario.cpersona.Value);
            AgregarDeudor(rq, solicitudDetalle, usuario.cpersona.Value);
            AgregarIngresosDeudor(rq, solicitudDetalle);
            AgregarEgresosDeudor(rq, solicitudDetalle);

            // Ejecuta transaccion de registro de solicitud
            rq.AddDatos("csolicitudcanales", csolicitud);
            Mantenimiento.ProcesarAnidado(rq, EnumGeneral.MODULO_PRESTAMOS, 98);
        }

        /// <summary>
        /// Se agrega el bean de la Solicitud
        /// </summary>
        /// <param name="rq"></param>
        private void AgregarSolicitud(RqMantenimiento rq, long cpersona) {

            List<tcarsolicitud> lsolicitudes = new List<tcarsolicitud>();

            lsolicitudes.Add(new tcarsolicitud {
                cbasecalculo = "360/360",
                cestadooperacion = "N",
                cfrecuecia = 4,
                csolicitud = 0,
                cagencia = rq.Cagencia,
                cproducto = rq.GetInt("cproducto"),
                ctipoproducto = rq.GetInt("ctipoproducto"),
                ctabla = rq.GetInt("ctabla"),
                cpersona = cpersona,
                cmodulo = EnumGeneral.MODULO_PRESTAMOS,
                cmoneda = EnumGeneral.USD,
                monto = rq.GetDecimal("montooriginal"),
                montooriginal = rq.GetDecimal("montooriginal"),
                numerocuotas = rq.GetInt("numerocuotas"),
                tasa = Convert.ToDecimal(rq.GetDecimal("tasa")),
                Actualizar = false,
                Esnuevo = true,
                periodicidadcapital = 1,
                Mdatos = new Dictionary<string, object> {
                    ["destino"] = EnumGeneral.TEXTO_DESTINO_PRESTAMO,
                    ["requieregarante"] = false,
                }

            });

            rq.AdicionarTabla("TCARSOLICITUD", lsolicitudes, false);

        }

        /// <summary>
        /// Se agrega el bean del Deudor
        /// </summary>
        /// <param name="rq"></param>
        /// <param name="solicitudDetalle"></param>
        private void AgregarDeudor(RqMantenimiento rq, tcansolicituddetalle solicitudDetalle, long cpersona) {

            List<tcarsolicitudcapacidadpago> ldeudores = new List<tcarsolicitudcapacidadpago>();

            ldeudores.Add(new tcarsolicitudcapacidadpago {
                cpersona = cpersona,
                capacidadpago = rq.GetDecimal("capacidadpago"),
                comentario = EnumGeneral.COMENTARIO_DEUDOR,
                crelacion = 1,
                destino = EnumGeneral.TEXTO_DESTINO_PRESTAMO,
                monto = rq.GetDecimal("montooriginal"),
                porcentajecoberturacuota = 0, //REVISAR
                resolucion = "APROBADO",
                totalingresos = solicitudDetalle.sueldo + EnumGeneral.RANCHO + (solicitudDetalle.otrosingresos ?? 0),
                totalegresos = solicitudDetalle.isspol + solicitudDetalle.cesantia + (solicitudDetalle.retenciones ?? 0) + (solicitudDetalle.impuestorenta ?? 0),
                valorcuota = rq.GetDecimal("valorcuota"),
                Actualizar = false,
                Esnuevo = true
            });

            rq.AdicionarTabla("DEUDOR", ldeudores, false);
        }

        /// <summary>
        /// Se agregan los bean de ingresos
        /// </summary>
        /// <param name="rq"></param>
        /// <param name="solicitudDetalle"></param>
        private void AgregarIngresosDeudor(RqMantenimiento rq, tcansolicituddetalle solicitudDetalle) {

            List<tcarsolicitudcapacidadpagoie> lingresos = new List<tcarsolicitudcapacidadpagoie>();

            lingresos.Add(new tcarsolicitudcapacidadpagoie {
                nombre = EnumGeneral.NOMBRE_INGRESOS_DEUDOR_RMU,
                secuencia = 1,
                tipo = EnumGeneral.DEUDOR_TIPO_INGRESO,
                valor = solicitudDetalle.sueldo,
                Actualizar = false,
                Esnuevo = true
            });

            lingresos.Add(new tcarsolicitudcapacidadpagoie {
                nombre = EnumGeneral.NOMBRE_INGRESOS_DEUDOR_RANCHO,
                secuencia = 2,
                tipo = EnumGeneral.DEUDOR_TIPO_INGRESO,
                valor = EnumGeneral.RANCHO,
                Actualizar = false,
                Esnuevo = true
            });

            lingresos.Add(new tcarsolicitudcapacidadpagoie {
                nombre = EnumGeneral.NOMBRE_INGRESOS_DEUDOR_OTROS,
                secuencia = 3,
                tipo = EnumGeneral.DEUDOR_TIPO_INGRESO,
                valor = solicitudDetalle.otrosingresos ?? 0,
                Actualizar = false,
                Esnuevo = true
            });

            rq.AdicionarTablaExistente("INGRESOSDEUDOR", lingresos, false);

        }

        /// <summary>
        /// Se agregan los bean de egresos
        /// </summary>
        /// <param name="rq"></param>
        /// <param name="solicitudDetalle"></param>
        private void AgregarEgresosDeudor(RqMantenimiento rq, tcansolicituddetalle solicitudDetalle) {

            List<tcarsolicitudcapacidadpagoie> legresos = new List<tcarsolicitudcapacidadpagoie>();

            legresos.Add(new tcarsolicitudcapacidadpagoie {
                nombre = EnumGeneral.NOMBRE_EGRESOS_DEUDOR_BURO,
                secuencia = 1,
                tipo = EnumGeneral.DEUDOR_TIPO_EGRESO,
                valor = 0,
                Actualizar = false,
                Esnuevo = true
            });

            legresos.Add(new tcarsolicitudcapacidadpagoie {
                nombre = EnumGeneral.NOMBRE_EGRESOS_DEUDOR_ISSPOL,
                secuencia = 2,
                tipo = EnumGeneral.DEUDOR_TIPO_EGRESO,
                valor = solicitudDetalle.isspol ?? 0,
                Actualizar = false,
                Esnuevo = true

            });

            legresos.Add(new tcarsolicitudcapacidadpagoie {
                nombre = EnumGeneral.NOMBRE_EGRESOS_DEUDOR_RETENCIONES,
                secuencia = 3,
                tipo = EnumGeneral.DEUDOR_TIPO_EGRESO,
                valor = solicitudDetalle.retenciones ?? 0,
                Actualizar = false,
                Esnuevo = true
            });

            legresos.Add(new tcarsolicitudcapacidadpagoie {
                nombre = EnumGeneral.NOMBRE_EGRESOS_DEUDOR_IMPUESTO_RENTA,
                secuencia = 4,
                tipo = EnumGeneral.DEUDOR_TIPO_EGRESO,
                valor = solicitudDetalle.impuestorenta ?? 0,
                Actualizar = false,
                Esnuevo = true
            });

            rq.AdicionarTabla("EGRESOSDEUDOR", legresos, false);
        }
    }
}
