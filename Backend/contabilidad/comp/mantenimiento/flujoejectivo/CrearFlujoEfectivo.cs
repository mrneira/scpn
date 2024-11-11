using core.componente;
using dal.contabilidad.flujoefectivo;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace contabilidad.comp.mantenimiento.flujoejectivo {
    /// <summary>
    /// CLase que se encarga de leer saldos contable sy poblarlos en la tabla tconflujoefectivo.
    /// </summary>
    public class CrearFlujoEfectivo : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            int aniofin = Int16.Parse( rqmantenimiento.Mdatos["aniofin"].ToString());
            string tipoplancdetalle = rqmantenimiento.Mdatos["tipoplancdetalle"].ToString();
            TconFlujoEfectivoDal.Eliminar(aniofin, tipoplancdetalle);
            this.CrearFlujo(aniofin, tipoplancdetalle);
        }

        /// <summary>
        /// Llena tabla tconflujoefectivo con saldos contables a nivel 3 de activo, pasivo, patrimonio, ingresos y gastos.
        /// </summary>
        /// <param name="aniofin"></param>
        private void CrearFlujo(int aniofin, string tipoplancdetalle) {
            IList<Dictionary<string, object>> lsaldos = TconFlujoEfectivoDal.getSaldosFlujo(aniofin, tipoplancdetalle);
            foreach (Dictionary<string, object> obj in lsaldos) {
                this.CrearPorCuenta(obj, aniofin);
            }
        }

        /// <summary>
        /// Crea e inserta registros en la tabla tconflujoefectivo por cuenta contable.
        /// </summary>
        /// <param name="obj">Objeto que contiene las cuentas contables y saldos con los cuales se crea un registro en tconflujoefectivo. </param>
        /// <param name="aniofin">Anio de consulta de saldos de finalizacion.</param>
        private void CrearPorCuenta(Dictionary<string, object> obj, int aniofin) {
            String ccuenta = (String)obj["ccuenta"];
            Decimal saldofin = obj["montofin"] == null ? 0 : decimal.Parse(obj["montofin"].ToString());
            Decimal saldoini = obj["montoini"] == null ? 0 : decimal.Parse(obj["montoini"].ToString());
            if (ccuenta.StartsWith("33"))
            {
                saldofin = 0;
            }
            if (ccuenta.StartsWith("4") || ccuenta.StartsWith("5") || ccuenta.StartsWith("74") || ccuenta.StartsWith("75")) {
                saldoini = 0;
            }
            if(ccuenta.StartsWith("2") || ccuenta.StartsWith("72") || ccuenta.StartsWith("3") || ccuenta.StartsWith("73") || ccuenta.StartsWith("5") || ccuenta.StartsWith("75")) {
                saldoini = saldoini * -1;
                saldofin = saldofin * -1;
            }
            if (ccuenta.StartsWith("6") || ccuenta.StartsWith("76")) {
                return; // solo se considera hasta ingresos grupo 5 o 75.
            }
            
            String tipoplancdetalle = (String)obj["tipoplancdetalle"];
            String tipoefectivo = (String)obj["tipoefectivo"];
            tconflujoefectivo fe = TconFlujoEfectivoDal.Crear(aniofin, ccuenta, tipoplancdetalle, tipoefectivo, saldofin, saldoini);

            TconFlujoEfectivoDal.ActualizarSaldos(fe);
            Sessionef.Save(fe);
        }
    }
}