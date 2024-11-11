using amortizacion.dto;
using amortizacion.helper;
using cartera.enums;
using core.componente;
using core.servicios;
using dal.cartera;
using dal.contabilidad;
using dal.generales;
using modelo;
using modelo.interfaces;
using monetario.util;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace cartera.datos {

    /// <summary>
    /// Clase que se encarga de manejar valores de cuentas por pagar asociadas a una operacion de cartera. 
    /// Ejemplo actualizar saldos, generar debitos y creditos.
    /// </summary>
    public class Operacioncxp {

        /// <summary>
        /// Almacena informacion de una cuanta por pagar asociada a una operacion de cartera.
        /// </summary>
        private tcaroperacioncxp tcaroperacioncxp;

        /// <summary>
        /// Objeto que almacena informacion de una operacion de cartera.
        /// </summary>
        private tcaroperacion tcaroperacion;

        /// <summary>
        /// Crea una instancia de Operacioncxp.
        /// </summary>
        /// <param name="tcaroperacion">Objeto que almacena informacion de una operacion de cartera.</param>
        public Operacioncxp(tcaroperacion tcaroperacion) {
            this.tcaroperacion = tcaroperacion;
            // Busca en la base un registro de cuenta por pagar, si no existe crea uno con slado cero.
            this.tcaroperacioncxp = TcarOperacionCxPDal.FindOrCreate(tcaroperacion.coperacion);
        }

        /// <summary>
        /// Metodo que se encarga de actualizar saldos de cuentas por pagar asociadas a una operacion de cartera.
        /// </summary>
        /// <param name="tcarmovimiento">Objeto que contiene los datos de movimiento de una operacion de cartera.</param>
        /// <param name="rubro">Objero que contiene los datos del rubro monetario.</param>
        public void ActulizarSaldo(tcarmovimiento tcarmovimiento,  Rubro rubro) {

            if (rubro.Suma) {
                TcarOperacionCxPDal.Sumar(this.tcaroperacioncxp, tcarmovimiento.monto);
            } else {
                TcarOperacionCxPDal.Restar(this.tcaroperacioncxp, tcarmovimiento.monto);
            }
        }

        /// <summary>
        /// Ejecuta debito por el saldo de la cxp de la operacion de cartera.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se procesa la transaccion.</param>
        /// <returns>decimal</returns>
        public decimal Debitototal(RqMantenimiento rqmantenimiento) {
            decimal monto = (decimal)this.tcaroperacioncxp.saldo;
            this.Debito(rqmantenimiento, monto);
            return monto;
        }

        /// <summary>
        /// Ejecuta un debito en la cxp y resta el saldo, Si el saldo de la cxp es menor al monto, 
        /// debita el saldo de la cxp, si el saldo es mayor al monto debita el monto que llega como parametro.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se procesa la transaccion.</param>
        /// <param name="monto">Valor a restar del saldo.</param>
        /// <returns></returns>
        public decimal BuscamontoDebita(RqMantenimiento rqmantenimiento, decimal monto) {
            decimal? valordebitado = Constantes.CERO;
            decimal? saldocxp = TcarOperacionCxPDal.FindOrCreate(this.tcaroperacion.coperacion).saldo;
            if (saldocxp <= Constantes.CERO) {
                return (decimal)valordebitado;
            }
            if (saldocxp > monto) {
                valordebitado = monto;
            } else {
                valordebitado = saldocxp;
            }
            tcarevento evento = TcarEventoDal.Find(EnumEventos.DEBITO_CXP.Cevento);
            this.Ejecutamonetrio(rqmantenimiento, evento, (decimal)valordebitado);
            return (decimal)valordebitado;
        }

        /// <summary>
        /// Ejecuta un debito en la cxp y resta el saldo. Verifica que no quede saldo negarivo.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se procesa la transaccion.</param>
        /// <param name="monto">Valor a restar del saldo.</param>
        public void Debito(RqMantenimiento rqmantenimiento, decimal monto) {
            tcarevento evento = TcarEventoDal.Find(EnumEventos.DEBITO_CXP.Cevento);
            this.Ejecutamonetrio(rqmantenimiento, evento, monto);
        }

        /// <summary>
        /// Ejecuta un credito a la cxp y suma el saldo.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se procesa la transaccion.</param>
        /// <param name="monto">Valor a sumar al saldo.</param>
        public void Credito(RqMantenimiento rqmantenimiento, decimal monto) {
            tcarevento evento = TcarEventoDal.Find(EnumEventos.CREDITO_CXP.Cevento);
            TcarOperacionTransaccionCxPDal.Crear(rqmantenimiento, tcaroperacion.coperacion, monto, rqmantenimiento.Fconatable,
                        rqmantenimiento.Fconatable);
            this.Ejecutamonetrio(rqmantenimiento, evento, monto);
        }

        /// <summary>
        /// Adiciona rubros al request monetario.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se procesa la transaccion.</param>
        /// <param name="evento">Evento que contiene el codigo de transaccion con el cual se ejecuta el monetario..</param>
        /// <param name="monto">Valor de la transaccion.</param>
        private void Ejecutamonetrio(RqMantenimiento rqmantenimiento, tcarevento evento, decimal monto) {
            rqmantenimiento.Cambiartransaccion((int)evento.cmodulo, (int)evento.ctransaccion);
            rqmantenimiento.EncerarRubros();
            RqRubro rqrubro = new RqRubro(1, monto, this.tcaroperacion.cmoneda);
            rqrubro.Coperacion = this.tcaroperacion.coperacion;
            rqrubro.Actualizasaldo = false;
            rqmantenimiento.AdicionarRubro(rqrubro);
            // Ejecuta la transaccion monetaria anidada.
            ComprobanteMonetario monetario = new ComprobanteMonetario();
            monetario.Ejecutar(rqmantenimiento);
        }

        /// <summary>
        /// Entrega el valor de: tcaroperacioncxp
        /// </summary>
        /// <returns>TcarOperacionCxPDto</returns>
        public tcaroperacioncxp GetTcaroperacioncxp() {
            return this.tcaroperacioncxp;
        }

        /// <summary>
        /// Entrega el saldo de la cxp asociada a una operacion de cartera.
        /// </summary>
        /// <returns>decimal</returns>
        public decimal GetSaldo() {
            return (decimal)this.tcaroperacioncxp.saldo;
        }
    }

}
