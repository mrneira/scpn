using cartera.datos;
using cartera.monetario;
using core.componente;
using dal.cartera;
using dal.generales;
using modelo;
using monetario.util.rubro;
using System;
using System.Collections.Generic;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace cartera.comp.mantenimiento.cxc {

    /// <summary>
    /// Clase que se encarga del ingreso de cuentas por cobrar, estas se asocian a la tabla de pagos de la operacion.<br>
    /// Si existe un registro en la tabla tcaroperacionrubro para el codigo de saldo de la cuenta por pagar, se incrementa el valor.
    /// </summary>
    public class IngresoCxC : ComponenteMantenimiento {

        /// <summary>
        /// NUmero de cuota desde la cual se crea la CXC.
        /// </summary>
        private int? cuotainicio;

        /// <summary>
        /// Numero de cuotas entre las cuales se divide el valor a crear cxc.
        /// </summary>
        private int? numerocuotas;

        /// <summary>
        /// Codigo de saldo asociado a las cxc a crear.
        /// </summary>
        private string csaldo;

        /// <summary>
        /// Valor a asociar a cada rubro de la cuota.
        /// </summary>
        private Decimal valorcuota;

        /// <summary>
        /// Es el residuo de dividir el monto total para el numero de cuotas, si existe una diferencia esta se asocia a la primera cuota.
        /// </summary>
        private Decimal diferencia;

        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            Operacion operacion = OperacionFachada.GetOperacion(rqmantenimiento);
            Llenarvariables(rqmantenimiento, operacion);

            List<tcaroperacioncuota> lcuotas = operacion.GetLcuotas();

            Validaciones(lcuotas);
            Crear(rqmantenimiento, operacion, lcuotas);
            // ejecuta el monetario.
            MonetarioHelper.EjecutaMonetario(rqmantenimiento);
        }

        /// <summary>
        /// Crea CXC, desde la cuota de inicio hasta la cuota de finalizacion.
        /// </summary>
        private void Crear(RqMantenimiento rqmantenimiento, Operacion operacion, List<tcaroperacioncuota> lcuotas)
        {
            int numcuota = 0;
            foreach (tcaroperacioncuota cuota in lcuotas) {
                if ((numcuota.CompareTo(cuota.numcuota) == 0) || (cuota.fpago != null)) {
                    continue;
                }
                numcuota = cuota.numcuota;
                if (numcuota.CompareTo(cuotainicio) < 0) {
                    continue;
                }
                if (numcuota.CompareTo(cuotainicio + numerocuotas) >= 0) {
                    break;
                }
                // crea o actuliza el saldo de cuenta por pagar por cuota.
                CreaCxCporCuota(cuota, rqmantenimiento, operacion);
            }
        }

        /// <summary>
        /// Asocia una CXC a la cuota.<br>
	    /// Si la cuota tiene asociada una CXC, para el codigo de saldo incrementa el valor, casocontrario crea un registro de tipo
        /// tcaroperacionrubro y lo adciona a los rubros de la cuota.
        /// </summary>
        private void CreaCxCporCuota(tcaroperacioncuota cuota, RqMantenimiento rqmantenimiento, Operacion operacion)
        {
            if (cuota.fvencimiento < rqmantenimiento.Fproceso) {
                throw new AtlasException("CAR-0009", "CUOTA DE INICIO NO PUEDE ESTAR VENCIDA");
            }
            // si tengo una cxc de 100 a cobrar en 3 cuotas da un valor cuota de 33.33 tengo una diferencia de 0.01 esta se aplica a la primera
            // cuota.
            Decimal monto = Decimal.Add(valorcuota, diferencia);

            // Crea la CXC, si existe una cxc para el codigo de saldo se suma el valor, si no existe se crea.
            tcaroperacionrubro rubro = TcarOperacionRubroDal.FindPorCodigoSaldo(cuota.GetRubros(), csaldo);

            if (rubro == null) {
                rubro = TcarOperacionRubroDal.CreaRubro(cuota, csaldo, monto, rqmantenimiento.Fproceso ?? 0, false);
                rubro.saldo = rubro.valorcuota;
                cuota.GetRubros().Add(rubro);
                Sessionef.Save(rubro);

                TcarOperacionCxCDal.Crear(rqmantenimiento, cuota.coperacion, (decimal)rubro.valorcuota, csaldo, cuota.numcuota, (int)cuota.fvigencia);
            } else {                
                // actualiza el valor de cuota del rubro.
                rubro.valorcuota = Decimal.Add(rubro.valorcuota ?? 0, monto);
                rubro.saldo = Decimal.Add(rubro.saldo ?? 0, monto);
                rubro.fpago = null;

                tcaroperacioncxc cxc = TcarOperacionCxCDal.FindPorCodigoSaldo(rubro);
                TcarOperacionCxCHistoriaDal.Crear(rqmantenimiento, cxc.coperacion, cxc.csaldo, cxc.numcuota, (decimal)cxc.monto, (int)cxc.fvigencia, cxc.mensaje);
                cxc.monto = Decimal.Add(cxc.monto ?? 0, monto);
                cxc.fpago = null;
                Sessionef.Actualizar(cxc);
            }

            // Inserta registros de valores registrados en la tabla de amortizacion.
            TcarOperacionTransaccionCxCDal.Crear(rqmantenimiento, cuota.coperacion, monto, csaldo, cuota.numcuota);
            
            // Contabiliza CXC
            Contabiliza(rqmantenimiento, operacion, rubro, monto);

            // actualiza la diferencia a zero si existe una diferencia esta se asocia en a primera cuota de la cxc que se crea.
            diferencia = Decimal.Zero;
        }



        /// <summary>
        /// Metodo que se encarga de verificar si contabiliza o no el ingreso de la CXC, si contabiliza adiciona los rubros al request monetario.
        /// </summary>
        private void Contabiliza(RqMantenimiento rqmantenimiento, Operacion operacion, tcaroperacionrubro rubro, Decimal monto)
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

        /// <summary>
        /// Ejecuta validaciones que minimas para poder crear o incrementar el valor de una cuenta por cobrar.
        /// </summary>
        private void Validaciones(List<tcaroperacioncuota> lcuotas)
        {
            tcaroperacioncuota cuotafinal = lcuotas[lcuotas.Count - Constantes.UNO];
            int numcuotas = cuotafinal.numcuota;
            if (numcuotas.CompareTo(cuotainicio + numerocuotas - 1) < 0) {
                throw new AtlasException("CAR-0010", "CUOTA DE FINALIZACION TIENE QUE SER MENOR O IGUAL AL NUMERO DE CUOTAS DE LA OPERACION");
            }
        }

        /// <summary>
        /// Metodo que llena variables desde el request.
        /// </summary>
        private void Llenarvariables(RqMantenimiento rqmantenimiento, Operacion operacion)
        {
            cuotainicio = rqmantenimiento.GetInt("cuotainicio");
            numerocuotas = rqmantenimiento.GetInt("numerocuotas");
            csaldo = rqmantenimiento.GetString("csaldo");
            Decimal monto = rqmantenimiento.Monto;
            valorcuota = Math.Round(Decimal.Divide(monto, new Decimal(numerocuotas ?? 0)), TgenMonedaDal.GetDecimales(operacion.tcaroperacion.cmoneda));
            diferencia = Decimal.Subtract(monto, Decimal.Multiply(valorcuota, new Decimal(numerocuotas ?? 0)));
        }
    }
}
