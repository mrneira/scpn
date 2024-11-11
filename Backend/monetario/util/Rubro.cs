using core.componente;
using dal.monetario;
using modelo;
using modelo.helper.cartera;
using modelo.interfaces;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.enums;


namespace monetario.util {

    /// <summary>
    /// Clase utilitaria encargada de crear rubros o movimientos asociados a una transaccion monetaria.
    /// </summary>
    public class Rubro : IRubroMonetario {

        /// <summary>
        /// Codio de rubro.
        /// </summary>
        private int? crubro;
        /// <summary>
        /// Referencia al objeto que almacena datos del movimiento el cual puede estar asociado a una operacion a caja, contabilidad.
        /// </summary>
        private Movimiento movimiento;
        /// <summary>
        /// Referencia al objeto que contiene la definicion del codigo de saldo, ejemplo efectivo.
        /// </summary>
        private tmonsaldo tmonsaldo;
        /// <summary>
        /// Referencia al objeto que contiene la definicion del codigo de saldo, ejemplo efectivo.
        /// </summary>
        private tmonrubro tmonrubro = null;
        /// <summary>
        /// Indica si el movimiento asociado al rubro suma o resta los saldos de una operacion.
        /// </summary>
        private bool suma;

        public int? Crubro { get => crubro; set => crubro = value; }
        public Movimiento Movimiento { get => movimiento; set => movimiento = value; }
        public tmonsaldo Tmonsaldo { get => tmonsaldo; set => tmonsaldo = value; }
        public tmonrubro Tmonrubro { get => tmonrubro; set => tmonrubro = value; }
        public bool Suma { get => suma; set => suma = value; }

        /// <summary>
        /// Crea un rubro en modo normal, completa el rubro con datos del request mas klas definiciones del rubro y el codigo de saldo.
        /// </summary>
        /// <param name="rqmantenimiento">Request que contiene la informacion necesaria para armar un movimiento monetario.</param>
        /// <param name="tmonRubro">Deficion de un rubro.</param>
        /// <param name="rqRubro">Datos del request del rubro.</param>
        public Rubro(RqMantenimiento rqmantenimiento, tmonrubro tmonRubro, RqRubro rqRubro)
        {
            tmonrubro = tmonRubro;
            crubro = tmonrubro.crubro;
            tmonsaldo = TmonSaldoDal.Find(tmonRubro.csaldo);
            // Obtiene una instancia del bean que maneja el movimiento asociado a un modulo.
            movimiento = EnumModulos.GetEnumModulos(tmonsaldo.cmodulo).GetInstanceDeMovimiento();
            if (movimiento == null) {
                // Si no existe una clase que maneje movimiento asociado al modulo no hacer nada.
                return;
            }

            MovimientoUtil.CompletarDesdeRequest(rqmantenimiento, movimiento);
            MovimientoUtil.CompletarMovimientoDesdRqRubro(rqRubro, movimiento);
            MovimientoUtil.CompletarMovimientoDeseRubro(tmonRubro, tmonsaldo, movimiento);
            MovimientoUtil.CompletarDatosCuenta(rqmantenimiento, tmonsaldo, rqRubro, movimiento);
            suma = TmonClaseDal.Suma(movimiento.cclase, movimiento.debito);
            if (movimiento.cmoneda == null) {
                movimiento.cmoneda = rqmantenimiento.Cmoneda;
            }
        }

        /// <summary>
        /// Crea un rubro en modo reverso, cambia debitospor credito y compelta el signo.
        /// </summary>
        /// <param name="rqmantenimiento">Request que contiene la informacion necesaria para armar un movimiento monetario.</param>
        /// <param name="movimiento">Datos del movimiento reversado</param>
        public Rubro(RqMantenimiento rqmantenimiento, Movimiento movimiento)
        {
            this.movimiento = movimiento;
            crubro = this.movimiento.crubro;
            tmonsaldo = TmonSaldoDal.Find(this.movimiento.csaldo);

            // cambia debitos por creditos.
            if ((bool)this.movimiento.debito) {
                this.movimiento.debito = false;
            } else {
                this.movimiento.debito = true;
            }
            this.movimiento.reverso = "Y";
            suma = TmonClaseDal.Suma(this.movimiento.cclase, this.movimiento.debito);
        }

    }
}
