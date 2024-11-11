using core.componente;
using dal.generales;
using dal.monetario;
using modelo;
using modelo.helper.cartera;
using modelo.interfaces;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.enums;
using util.movimiento;

namespace monetario.util {

    /// <summary>
    /// Clase utilitaria que se encarda de completar datos de un movimiento asociados a una transaccion monetaria.
    /// </summary>
    public class MovimientoUtil {

        /// <summary>
        /// Metodo que completa datos del movimiento dado el request monetario.
        /// </summary>
        /// <param name="rqmantenimiento">Datos del request utilizado en la ejecucion de transacciones monetarias.</param>
        /// <param name="movimiento"></param>
        public static void CompletarDesdeRequest(RqMantenimiento rqmantenimiento, Movimiento movimiento) {
            // Reverso Mensajereverso Usuarioreverso
            movimiento.mensaje = rqmantenimiento.Mensaje;
            movimiento.particion = Constantes.GetParticion(rqmantenimiento.Fconatable);
            movimiento.fcontable = rqmantenimiento.Fconatable;
            movimiento.ftrabajo = rqmantenimiento.Ftrabajo;
            movimiento.fproceso = rqmantenimiento.Fproceso;
            movimiento.fvalor = rqmantenimiento.Fvalor;
            // La fecha real toma de la base tiene un valor por default en oracle es systimestamp
            // movimiento.Freal = rqmantenimiento.Freal;
            movimiento.ctransaccion = rqmantenimiento.Ctransaccion;
            movimiento.cmodulotransaccion = rqmantenimiento.Cmodulo;
            movimiento.ctransaccionorigen = rqmantenimiento.Ctranoriginal;
            movimiento.cmoduloorigen = rqmantenimiento.Cmodulotranoriginal;
            movimiento.csucursal = rqmantenimiento.Csucursal;// Es la de la operacion.
            movimiento.cagencia = rqmantenimiento.Cagencia; // Es la de la operacion.
            movimiento.ccompania = rqmantenimiento.Ccompania;// Es la de la operacion.
            movimiento.csucursalorigen = rqmantenimiento.Csucursal;
            movimiento.cagenciaorigen = rqmantenimiento.Cagencia;
            movimiento.cterminal = rqmantenimiento.Cterminal;
            movimiento.cusuario = rqmantenimiento.Cusuario;
            movimiento.documento = rqmantenimiento.Documento;
            movimiento.imperativo = rqmantenimiento.Imperativo;
        }

        /// <summary>
        /// Metodo que completa datos del movimiento dado el request de un rubro.
        /// </summary>
        /// <param name="rqrubro">Datos de request del rubro.</param>
        /// <param name="movimiento">Datos del movimiento.</param>
        public static void CompletarMovimientoDesdRqRubro(RqRubro rqrubro, Movimiento movimiento) {
            movimiento.crubro = rqrubro.Rubro;
            movimiento.monto = rqrubro.Monto;
            movimiento.montomonedalocal = rqrubro.Monto;
            movimiento.cmonedalocal = TgenParametrosDal.GetValorTexto("MONEDALOCAL", (int)movimiento.ccompania);
            movimiento.cmoneda = rqrubro.Moneda;
            movimiento.ccuenta = rqrubro.Codigocontable;
        }

        /// <summary>
        /// Metodo que completa datos del movimiento dada la definicion de rubro y saldo.
        /// </summary>
        /// <param name="tmonrubro">Definicion de un rubro.</param>
        /// <param name="tmonsaldo">Definicion de un saldo, asociado al movimiento.</param>
        /// <param name="movimiento">Datos del movimiento.</param>
        public static void CompletarMovimientoDeseRubro(tmonrubro tmonrubro, tmonsaldo tmonsaldo, Movimiento movimiento) {
            movimiento.debito = tmonrubro.debito;
            movimiento.csaldo = tmonrubro.csaldo;
            if (movimiento.ccuenta == null) {
                // si no llega el codigo contable que se afecta con el movimiento se toma el definido en tmonsaldo.
                movimiento.ccuenta = tmonsaldo.codigocontable;
            }
        }

        /// <summary>
        /// Metodo que se encarga de completar en el movimiento datos de una cuenta.
        /// </summary>
        /// <param name="rqmantenimiento">Datos del request utilizado en la ejecucion de transacciones monetarias.</param>
        /// <param name="tmonsaldo">Onjeto que almacena la definicion de el saldo asociado al rubro.</param>
        /// <param name="rqrubro">Datos de request del rubro.</param>
        /// <param name="movimiento">Datos del movimiento.</param>
        public static void CompletarDatosCuenta(RqMantenimiento rqmantenimiento, tmonsaldo tmonsaldo, RqRubro rqrubro, Movimiento movimiento) {
            movimiento.cclase = tmonsaldo.cclase;
            MovimientoModulos m = EnumModulos.GetEnumModulos(tmonsaldo.cmodulo).GetInstanceMovimientoModulos();
            m.Completardatos(movimiento, rqmantenimiento, rqrubro);
        }

        /// <summary>
        /// Actualiza monto en rubro par, cuando no se cobra el rubro completo y se cra cuentas por cobrar.
        /// </summary>
        /// <param name="lrubros">Lista de rubros de la transaccion.</param>
        /// <param name="rubro">Objeto que contiene el rubro con los nuevos montos de la transaccion.</param>
        public static void ActualizarMontoRubroPar(List<Rubro> lrubros, Rubro rubro) {
            foreach (Rubro obj in lrubros) {
                if (obj.Tmonrubro.crubropar != null && ((int)obj.Tmonrubro.crubropar).CompareTo(rubro.Crubro) == 0) {
                    obj.Movimiento.monto = rubro.Movimiento.monto;
                    obj.Movimiento.montomonedalocal = rubro.Movimiento.monto;
                    rubro.Movimiento.montomonedalocal = rubro.Movimiento.monto;
                }
            }
        }

    }
}
