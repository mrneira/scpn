using dal.monetario;
using garantias.contabilidad;
using modelo;
using monetario.util;
using monetario.util.rubro;
using System;
using util.dto.mantenimiento;

namespace garantias.monetario {

    /// <summary>
    /// Clase utilitaria utilizada utilizada en la creacion de rubros monetarios utilizados en garantias.
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
        public static void AdicionarRubro(RqMantenimiento rqmantenimiento, tgaroperacion tgaroperacion, TransaccionRubro trubro, int rubro,
            Decimal monto) {
            tmonrubro tmonrubro = trubro.GetRubro(1);
            // adiciona rubros al request de mantenimiento.
            RqRubro rqrubro = RubroHelper.Adicionarrubro(rqmantenimiento, 1, monto, tgaroperacion.coperacion, tgaroperacion.cmoneda, null);
            String codigocontable = TmonSaldoDal.Find(tmonrubro.csaldo).codigocontable;
            Perfiles p = new Perfiles(tgaroperacion);

            rqrubro.Codigocontable = p.RemplazaCodigoContable(codigocontable);
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
        public static RqRubro Adicionarrubro(RqMantenimiento rqmantenimiento, int crubro, Decimal monto, String coperacion,
            String cmoneda, String cestatus) {
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
