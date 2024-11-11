using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace util.enums {

    /// <summary>
    /// Enumeracion que almacena tipos de saldo de una operacion.
    /// </summary>
    public class EnumTipoSaldo {

        public static readonly EnumTipoSaldo CAPITAL = new EnumTipoSaldo("CAP");
        public static readonly EnumTipoSaldo IMPUESTOS = new EnumTipoSaldo("IMP");
        public static readonly EnumTipoSaldo CARGOS = new EnumTipoSaldo("CAR");
        public static readonly EnumTipoSaldo COMISIONES = new EnumTipoSaldo("COM");
        public static readonly EnumTipoSaldo INTERES = new EnumTipoSaldo("INT");
        public static readonly EnumTipoSaldo SALDO = new EnumTipoSaldo("SAL");
        public static readonly EnumTipoSaldo MORA = new EnumTipoSaldo("MOR");
        public static readonly EnumTipoSaldo CXC = new EnumTipoSaldo("CXC");
        public static readonly EnumTipoSaldo SEGURO = new EnumTipoSaldo("SEG");
        public static IEnumerable<EnumTipoSaldo> Values
        {
            get {
                yield return CAPITAL;
                yield return IMPUESTOS;
                yield return CARGOS;
                yield return COMISIONES;
                yield return INTERES;
                yield return SALDO;
                yield return MORA;
                yield return CXC;
                yield return SEGURO;
            }
        }
        /// <summary>
        /// Codigo de tipo de saldo.
        /// </summary>
        private String tiposaldo;

        private EnumTipoSaldo(String tiposaldo)
        {
            this.tiposaldo = tiposaldo;
        }

        /// <sumEntraga un objeto EnumTipoSaldo dado el codigo de saldo.mary>
        /// 
        /// </summary>
        /// <param name="tiposaldo">Codigo de tipo de saldo.</param>
        /// <returns></returns>
        public static EnumTipoSaldo GetEnumTipoSaldo(String tiposaldo)
        {
            EnumTipoSaldo emts = null;
            foreach (EnumTipoSaldo obj in EnumTipoSaldo.Values) {
                if (obj.tiposaldo == tiposaldo) {
                    emts = obj;
                }
            }
            return emts;
        }

        /// <summary>
        /// Metodo que valida el codigo de tipo de saldo que llega en el prametro es un capital.
        /// </summary>
        /// <param name="tiposaldo">codigo de tipo de saldo.</param>
        /// <returns>bool</returns>
        public static bool EsCapital(String tiposaldo)
        {
            return tiposaldo.Equals(EnumTipoSaldo.CAPITAL.GetTiposaldo());
        }

        /// <summary>
        /// Metodo que valida el codigo de tipo de saldo que llega en el prametro es interes.
        /// </summary>
        /// <param name="tiposaldo">codigo de tipo de saldo.</param>
        /// <returns>bool</returns>
        public static bool EsInteres(String tiposaldo)
        {
            return tiposaldo.Equals(EnumTipoSaldo.INTERES.GetTiposaldo());
        }

        /// <summary>
        /// Metodo que valida el codigo de tipo de saldo que llega en el prametro es saldo.
        /// </summary>
        /// <param name="tiposaldo"></param>
        /// <returns>bool</returns>
        public static bool EsSaldo(String tiposaldo)
        {
            return tiposaldo.Equals(EnumTipoSaldo.SALDO.GetTiposaldo());
        }

        /// <summary>
        /// Metodo que valida el codigo de tipo de saldo que llega en el prametro es una comision.
        /// </summary>
        /// <param name="tiposaldo">codigo de tipo de saldo.</param>
        /// <returns>bool</returns>
        public static bool EsComision(String tiposaldo)
        {
            return tiposaldo.Equals(EnumTipoSaldo.COMISIONES.GetTiposaldo());
        }

        /// <summary>
        /// Metodo que valida el codigo de tipo de saldo que llega en el prametro es un Impuesto.
        /// </summary>
        /// <param name="tiposaldo">codigo de tipo de saldo.</param>
        /// <returns>bool</returns>
        public static bool EsImpuesto(String tiposaldo)
        {
            return tiposaldo.Equals(EnumTipoSaldo.IMPUESTOS.GetTiposaldo());
        }

        /// <summary>
        /// Metodo que valida el codigo de tipo de saldo que llega en el prametro es un cargo.
        /// </summary>
        /// <param name="tiposaldo">codigo de tipo de saldo.</param>
        /// <returns>bool</returns>
        public static bool EsCargo(String tiposaldo)
        {
            return tiposaldo.Equals(EnumTipoSaldo.CARGOS.GetTiposaldo());
        }

        /// <summary>
        /// Metodo que valida el codigo de tipo de saldo que llega en el prametro es mora.
        /// </summary>
        /// <param name="tiposaldo">codigo de tipo de saldo.</param>
        /// <returns>bool</returns>
        public static bool EsMora(String tiposaldo)
        {
            return tiposaldo.Equals(EnumTipoSaldo.MORA.GetTiposaldo());
        }

        /// <summary>
        /// Metodo que valida el codigo de tipo de saldo que llega en el prametro es de una cxc.
        /// </summary>
        /// <param name="tiposaldo">codigo de tipo de saldo.</param>
        /// <returns>bool</returns>
        public static bool EsCxC(String tiposaldo)
        {
            return tiposaldo.Equals(EnumTipoSaldo.CXC.GetTiposaldo());
        }

        /// <summary>
        /// Metodo que valida el codigo de tipo de saldo que llega en el prametro es de una seguro.
        /// </summary>
        /// <param name="tiposaldo">codigo de tipo de saldo.</param>
        /// <returns>bool</returns>
        public static bool EsSeguro(String tiposaldo)
        {
            return tiposaldo.Equals(EnumTipoSaldo.SEGURO.GetTiposaldo());
        }

        /// <summary>
        /// Entrega el valor de: tiposaldo
        /// </summary>
        /// <returns>String</returns>
        public String GetTiposaldo()
        {
            return tiposaldo;
        }

    }

}

