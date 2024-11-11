using contabilidad.datos;
using dal.contabilidad;
using dal.contabilidad.conciliacionbancaria;
using dal.monetario;
using modelo;
using modelo.interfaces;
using System.Collections.Generic;
using util.dto;
using util.servicios.contable;

namespace contabilidad.saldo {

    /// <summary>
    /// Clase encargada del manejo de saldos contables.
    /// </summary>
    public class SaldoHelper {

        public bool reversar = false;
        /// <summary>
        /// true llena tabla de libro bancos para cuentas contables definidas en tconbamco.
        /// </summary>
        public bool llenarLibroBancos = true;

        /// <summary>
        /// Metodo que se encarga de acumular saldos en cuenta padre, los saldos acumulados los llena en la tabla tconsaldosusuario.
        /// </summary>
        /// <param name="cusuario">Codigo de usuario.</param>
        /// <param name="ccompania">Codigo de compania a la que pertenece el usuario.</param>
        /// <param name="fproceso">Fecha de proceso a la cual se realiza el rollup de los saldos.</param>
        public void Rollup(string cusuario, int ccompania, int fproceso)
        {
            // Elimina informacion previa de saldos de usuario.
            TconSaldosUsuarioDal.Eliminar(cusuario, ccompania);

            // Inserta registro de saldos de ultimo nivel o nivel de cuenta de movimiento.
            TconSaldosUsuarioDal.Insertar(cusuario, ccompania, fproceso);

            IList<tconnivel> lnivel = TconNivelDal.FindDescendente(ccompania);
            foreach (tconnivel tconNivel in lnivel) {
                if (((int)tconNivel.cnivel).CompareTo(1) == 0) {
                    break;
                }
                TconSaldosUsuarioDal.Rollup(cusuario, ccompania, (int)tconNivel.cnivel);
            }
            TconSaldosUsuarioDal.UpdateContinegente(cusuario, ccompania);
            TconSaldosUsuarioDal.UpdateOrden(cusuario, ccompania);
        }

        /// <summary>
        /// Actualiza saldos dado una lista de detalle de un comprobante contable.
        /// </summary>
        /// <param name="response">Objeto que contiene la respuesta de ejecucion de una transacción.</param>
        /// <param name="ldetalle">Lista de registros de detalle de un comprobante contable.</param>
        public void Actualizar(Response response, tconcomprobante cabecera, List<IBean> ldetalle)
        {
            this.Validaecuacioncontable(ldetalle);
            foreach (tconcomprobantedetalle detalle in ldetalle) {
                this.ActualizarPorDetalle(cabecera, detalle);
            }
        }

        /// <summary>
        /// Actualiza saldos dado una lista de detalle de un comprobante contable.
        /// </summary>
        /// <param name="response">Objeto que contiene la respuesta de ejecucion de una transacción.</param>
        /// <param name="ldetalle">Lista de registros de detalle de un comprobante contable.</param>
        public void ActualizarLote(tconcomprobante cabecera, List<tconcomprobantedetalle> ldetalle)
        {
            foreach (tconcomprobantedetalle detalle in ldetalle) {
                this.ActualizarPorDetalle(cabecera, detalle);
            }
        }

        /// <summary>
        /// Valida que el comprobante cumpla con la ecuacion conatble.
        /// </summary>
        /// <param name="ldetalle">Objeto que contiene la lista de asientos contables.</param>
        /// <param name="response">Objeto que contiene el response de la aplicacion.</param>
        /// <returns>bool</returns>
        private void Validaecuacioncontable(List<IBean> ldetalle)
        {
            EcuacionContable ec = new EcuacionContable();
            tconcatalogo cuentadetalle;
            foreach (tconcomprobantedetalle detalle in ldetalle) {
                cuentadetalle = TconCatalogoDal.Find(detalle.ccompania, detalle.ccuenta);
                bool esSaldoDeudor = TmonClaseDal.Find(cuentadetalle.cclase).suma.Equals("D") ? true : false;
                bool suma = TmonClaseDal.Suma(detalle.cclase, detalle.debito);
                if(detalle.montooficial>0)
                ec.ActualizarSaldo(detalle.cclase, (decimal)detalle.montooficial, suma, cuentadetalle.tipoplancdetalle, esSaldoDeudor);
            }
            ec.Validar();
        }

        /// <summary>
        /// Actualiza saldos conatbles.
        /// </summary>
        /// <param name="detalle">Objeto que contiene datos de una linea del comprobante contable.</param>
        private void ActualizarPorDetalle(tconcomprobante cabecera, tconcomprobantedetalle detalle)
        {
            DatosContabilidad dc = DatosContabilidad.GetDatosContabilidad();
            // Obtiene el saldo de memoria, si no esta en memoria busca en la base y bloquea el registo.
            tconsaldos tcs = dc.GetTconSaldos(detalle.ccuenta, (int)detalle.csucursal, (int)detalle.cagencia, detalle.cmoneda, (int)detalle.ccompania);
            if (tcs == null) {
                // busa el saldo en la base y bloquea el registro.
                tcs = TconSaldosDal.Obtienesaldo(detalle);
                dc.PutTconSaldo(tcs);
            }

            // Gnera registros de historia de saldos contables.
            if (tcs.fvigencia.CompareTo(detalle.fcontable) < 0) {
                TconSaldosHistoriaDal.CrearHistoria(tcs, (int)detalle.fcontable);
                tcs.fvigencia = (int)detalle.fcontable;
            }

            if (this.EsSuma(detalle)) {
                tcs.monto = tcs.monto + detalle.monto;
                tcs.montooficial = tcs.montooficial + detalle.montooficial;
            } else {
                tcs.monto = tcs.monto - detalle.monto;
                tcs.montooficial = tcs.montooficial - detalle.montooficial;
            }

            // crea libro bancos, utilizado en la conciliacion bancaria.

            string numerodocumentobancario = "";
                tconbanco tcb = TconBancoDal.Find(detalle.ccuenta);
            if (!cabecera.comentario.Contains("CASH"))
            //if (cabecera.ctransaccion.Value == 8 && cabecera.cmodulo.Value == 21)
            {
                if (tcb != null)
                {
                    numerodocumentobancario = (cabecera.ctransaccion.Value == 50 && cabecera.cmodulo.Value == 28) ? cabecera.numerodocumentobancario : detalle.numerodocumentobancario;
                    TconLibroBancosDal.Crear(tcb.ccuentabanco, detalle.fcontable, detalle.ccomprobante, (int)cabecera.cmodulo, (int)cabecera.ctransaccion,
                        (decimal)((bool)detalle.debito ? detalle.monto : 0), (decimal)(!(bool)detalle.debito ? detalle.monto : 0), numerodocumentobancario);
                }
            }
        }

        /// <summary>
        /// Indica si el movimiento suma o resta el saldo de la cuenta contable.
        /// </summary>
        /// <param name="detalle">Objeto que contiene datos de un asiento contable.</param>
        /// <returns></returns>
        private bool EsSuma(tconcomprobantedetalle detalle)
        {
            bool suma = (bool)detalle.suma;
            if (reversar) {
                suma = (bool)detalle.suma ? false : true;
            }
            return suma;
        }

    }
}
