using canalesdigitales.models;
using dal.canalesdigitales;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using util;

namespace canalesdigitales.helper {
    internal class WSEQUIFAXHelper {

        WSEQUIFAX.wsReporte360CovidCompleto equifax = new WSEQUIFAX.wsReporte360CovidCompleto();

        /// <summary>
        /// Método que busca los créditos por cédula del WS de EQUIFAX (buró)
        /// </summary>
        /// <param name="numeroCedula"></param>
        /// <returns></returns>
        public EquifaxModel BuscarBuroPorCedula(string numeroCedula) {
            try {
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                equifax.CabeceraCRValue = new WSEQUIFAX.CabeceraCR();

                equifax.CabeceraCRValue.Usuario = TcanParametroDal.GetValueString("EQUIFAX-USUARIO");
                equifax.CabeceraCRValue.Clave = TcanParametroDal.GetValueString("EQUIFAX-CLAVE");

                var abc = equifax.ObtenerReporte360("C", numeroCedula, out int codigo, out string mensaje);
                var row = abc.Tables["Cuota estimada Mensual Web1"].Rows[0];

                EquifaxModel equifaxModel = new EquifaxModel() {
                    identificacion = numeroCedula,
                    cuota = Convert.ToDecimal(row[0]),
                    codigoconsulta = codigo,
                    mensaje = mensaje
                };

                return equifaxModel;
            } catch (Exception ex) {
                throw new AtlasException("CAN-043", $"ERROR DE COMUNICACIÓN CON EQUIFAX: {numeroCedula} | {ex.Message}", "SERVICIO NO DISPONIBLE");
            }
        }

    }
}
