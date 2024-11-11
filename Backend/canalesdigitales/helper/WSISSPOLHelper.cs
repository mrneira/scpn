using canalesdigitales.WSISSPOL;
using System;
using util;

namespace canalesdigitales.helper {
    internal class WSISSPOLHelper {

        ServicioCreditoISSPOL servicioCreditoISSPOL = new ServicioCreditoISSPOL();

        /// <summary>
        /// Método que busca los créditos por cédula del WS del ISSPOL
        /// </summary>
        /// <param name="numeroCedula"></param>
        /// <returns></returns>
        public CreditoDTO[] BuscarCreditosPorCedula(string numeroCedula) {
            try {
                System.Net.ServicePointManager.ServerCertificateValidationCallback += delegate { return true; };
                System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;//CCA 20231019
                BuscarCreditoPorCedulaRequest buscarCreditoPorCedulaRequest = new BuscarCreditoPorCedulaRequest();
                buscarCreditoPorCedulaRequest.NumeroCedula = numeroCedula;
                return servicioCreditoISSPOL.BuscarCreditoPorCedula(buscarCreditoPorCedulaRequest);
            } catch (Exception ex) {
                throw new AtlasException("CAN-029", "ERROR DE COMUNICACIÓN CON ISSPOL, {0}" + $" | {ex.Message}", "Servicio No Disponible");
            }
        }
    }
}
