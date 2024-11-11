using cartera.comp.consulta.saldos;
using cartera.datos;
using cartera.enums;
using core;
using core.componente;
using dal.cartera;
using dal.monetario;
using modelo;
using System;
using System.Collections.Generic;
using System.Runtime.Remoting;
using util;
using util.dto;
using util.dto.consulta;

namespace cartera.comp.consulta.pagos {

    /// <summary>
    /// Clase que se encarga de consultar los saldos vencidos de cuotas que ya llegaron a una fecha de vencimiento.
    /// </summary>
    public class PagosOperacion : ComponenteConsulta {

        public override void Ejecutar(RqConsulta rqconsulta)
        {
            List<Dictionary<string, object>> lresp = new List<Dictionary<string, object>>();

            Response resp = rqconsulta.Response;
            string coperacion = (string)rqconsulta.GetDatos("coperacion");
            string mensaje = (string)rqconsulta.GetDatos("mensaje");

            List <tcaroperaciontransaccionrubro> rubros = TcarOperacionTransaccionRubroDal.FindRubrosPorOperacion(coperacion, mensaje);
            List<tcaroperaciontransaccioncxp> cxp = TcarOperacionTransaccionCxPDal.FindPagosPorOperacion(coperacion, mensaje);

            
            
            foreach (tcaroperaciontransaccionrubro rubro in rubros)
            {
                Dictionary<string, object> pagos = new Dictionary<string, object>();
                pagos["mensaje"] = rubro.mensaje;
                pagos["coperacion"] = rubro.coperacion;
                pagos["csaldo"] = rubro.csaldo;
                pagos["particion"] = rubro.particion;
                pagos["fcontable"] = rubro.fcontable;
                pagos["ftrabajo"] = rubro.ftrabajo;
                pagos["ctransaccion"] = rubro.ctransaccion;
                pagos["cmodulo"] = rubro.cmodulo;
                pagos["monto"] = rubro.monto;
                pagos["nombre"] = TmonSaldoDal.Find(rubro.csaldo).nombre;
                lresp.Add(pagos);
            }

            foreach (tcaroperaciontransaccioncxp pagocxp in cxp)
            {
                Dictionary<string, object> pagos = new Dictionary<string, object>();
                pagos["mensaje"] = pagocxp.mensaje;
                pagos["coperacion"] = pagocxp.coperacion;
                pagos["nombre"] = "CUENTAS POR PAGAR";
                pagos["particion"] = pagocxp.particion;
                pagos["fcontable"] = pagocxp.fcontable;
                pagos["ftrabajo"] = pagocxp.ftrabajo;
                pagos["ctransaccion"] = pagocxp.ctransaccion;
                pagos["cmodulo"] = pagocxp.cmodulo;
                pagos["monto"] = pagocxp.monto;
                pagos["csaldo"] = EnumSaldos.CUENTAXPAGAR;
                lresp.Add(pagos);
            }
            rqconsulta.Response.Add("CONSULTAPAGOSOPERACIONCARTERA", lresp);
        }
    }
}
