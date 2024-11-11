using cartera.enums;
using core.componente;
using dal.cartera;
using dal.generales;
using dal.monetario;
using modelo;
using System.Collections.Generic;
using util.dto;
using util.dto.consulta;

namespace cartera.comp.consulta.transaccion {

    /// <summary>
    /// Clase que se encarga de consultar el detalle de la transaccion por operacion
    /// </summary>
    class OperacionTransaccion : ComponenteConsulta {

        public override void Ejecutar(RqConsulta rqconsulta)
        {
            List<Dictionary<string, object>> lresp = new List<Dictionary<string, object>>();

            Response resp = rqconsulta.Response;
            string coperacion = (string)rqconsulta.GetDatos("coperacion");
            string mensaje = (string)rqconsulta.GetDatos("mensaje");

            List<tcaroperaciondesembolso> ldesembolso = TcarOperacionDesembolsoDal.Find(coperacion, mensaje);
            List<tcaroperaciontransaccionrubro> lrubros = TcarOperacionTransaccionRubroDal.FindRubrosPorOperacion(coperacion, mensaje);
            List<tcaroperaciontransaccioncxp> lcxp = TcarOperacionTransaccionCxPDal.FindPagosPorOperacion(coperacion, mensaje);
            List<tcaroperaciontransaccioncxc> lcxc = TcarOperacionTransaccionCxCDal.FindRubrosPorOperacion(coperacion, mensaje);

            foreach (tcaroperaciondesembolso des in ldesembolso) {
                Dictionary<string, object> mresponse = DesembolsoToMap(des);
                lresp.Add(mresponse);
            }

            foreach (tcaroperaciontransaccionrubro rub in lrubros) {
                Dictionary<string, object> mresponse = RubrosToMap(rub);
                lresp.Add(mresponse);
            }

            foreach (tcaroperaciontransaccioncxp cxp in lcxp) {
                Dictionary<string, object> mresponse = CuentaPorPagarToMap(cxp);
                lresp.Add(mresponse);
            }

            foreach (tcaroperaciontransaccioncxc cxc in lcxc) {
                Dictionary<string, object> mresponse = CuentaPorCobrarToMap(cxc);
                lresp.Add(mresponse);
            }

            rqconsulta.Response.Add("TRANSACCIONES", lresp);
        }

        /// <summary>
        /// Crea un map con los datos de un movimiento de desembolso de cartera.
        /// </summary>
        public static Dictionary<string, object> DesembolsoToMap(tcaroperaciondesembolso movimiento)
        {
            Dictionary<string, object> m = new Dictionary<string, object>();
            m["coperacion"] = movimiento.coperacion;
            m["secuencia"] = movimiento.secuencia;
            if (movimiento.tipo != null && movimiento.tipo == "T") {
                m["nsaldo"] = "TRANSFERENCIA";
            } else {
                m["nsaldo"] = "OTROS";
            }

            m["monto"] = movimiento.valor;
            m["csaldo"] = movimiento.csaldo;

            if (movimiento.tipocuentaccatalogo != null) {
                m["ndetalle"] = TmonSaldoDal.Find(movimiento.csaldo).nombre + ": " + TgenCatalogoDetalleDal.Find((int)movimiento.tipocuentaccatalogo, movimiento.tipocuentacdetalle).nombre + "; " + TgenCatalogoDetalleDal.Find((int)movimiento.tipoinstitucionccatalogo, movimiento.tipoinstitucioncdetalle).nombre + " :" + movimiento.numerocuentabancaria;

            } else {
                m["ndetalle"] = TmonSaldoDal.Find(movimiento.csaldo).nombre;

            }

            return m;
        }


        /// <summary>
        /// Crea un map con los datos de un movimiento de cartera.
        /// </summary>
        public static Dictionary<string, object> RubrosToMap(tcaroperaciontransaccionrubro rubro)
        {
            Dictionary<string, object> m = new Dictionary<string, object>();
            m["coperacion"] = rubro.coperacion;
            m["csaldo"] = rubro.csaldo;
            m["particion"] = rubro.particion;
            m["fcontable"] = rubro.fcontable;
            m["ftrabajo"] = rubro.ftrabajo;
            m["ctransaccion"] = rubro.ctransaccion;
            m["cmodulo"] = rubro.cmodulo;
            m["monto"] = rubro.monto;
            m["nsaldo"] = TmonSaldoDal.Find(rubro.csaldo).nombre;

            return m;
        }

        /// <summary>
        /// Crea un map con los datos de un movimiento de cartera de cuenta por pagar.
        /// </summary>
        public static Dictionary<string, object> CuentaPorPagarToMap(tcaroperaciontransaccioncxp cxp)
        {
            Dictionary<string, object> m = new Dictionary<string, object>();
            m["mensaje"] = cxp.mensaje;
            m["coperacion"] = cxp.coperacion;
            m["nsaldo"] = "CUENTAS POR PAGAR";
            m["particion"] = cxp.particion;
            m["fcontable"] = cxp.fcontable;
            m["ftrabajo"] = cxp.ftrabajo;
            m["ctransaccion"] = cxp.ctransaccion;
            m["cmodulo"] = cxp.cmodulo;
            m["monto"] = cxp.monto;
            m["csaldo"] = EnumSaldos.CUENTAXPAGAR.GetCsaldo();

            return m;
        }

        /// <summary>
        /// Crea un map con los datos de un movimiento de cartera de cuenta por cobrar.
        /// </summary>
        public static Dictionary<string, object> CuentaPorCobrarToMap(tcaroperaciontransaccioncxc cxc)
        {
            Dictionary<string, object> m = new Dictionary<string, object>();
            m["mensaje"] = cxc.mensaje;
            m["coperacion"] = cxc.coperacion;
            m["nsaldo"] = TmonSaldoDal.Find(cxc.csaldo).nombre;
            m["particion"] = cxc.particion;
            m["fcontable"] = cxc.fcontable;
            m["ftrabajo"] = cxc.ftrabajo;
            m["ctransaccion"] = cxc.ctransaccion;
            m["cmodulo"] = cxc.cmodulo;
            m["monto"] = cxc.monto;
            m["csaldo"] = cxc.csaldo;
            m["ndetalle"] = "CUOTA: " + cxc.numcuota;

            return m;
        }
    }
}
