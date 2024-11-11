using dal.cartera;
using modelo;
using monetario.util;
using System;
using util.dto.mantenimiento;

namespace cartera.monetario {

    /// <summary>
    /// Clase utilitaria utilizada utilizada en la creacion de rubros monetarios utilizados en cartera.
    /// </summary>
    public class RubroHelper {

        /// <summary>
        /// Adiciona rubros al request monetario.
        /// </summary>
        /// <param name="rqmantenimiento">Datos de entrada con los que se ejecuta la transaccion.</param>
        /// <param name="tcaroperacion">Objeto que contiene daos de una operacion de cartera.</param>
        /// <param name="crubro">Codigo de rubro con el que se ejecuta la transaccion monetari</param>
        /// <param name="rubro">Objeto que contiene la informacion del rubro de la cuota.</param>
        /// <param name="monto">Monto con el que se registra la transaccion monetaria.</param>
        public static void AdicionarrubroRqMantenimiento(RqMantenimiento rqmantenimiento, tcaroperacion tcaroperacion, int crubro,
        tcaroperacionrubro rubro, decimal monto)
        {
            RubroHelper.AdicionarRubro(rqmantenimiento, crubro, null, rubro, monto, tcaroperacion.coperacion, tcaroperacion.cmoneda);
        }

        /// <summary>
        /// Adiciona rubros al request monetario.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion monetaria.</param>
        /// <param name="crubro">Codigo de rubro con el que se ejecuta la transaccion monetaria.</param>
        /// <param name="rubro">Objeto que contiene los datos del rubro de una cuota.</param>
        /// <param name="monto">Monto con el cual se genera el monetario.</param>
        /// <param name="coperacion">Codigo de operacion de cartera.</param>
        /// <param name="cmoneda">Codigo de moneda de la operacion de cartera.</param>
        public static void AdicionarRubro(RqMantenimiento rqmantenimiento, int crubro, tcaroperacionrubro rubro, decimal monto,
            String coperacion, String cmoneda)
        {
            RubroHelper.AdicionarRubro(rqmantenimiento, crubro, null, rubro, monto, coperacion, cmoneda);

        }

        /// <summary>
        /// Adiciona rubros al request monetario.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion monetaria.</param>
        /// <param name="crubro">Codigo de rubro con el que se ejecuta la transaccion monetaria.</param>
        /// <param name="codigocontable">Codigo de contable del rubro.</param>
        /// <param name="rubro">Objeto que contiene los datos del rubro de una cuota.</param>
        /// <param name="monto">Monto con el cual se genera el monetario.</param>
        /// <param name="coperacion">Codigo de operacion de cartera.</param>
        /// <param name="cmoneda">Codigo de moneda de la operacion de cartera.</param>
        public static void AdicionarRubro(RqMantenimiento rqmantenimiento, int crubro, string codigocontable, tcaroperacionrubro rubro,
            decimal monto, string coperacion, string cmoneda)
        {
            RqRubro rqrubro = RubroHelper.AdicionarRubro(rqmantenimiento, crubro, codigocontable, monto, coperacion, cmoneda, null);
            rqrubro.Cuota = (int)rubro.numcuota;

        }

        /// <summary>
        /// Adiciona rubros al request monetario.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion monetaria.</param>
        /// <param name="crubro">Codigo de rubro con el que se ejecuta la transaccion monetaria.</param>
        /// <param name="codigocontable">Codigo de contable del rubro.</param>
        /// <param name="monto">Monto con el cual se genera el monetario.</param>
        /// <param name="coperacion">Codigo de operacion de cartera.</param>
        /// <param name="cmoneda">Codigo de moneda de la operacion de cartera.</param>
        /// <param name="cestatus">Codigo de estatus.</param>
        /// <returns></returns>
        public static RqRubro AdicionarRubro(RqMantenimiento rqmantenimiento, int crubro, string codigocontable, decimal monto,
            string coperacion, string cmoneda, string cestatus)
        {
            RqRubro rqrubro = RubroHelper.AdicionarRubro(rqmantenimiento, crubro, monto, coperacion, cmoneda, cestatus);
            rqrubro.Codigocontable = codigocontable;
            return rqrubro;
        }

        /// <summary>
        /// Adiciona rubros al request monetario.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion monetaria.</param>
        /// <param name="crubro">Codigo de rubro con el que se ejecuta la transaccion monetaria.</param>
        /// <param name="monto">Monto con el cual se genera el monetario.</param>
        /// <param name="coperacion">Codigo de operacion de cartera.</param>
        /// <param name="cmoneda">Codigo de moneda de la operacion de cartera.</param>
        /// <param name="cestatus">Codigo de estatus.</param>
        /// <returns>RqRubro</returns>
        public static RqRubro AdicionarRubro(RqMantenimiento rqmantenimiento, int crubro, decimal monto, string coperacion,
            string cmoneda, string cestatus)
        {
            RqRubro rqrubro = new RqRubro(crubro, monto, cmoneda);
            rqrubro.Coperacion = coperacion;
            rqrubro.Multiple = true;
            rqrubro.Actualizasaldo = false;
            if (cestatus != null) {
                rqrubro.Cestatus = cestatus;
            }
            rqmantenimiento.AdicionarRubro(rqrubro);
            return rqrubro;
        }

    }
}
