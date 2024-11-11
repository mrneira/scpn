using canalesdigitales.enums;
using canalesdigitales.helper;
using canalesdigitales.models;
using canalesdigitales.validaciones;
using core.componente;
using dal.canalesdigitales;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto;
using util.dto.mantenimiento;

namespace canalesdigitales.comp.mantenimiento.cartera {
    public class ValidaSimulacion : ComponenteMantenimiento {

        private readonly Validar validar = new Validar();
        private readonly ComponenteHelper componenteHelper = new ComponenteHelper();

        /// <summary>
        /// Método principal que ejecuta la validación de la simulación de un crédito
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            ValidarSolicitud(rqmantenimiento);
            ValidarSimulacion(rqmantenimiento);
        }

        private void ValidarSolicitud(RqMantenimiento rqmantenimiento) {
            long csolicitud = Convert.ToInt64(rqmantenimiento.GetLong(nameof(csolicitud)));
            int cproducto = Convert.ToInt32(rqmantenimiento.GetInt(nameof(cproducto)));
            int ctipoproducto = Convert.ToInt32(rqmantenimiento.GetInt(nameof(ctipoproducto)));

            validar.Solicitud(csolicitud, cproducto, ctipoproducto, rqmantenimiento.Cusuariobancalinea);
        }

        /// <summary>
        /// Método que realiza la simulación validando los datos que ingresado con los datos permitidos (cuota vs capacidad de pago)
        /// </summary>
        /// <param name="rq"></param>
        private void ValidarSimulacion(RqMantenimiento rq) {

            long? csolicitud = rq.GetLong(nameof(csolicitud));
            int? cproducto = rq.GetInt(nameof(cproducto));
            int? ctipoproducto = rq.GetInt(nameof(ctipoproducto));
            int? ctabla = rq.GetInt(nameof(ctabla));
            decimal? montooriginal = rq.GetDecimal(nameof(montooriginal));
            int? numerocuotas = rq.GetInt(nameof(numerocuotas));

            tcansolicituddetalle solicitudDetalle = TcanSolicitudDetalleDal.Find(csolicitud.Value, cproducto.Value, ctipoproducto.Value);

            if (solicitudDetalle.montosugerido < montooriginal) {
                throw new AtlasException("CAN-030", $"EL MONTO NO PUEDE SER MAYOR AL SUGERIDO: {solicitudDetalle.montosugerido} | {montooriginal}");
            }

            if (solicitudDetalle.plazo < numerocuotas) {
                throw new AtlasException("CAN-031", $"EL PLAZO NO PUEDE SER MAYOR AL SUGERIDO: {solicitudDetalle.plazo} | {numerocuotas}");
            }


            RqMantenimiento rqMantenimiento = new RqMantenimiento();
            rqMantenimiento = RqMantenimiento.Copiar(rq);
            Response res = new Response();
            rqMantenimiento.Response = res;

            rqMantenimiento.AddDatos("cproducto", cproducto);
            rqMantenimiento.AddDatos("ctipoproducto", ctipoproducto);
            rqMantenimiento.AddDatos("ctabla", ctabla);
            rqMantenimiento.AddDatos("montooriginal", montooriginal);
            rqMantenimiento.AddDatos("numerocuotas", numerocuotas);
            rqMantenimiento.AddDatos("rollback", true);

            componenteHelper.ProcesarComponenteMantenimiento(rqMantenimiento, EnumComponentes.SIMULACION);

            CreditoSimuladoModel creditoSimulado = new CreditoSimuladoModel();

            if (rqMantenimiento.Response.ContainsKey("TABLA") && rqMantenimiento.Response.ContainsKey("tasa") && rqMantenimiento.Response.ContainsKey("plazo")) {

                var primerResultadoTabla = ((List<Dictionary<string, object>>)rqMantenimiento.Response["TABLA"]).FirstOrDefault();


                decimal tasa = Convert.ToDecimal(rqMantenimiento.Response["tasa"]);
                decimal cuota = Convert.ToDecimal(primerResultadoTabla["valcuo"]);
                int plazo = ((List<Dictionary<string, object>>)rqMantenimiento.Response["TABLA"]).Count();

                if (solicitudDetalle.plazo < plazo) {
                    throw new AtlasException("CAN-031", $"EL PLAZO NO PUEDE SER MAYOR AL SUGERIDO: {solicitudDetalle.plazo} | {plazo}");
                }

                if (solicitudDetalle.capacidadpago < cuota) {
                    throw new AtlasException("CAN-032", "LA CUOTA {0} ES MAYOR A LA CAPACIDAD DE PAGO:" + $" {solicitudDetalle.capacidadpago} | {cuota}", cuota);
                }

                creditoSimulado = new CreditoSimuladoModel {
                    NuevoMonto = montooriginal.Value,
                    NuevoPlazo = plazo,
                    NuevaCuota = cuota,
                    Encaje = 0,
                    FSimulacion = Fecha.GetFechaSistema(),
                    SeguroDesgravamen = 0,
                    TasaEfectivaAnual = tasa,
                    TasaInteres = tasa,
                    TotalAPagar = ((List<Dictionary<string, object>>)rqMantenimiento.Response["TABLA"]).Sum(x => Convert.ToDecimal(x["valcuo"]))
                };

                rq.Response.Add(nameof(creditoSimulado), creditoSimulado);

            } else {
                throw new AtlasException("CAN-035", "OCURRIÓ UN PROBLEMA EN LA SIMULACIÓN DE CRÉDITOS");
            }

        }
    }
}
