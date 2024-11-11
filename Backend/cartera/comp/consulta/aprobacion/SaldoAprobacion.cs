using cartera.enums;
using cartera.saldo;
using core.componente;
using dal.cartera;
using dal.persona;
using modelo;
using System.Collections.Generic;
using util;
using util.dto;
using util.dto.consulta;

namespace cartera.comp.consulta.aprobacion {

    /// <summary>
    ///  Clase que se encarga de consultar monto a desembolsar.
    /// </summary>
    public class SaldoAprobacion : ComponenteConsulta {

        /// <summary>
        /// Consulta monto a desembolsar y desembolsos definidos en caja y credito a cuentas.
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            Response resp = rqconsulta.Response;
            long csolicitud = (long)rqconsulta.GetLong("csolicitud");

            tcarsolicitud solicitud = TcarSolicitudDal.Find(csolicitud);
            if (solicitud.cestatussolicitud.CompareTo(EnumEstatus.PRE_APROBADA.Cestatus) != 0) {
                throw new AtlasException("CAR-0012", "OPERACION TIENE QUE ESTAR EN ESTATUS APROBADO PARA EJECUTAR EL DESEMBOLSO");
            }

            List<Dictionary<string, object>> lsaldo = new List<Dictionary<string, object>>();
            Dictionary<string, object> msaldo = new Dictionary<string, object>();
            SaldoDesembolso desembolso = new SaldoDesembolso(solicitud, rqconsulta.Fconatable);
            msaldo["monto"] = desembolso.MontoOriginal;
            msaldo["descuento"] = desembolso.Descuento;
            msaldo["gastosFinanciados"] = desembolso.Financiado;
            msaldo["montoanticipo"] = desembolso.Anticipo;
            msaldo["montoabsorcion"] = desembolso.Absorcion;
            msaldo["montoreincorporado"] = desembolso.Reincorporado;
            msaldo["montodesembolsar"] = desembolso.MontoDesembolsar;
            lsaldo.Add(msaldo);
            resp["SALDOAPROBACION"] = lsaldo;
            tcarproducto pr = TcarProductoDal.Find(solicitud.cmodulo.Value, solicitud.cproducto.Value, solicitud.ctipoproducto.Value);
            resp["consolidado"] = pr.consolidado;

            // Adiciona referencia bancaria al request de consulta
            this.ConsultaReferenciaBancaria(rqconsulta, resp, solicitud);
        }

        /// <summary>
        /// Consulta los datos de referencia bancaria.
        /// </summary>
        /// <param name="rq">Request de consulta con el que se ejecuta la transaccion.</param>
        /// <param name="resp">response de transaccion.</param>
        /// <param name="solicitud">Instancia de tcarsolicitud.</param>
        private void ConsultaReferenciaBancaria(RqConsulta rq, Response resp, tcarsolicitud solicitud)
        {
            tperreferenciabancaria rban = TperReferenciaBancariaDal.FindReferencia((long)solicitud.cpersona, (int)solicitud.ccompania);
            if (rban == null) {
                return;
            }
            IList<tperreferenciabancaria> lrbancaria = new List<tperreferenciabancaria>();
            lrbancaria.Add(rban);
            resp["REFERENCIABANCARIA"] = lrbancaria;
        }
    }
}
