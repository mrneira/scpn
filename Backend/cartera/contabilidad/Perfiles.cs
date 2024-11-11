using dal.cartera;
using dal.monetario;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace cartera.contabilidad {

    /// <summary>
    /// Clase que se encarga de remplazar los codigos contables asociados a perfiles.
    /// </summary>
    public class Perfiles {

        /// <summary>
        /// Objeto que contiene datos de una operacion de cartera.
        /// </summary>
        private tcaroperacion tcaroperacion;

        private static String TIPO_PRODUCTO_SALDO = "-TP";

        private static String BANDA = "-R";


        /// <summary>
        /// Crea una instancia de perfiles.
        /// </summary>
        /// <param name="tcaroperacion">Objeto que contiene datos de una operacion de cartera.</param>
        public Perfiles(tcaroperacion tcaroperacion) {
            this.tcaroperacion = tcaroperacion;
        }

        /// <summary>
        /// Crea una instancia de perfiles.
        /// </summary>
        public Perfiles() {
        }

        public void Procesar(tcaroperacioncuota cuota, tcaroperacionrubro rubro, int fproceso) {
            String codcontable = rubro.codigocontable;
            if (codcontable.IndexOf(Perfiles.BANDA) > 0) {
                RemplazaRango(cuota, rubro, fproceso);
            }
            if (codcontable.IndexOf(Perfiles.TIPO_PRODUCTO_SALDO) > 0) {
                RemplazaTipoProductoSaldo(cuota, rubro, fproceso);
            }
        }

        /// <summary>
        /// Remplaza codigo de contable de rango, plazo, estatus y estado operacion.
        /// </summary>
        /// <param name="cuota">Datos de una cuota.</param>
        /// <param name="rubro">Datos de una cuota.</param>
        /// <param name="fproceso">Fecha en la que se realiza la contabilizacion.</param>
        public void RemplazaRango(tcaroperacioncuota cuota, tcaroperacionrubro rubro, int fproceso) {
            String codcont = rubro.codigocontable;
            if (codcont.IndexOf(Perfiles.BANDA) <= 0) {
                return;
            }
            int dias = TcarOperacionCuotaDal.GetDias(cuota, fproceso);
            tcarperfilebanda perfilbanda = TcarPerfilBandaDal.Find((int)this.tcaroperacion.cmodulo, (int)this.tcaroperacion.cproducto, (int)this.tcaroperacion.ctipoproducto, cuota.cestatus,
                tcaroperacion.cestadooperacion, tcaroperacion.csegmento, dias);

            rubro.codigocontable = codcont.ToUpper().Replace(Perfiles.BANDA, perfilbanda.codigocontable);
            cuota.cbanda = perfilbanda.cbanda;
        }

        /// <summary>
        /// Remplaza el codigo contable del estado de cuota, tipo credito, estado de la operacion y rango.
        /// </summary>
        /// <param name="cuota">Datos de una cuota.</param>
        /// <param name="rubro">Datos de una cuota.</param>
        /// <param name="fproceso">Fecha en la que se realiza la contabilizacion.</param>
        public void RemplazaTipoProductoSaldo(tcaroperacioncuota cuota, tcaroperacionrubro rubro, int fproceso) {
            String codcont = rubro.codigocontable;
            if (codcont.IndexOf(Perfiles.TIPO_PRODUCTO_SALDO) <= 0) {
                return;
            }
            tcarperfiltipoproducto perfil = TcarPerfilTipoProductoDal.Find((int)tcaroperacion.cmodulo, (int)tcaroperacion.cproducto, (int)tcaroperacion.ctipoproducto, rubro.csaldo);
            rubro.codigocontable = codcont.ToUpper().Replace(Perfiles.TIPO_PRODUCTO_SALDO, perfil.ccontable);
        }


        /// <summary>
        /// Entrega el codigo contable por tipo de producto.
        /// </summary>
        /// <param name="csaldo">Codigo de saldo.</param>
        /// <param name="cmodulo">Codigo de producto</param>
        /// <param name="cproducto">Codigo de producto</param>
        /// <param name="ctipoproducto">Codigo de tipo de producto</param>
        /// <param name="codigocontable">Codigo contable.</param>
        /// <returns></returns>
        public static String GetCodigoContableTipoProducto(String csaldo, int cmodulo, int cproducto, int ctipoproducto, String codigocontable) {
            if (codigocontable == null) {
                codigocontable = TmonSaldoDal.Find(csaldo).codigocontable;
            }
            if (codigocontable.IndexOf(Perfiles.TIPO_PRODUCTO_SALDO) > 0) {
                tcarperfiltipoproducto perfil = TcarPerfilTipoProductoDal.Find(cmodulo, cproducto, ctipoproducto, csaldo);
                codigocontable = codigocontable.ToUpper().Replace(Perfiles.TIPO_PRODUCTO_SALDO, perfil.ccontable);
            }

            return codigocontable;
        }

        /// <summary>
        /// Fija el codigo contable del movimeinto definido por producto, tipo de producto y codigo de saldo.
        /// </summary>
        /// <param name="tcarOperacion"></param>
        /// <param name="tcarMovimiento"></param>
        public static void SetCodigoContable(tcaroperacion tcarOperacion, tcarmovimiento tcarMovimiento) {
            String codigocontable = tcarMovimiento.ccuenta;
            if (codigocontable.IndexOf(Perfiles.TIPO_PRODUCTO_SALDO) > 0) {
                codigocontable = Perfiles.GetCodigoContableTipoProducto(tcarMovimiento.csaldo, (int)tcarOperacion.cmodulo, (int)tcarOperacion.cproducto, (int)tcarOperacion.ctipoproducto, codigocontable);
                tcarMovimiento.ccuenta = codigocontable;
            }
        }

    }
}
