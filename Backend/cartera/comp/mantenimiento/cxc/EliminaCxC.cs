using cartera.datos;
using cartera.monetario;
using core.componente;
using dal.cartera;
using dal.generales;
using modelo;
using monetario.util.rubro;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace cartera.comp.mantenimiento.cxc {

    /// <summary>
    /// Clase que se encarga de la eliminacion de cuentas por cobrar que estan asociadas en la tabla de pagos de la operacion.
    /// Si existe un registro en la tabla tcaroperacionrubro para el codigo de saldo de la cuenta por pagar, el valor de descuento se incrementa.
    /// </summary>
    public class EliminaCxC : ComponenteMantenimiento {

        /// <summary>
        ///Fecha de cobro.
        /// </summary>
        protected int fcontable;
        /// <summary>
        ///Numero de decimales para la moneda de la operacion.
        /// </summary>
        protected int decimales;

        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            Operacion operacion = OperacionFachada.GetOperacion(rqmantenimiento);
            List<tcaroperacioncuota> lcuotas = operacion.GetLcuotas();
            decimales = TgenMonedaDal.GetDecimales(operacion.tcaroperacion.cmoneda);
            fcontable = rqmantenimiento.Fconatable;

            if (rqmantenimiento.GetDatos("ELIMINARCXC") != null) {
                // Transacciones cxc
                var ltransacciones = JsonConvert.DeserializeObject<List<tcaroperaciontransaccion>>(rqmantenimiento.Mdatos["ELIMINARCXC"].ToString());
                foreach (tcaroperaciontransaccion tran in ltransacciones) {

                    // Detalle de transaccion cxc
                    List<tcaroperaciontransaccioncxc> ltransaccionescxc = TcarOperacionTransaccionCxCDal.FindRubrosPorOperacion(tran.coperacion, tran.mensaje);
                    foreach (tcaroperaciontransaccioncxc cxc in ltransaccionescxc) {
                        Eliminar(rqmantenimiento, operacion, cxc, lcuotas);
                        MonetarioHelper.EjecutaMonetario(rqmantenimiento);
                    }
                }
            }
        }

        /// <summary>
        /// Actualiza el valor de descuento de la cuenta por cobrar por cuota
        /// </summary>
        private void Eliminar(RqMantenimiento rqmantenimiento, Operacion operacion, tcaroperaciontransaccioncxc cxc, List<tcaroperacioncuota> lcuotas)
        {
            int numcuota = 0;
            foreach (tcaroperacioncuota cuota in lcuotas) {
                if ((numcuota.CompareTo(cuota.numcuota) == 0) || (cuota.fpago != null)) {
                    continue;
                }
                numcuota = cuota.numcuota;
                if (numcuota.CompareTo(cxc.numcuota) < 0) {
                    continue;
                }

                // Actualiza el valor de descuento de la cuenta por cobrar
                EliminaCxCporCuota(rqmantenimiento, operacion, cuota, cxc);
                break;
            }
        }

        /// <summary>
	    /// Si la cuota tiene asociada una CXC, para el codigo de saldo el valor de descuento se incrementa
        /// Si la diferencia entre el valor del descuento y el saldo es cero, el rubro se actualiza la fecha de pago
        /// </summary>
        private void EliminaCxCporCuota(RqMantenimiento rqmantenimiento, Operacion operacion, tcaroperacioncuota cuota, tcaroperaciontransaccioncxc cxc)
        {
            // Consulta el rubro de la cuota a actualizar
            tcaroperacionrubro rubro = TcarOperacionRubroDal.FindPorCodigoSaldo(cuota.GetRubros(), cxc.csaldo);
            if (rubro == null) {
                throw new AtlasException("CAR-0072", "CUOTA NO REGISTRA RUBRO DE CUENTA POR PAGAR");
            } else {
                if (rubro.cobrado > 0) {
                    throw new AtlasException("CAR-0074", "RUBRO DE CUENTA POR PAGAR REGISTRA UN VALOR DE PAGO, NO SE PUEDE ELIMINAR");
                }

                // Generar registro de historia.
                rqmantenimiento.Monto = decimal.Add(rqmantenimiento.Monto, (decimal)cxc.monto);
                TcarOperacionRubroHistoriaDal.RegistraHistoria(cuota, rubro, fcontable, rqmantenimiento.Mensaje, false, decimales);

                // actualiza el valor del descuento del rubro.
                rubro.descuento = Decimal.Add(rubro.descuento ?? 0, (decimal)cxc.monto);
                decimal diferencia = Decimal.Subtract((decimal)rubro.saldo, (decimal)rubro.descuento);
                if (diferencia < 0) {
                    throw new AtlasException("CAR-0073", "EL SALDO DEL RUBRO DE CUENTA POR PAGAR NO PUEDE SER MENOR A CERO");
                }
                if (diferencia.Equals(0)) {
                    rubro.fpago = fcontable;
                    rubro.mensaje = rqmantenimiento.Mensaje;
                }
                Sessionef.Actualizar(rubro);

                // actualiza cuenta por cobrar
                tcaroperacioncxc opecxc = TcarOperacionCxCDal.FindPorCodigoSaldo(rubro);
                TcarOperacionCxCHistoriaDal.Crear(rqmantenimiento, opecxc.coperacion, opecxc.csaldo, opecxc.numcuota, (decimal)opecxc.monto, (int)opecxc.fvigencia, opecxc.mensaje);
                opecxc.fpago = fcontable;
                opecxc.mensaje = rqmantenimiento.Mensaje;
                Sessionef.Actualizar(opecxc);

                // Contabiliza CXC
                Contabiliza(rqmantenimiento, operacion, rubro, cxc.csaldo, (decimal)cxc.monto);
            }
        }

        /// <summary>
        /// Metodo que se encarga de verificar si contabiliza o no el ingreso de la CXC, si contabiliza adiciona los rubros al request monetario.
        /// </summary>
        private void Contabiliza(RqMantenimiento rqmantenimiento, Operacion operacion, tcaroperacionrubro rubro, String csaldo, Decimal monto)
        {
            tcarcuentaporcobrar tcc = TcarCuentaPorCobrarDal.Find(csaldo);

            if (tcc == null) {
                throw new AtlasException("BCAR-0017", "RUBRO [{0}] NO DEFINIDO EN CUENTAS POR COBRAR", csaldo);
            }

            if (tcc.contabilizaingreso == null || tcc.contabilizaingreso == false) {
                return;
            }
            TransaccionRubro tr = new TransaccionRubro(rqmantenimiento.Cmodulo, rqmantenimiento.Ctransaccion);
            RubroHelper.AdicionarrubroRqMantenimiento(rqmantenimiento, operacion.tcaroperacion, tr.GetRubro(rubro.csaldo).crubro, rubro, monto);
        }

    }
}
