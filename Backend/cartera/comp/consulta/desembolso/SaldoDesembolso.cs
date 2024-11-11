using cartera.enums;
using core.componente;
using core.servicios.consulta;
using dal.cartera;
using modelo;
using System.Collections.Generic;
using util;
using util.dto;
using util.dto.consulta;

namespace cartera.comp.consulta.desembolso {

    /// <summary>
    ///  Clase que se encarga de consultar monto a desembolsar.
    /// </summary>
    public class SaldoDesembolso : ComponenteConsulta {

        /// <summary>
        /// Consulta monto a desembolsar y desembolsos definidos en caja y credito a cuentas.
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            string coperacion = rqconsulta.Coperacion;
            tcaroperacion tcaroperacion = TcarOperacionDal.FindSinBloqueo(coperacion);
            if (tcaroperacion.cestatus.CompareTo(EnumEstatus.APROVADA.Cestatus) != 0) {
                throw new AtlasException("CAR-0012", "OPERACION TIENE QUE ESTAR EN ESTATUS APROBADO PARA EJECUTAR EL DESEMBOLSO");
            }
            MotorConsulta m = new MotorConsulta();
            m.Consultar(rqconsulta);
            Response resp = rqconsulta.Response;

            List<Dictionary<string, object>> lsaldo = new List<Dictionary<string, object>>();
            Dictionary<string, object> msaldo = new Dictionary<string, object>();
            saldo.SaldoDesembolso desembolso = new saldo.SaldoDesembolso(tcaroperacion, rqconsulta.Fconatable);

            msaldo["monto"] = desembolso.MontoOriginal;
            msaldo["descuento"] = desembolso.Descuento;
            msaldo["gastosFinanciados"] = desembolso.Financiado;
            msaldo["montoanticipo"] = desembolso.Anticipo;
            msaldo["montoabsorcion"] = desembolso.Absorcion;
            msaldo["montoreincorporado"] = desembolso.Reincorporado;
            msaldo["montodesembolsar"] = desembolso.MontoDesembolsar;
            lsaldo.Add(msaldo);
            resp["SALDODESEMBOLSO"] = lsaldo;
        }
    }
}
