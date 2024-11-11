using cartera.datos;
using core.componente;
using dal.cartera;
using dal.generales;
using dal.monetario;
using modelo;
using modelo.helper;
using monetario.util;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace cartera.comp.mantenimiento.pago.condonacion {
    /// <summary>
    ///     Clase que se encarga de ejecutar la condonacion de valores de operaciones.
    ///     Se coloca el valor como descuento del rubro y no se registra para el cobro.
    /// </summary>
    public class Condonacion : ComponenteMantenimiento {

        /// <summary>
        /// Valor total de condonacion por rubro.
        /// </summary>
        decimal totalcondonacion = 0;
        /// <summary>
        /// Datos de operacion.
        /// </summary>
        Operacion operacion;
        /// <summary>
        ///Dictionary que almacena valores acumulados por codigo de saldo, se utiliza para guardar informacion en la tabla tcaroperaciontransaccionrubro.
        /// </summary>
        protected Dictionary<String, decimal> mcobro = new Dictionary<String, decimal>();

        /// <summary>
        /// Ejecuta el condonacion de valores de una operacion de cartera.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            int codigoRubro = Constantes.CERO;
            operacion = OperacionFachada.GetOperacion(rqmantenimiento);
            String contabilizar = TcarParametrosDal.Find("CONTABILIZA-CONDONACION", rqmantenimiento.Ccompania).texto;

            if (rqmantenimiento.GetDatos("RUBROS") != null) {
                RqMantenimiento rqconta = (RqMantenimiento)rqmantenimiento.Clone();
                rqconta.EncerarRubros();

                List<tcaroperacioncuota> lcuotas = operacion.GetLcuotas();
                // Rubros a condonar
                var lrubros = JsonConvert.DeserializeObject<List<TRubros>>(rqmantenimiento.Mdatos["RUBROS"].ToString());
                foreach (TRubros trubro in lrubros) {
                    if (!trubro.Mdatos.ContainsKey("condonar")) {
                        continue;
                    }

                    if ((bool)trubro.GetDatos("condonar")) {
                        totalcondonacion = Constantes.CERO;
                        this.Condonar(rqmantenimiento, trubro, lcuotas);

                        if (totalcondonacion.CompareTo(trubro.Monto) != 0) {
                            throw new AtlasException("CAR-0077", "EL SALDO DEL RUBRO DIFIERE DEL VALOR A CONDONAR");
                        }

                        // Rubros a contabilizar
                        if (Constantes.EsUno(contabilizar)) {
                            IList<tmonrubro> lmonrubros = TmonRubroDal.FindInDataBase((int)rqconta.Cmodulo, (int)rqconta.Ctransaccion);
                            foreach (tmonrubro mon in lmonrubros) {
                                if (mon.csaldo.Equals(trubro.Csaldo)) {
                                    codigoRubro = mon.crubro;
                                    break;
                                }
                            }

                            RqRubro rqrubro = new RqRubro(codigoRubro, totalcondonacion, operacion.tcaroperacion.cmoneda);
                            rqrubro.Coperacion = operacion.Coperacion;
                            rqrubro.Multiple = true;
                            rqconta.AdicionarRubro(rqrubro);
                        }
                    }
                }

                // Ejecuta el monetario
                if (rqconta.Rubros != null && !(rqconta.Rubros.Count < 1)) {
                    new ComprobanteMonetario(rqconta);
                }

                // Registra de valores condonados en tcaroperaciontransaccionrubro.
                TcarOperacionTransaccionRubroDal.Crear(rqmantenimiento, operacion.Coperacion, mcobro, rqmantenimiento.Fconatable, (int)rqmantenimiento.Ftrabajo);
            }
        }

        /// <summary>
        /// Actualiza el valor de descuento del rubro
        /// </summary>
        private void Condonar(RqMantenimiento rqmantenimiento, TRubros trubro, List<tcaroperacioncuota> lcuotas)
        {
            int numcuota = 0;
            foreach (tcaroperacioncuota cuota in lcuotas) {
                if ((numcuota.CompareTo(cuota.numcuota) == 0) || (cuota.fpago != null)) {
                    continue;
                }
                numcuota = cuota.numcuota;

                // Actualiza el valor de descuento por rubro
                CondonarRubroPorCuota(cuota, rqmantenimiento, trubro);
            }
        }

        /// <summary>
        /// Si la cuota tiene asociada saldo en el rubro, el valor de descuento se incrementa
        /// </summary>
        private void CondonarRubroPorCuota(tcaroperacioncuota cuota, RqMantenimiento rqmantenimiento, TRubros trubro)
        {
            // Consulta el rubro de la cuota a actualizar
            tcaroperacionrubro rubro = TcarOperacionRubroDal.FindPorCodigoSaldo(cuota.GetRubros(), trubro.Csaldo);
            if (rubro != null) {
                // Generar registro de historia
                TcarOperacionRubroHistoriaDal.RegistraHistoria(cuota, rubro, rqmantenimiento.Fconatable, rqmantenimiento.Mensaje,
                                                               rqmantenimiento.Enlinea, TgenMonedaDal.GetDecimales(operacion.tcaroperacion.cmoneda));


                // actualiza el valor del descuento del rubro.
                decimal saldoRubro = Decimal.Subtract(Decimal.Subtract((decimal)rubro.saldo, (decimal)rubro.cobrado), (decimal)rubro.descuento);
                totalcondonacion = Decimal.Add(totalcondonacion, saldoRubro);
                rubro.descuento = Decimal.Add(rubro.descuento ?? 0, saldoRubro);
                decimal diferencia = Decimal.Subtract(Decimal.Subtract((decimal)rubro.saldo, (decimal)rubro.cobrado), (decimal)rubro.descuento);
                if (diferencia < 0) {
                    throw new AtlasException("CAR-0073", "EL SALDO DEL RUBRO NO PUEDE SER MENOR A CERO");
                }

                // acumula valores por tipo de saldo, a grabar en la tabla tcaroperaciontransaccionrubro.
                this.Actualizamap(rubro.csaldo, saldoRubro);

                Sessionef.Actualizar(rubro);
            }
        }

        /// <summary>
        /// Actualiza el map con los valores cobrados por codigo de saldo
        /// </summary>
        /// <param name="csaldo">Codigo de saldo.</param>
        /// <param name="valorpagado">Valor pagado.</param>
        protected void Actualizamap(String csaldo, decimal? valorpagado)
        {
            if (valorpagado == null) {
                return;
            }
            decimal? acumulado = 0;
            if (mcobro.ContainsKey(csaldo)) {
                acumulado = mcobro[csaldo];
            }

            if (acumulado == null) {
                mcobro[csaldo] = (decimal)valorpagado;
            } else {
                mcobro[csaldo] = (decimal)valorpagado + (decimal)acumulado;
            }
        }
    }

    // Mapeo de rubros a procesar
    public class TRubros : AbstractDto {
        [JsonProperty("csaldo")]
        public string Csaldo { get; set; }
        [JsonProperty("ctiposaldo")]
        public string Ctiposaldo { get; set; }
        [JsonProperty("monto")]
        public decimal Monto { get; set; }
    }

}


