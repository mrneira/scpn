using modelo;
using System.Collections.Generic;
using util.enums;
using util.thread;

namespace contabilidad.datos {

    public class DatosContabilidad : IDatosModulo {

        /// <summary>
        /// Map que almacena saldos de cuentas contables.
        /// </summary>
        private Dictionary<string, tconsaldos> msaldos = new Dictionary<string, tconsaldos>();

        /// <summary>
        /// Metodo que entrega un registro con los saldos de una cuenta contable.
        /// </summary>
        /// <param name="ccuenta">Numero de cuenta contable.</param>
        /// <param name="csucursal">Codigo de sucursal.</param>
        /// <param name="cagencia">Codigo de agencia.</param>
        /// <param name="cmoneda">Codigo de moneda.</param>
        /// <param name="ccompania">Codigo de compania.</param>
        /// <returns>TconSaldosDto</returns>
        public tconsaldos GetTconSaldos(string ccuenta, int csucursal, int cagencia, string cmoneda, int ccompania) {
            string key = ccuenta  +"^" +  csucursal + "^" + cagencia + "^" + cmoneda + "^" + ccompania;
            if(!msaldos.ContainsKey(key)) {
                return null;
            }
            return msaldos[key];
        }

        /// <summary>
        /// Adiciona un objeto tonsaldos, en el map de saldos.
        /// </summary>
        /// <param name="tconsaldo"></param>
        public void PutTconSaldo(tconsaldos tconsaldo) {
            string key = tconsaldo.ccuenta + "^" + tconsaldo.csucursal + "^" + tconsaldo.cagencia + "^" + tconsaldo.cmoneda + "^" + tconsaldo.ccompania;
            msaldos[key] = tconsaldo;
        }

        /// <summary>
        /// Encera saldos contables.
        /// </summary>
        public void Encerardatos() {
            msaldos.Clear();
        }

        /// <summary>
        /// Entrega datos de datos de contables alamcenado en un threadlocal.
        /// </summary>
        /// <returns>DatosContabilidad</returns>
        public static DatosContabilidad GetDatosContabilidad() {
            DatosContabilidad dc = (DatosContabilidad)ThreadNegocio.GetDatos().GetMdatosmodulo(EnumModulos.CONTABILIDAD.Cmodulo);
            return dc;
        }
    }
}
