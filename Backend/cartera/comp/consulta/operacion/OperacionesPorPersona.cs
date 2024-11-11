using cartera.datos;
using cartera.enums;
using cartera.saldo;
using core.componente;
using dal.cartera;
using dal.generales;
using dal.persona;
using modelo;
using System.Collections.Generic;
using System.Linq;
using util.dto;
using util.dto.consulta;

namespace cartera.comp.consulta.operacion {

    /// <summary>
    /// Clase que se encarga de consultar datos basicos de operaciones por persona
    /// </summary>
    public class OperacionesPorPersona : ComponenteConsulta {
        /// <summary>
        /// Consulta de operaciones
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            Response resp = rqconsulta.Response;
            long cpersona = long.Parse(rqconsulta.Mdatos["cpersona"].ToString());
            List<tcaroperacion> loperaciones = TcarOperacionDal.FindPorPersona(cpersona, true).Cast<tcaroperacion>().ToList();

            List<tcaroperacion> lresp = new List<tcaroperacion>();
            string coperacion = null;
            if (rqconsulta.Mdatos.ContainsKey("coperacion")) {
                coperacion = rqconsulta.GetString("coperacion");
            }

            foreach (tcaroperacion op in loperaciones) {
                if (coperacion != null && coperacion.Equals(op.coperacion)) {
                    continue;
                }
                if (op.cestatus.Equals(EnumEstatus.APROVADA.Cestatus)) {
                    continue;
                }

                Operacion operacion = OperacionFachada.GetOperacion(op.coperacion, true);
                Saldo saldo = new Saldo(operacion, rqconsulta.Fconatable);
                tcaroperacioncalificacion cal = TcarOperacionCalificacionDal.FindFromDatabase(operacion.tcaroperacion);
                saldo.Calculacuotaencurso();

                op.AddDatos("nproducto", TgenProductoDal.Find((int)op.cmodulo, (int)op.cproducto).nombre);
                op.AddDatos("ntipoproducto", TgenTipoProductoDal.Find((int)op.cmodulo, (int)op.cproducto, (int)op.ctipoproducto).nombre);
                op.AddDatos("nestatus", TcarEstatusDal.Find(op.cestatus).nombre);
                op.AddDatos("montoporaportaciones", TcarProductoDal.Find((int)op.cmodulo, (int)op.cproducto, (int)op.ctipoproducto).montoporaportaciones);
                op.AddDatos("ccalificacion", (cal != null) ? cal.ccalificacion : "");
                op.AddDatos("ncalificacion", (cal != null) ? TgenCalificacionDal.Find(cal.ccalificacion).nombre : "");
                op.AddDatos("pagar", false);
                op.AddDatos("saldo", saldo.Totalpendientepago + saldo.GetSaldoCuotasfuturas() - saldo.Cxp);
                op.AddDatos("valorcuotaencurso", saldo.Cuotaencurso == null ? op.valorcuota : saldo.GetValorCuota(saldo.Cuotaencurso));
                lresp.Add(op);
            }

            resp["OPERACIONESPORPERSONA"] = lresp;

            // Consulta de operaciones como garante
            if (rqconsulta.Mdatos.ContainsKey("operacionesgarante") && (bool)rqconsulta.Mdatos["operacionesgarante"]) {
                this.OperacionesGarante(resp, cpersona, rqconsulta.Ccompania, rqconsulta.Fconatable);
            }
        }


        /// <summary>
        /// Consulta operaciones como garante
        /// </summary>
        private void OperacionesGarante(Response resp, long cpersona, int ccompania, int fcontable)
        {
            List<tcaroperacion> lrespgar = new List<tcaroperacion>();
            IList<Dictionary<string, object>> loperacionesgar = TcarOperacionPersonaDal.FindGaranteOnSolicitudes(cpersona, ccompania);
            foreach (Dictionary<string, object> opegar in loperacionesgar) {
                tcaroperacion op = TcarOperacionDal.FindSinBloqueo(opegar["coperacion"].ToString());
                Operacion operacion = OperacionFachada.GetOperacion(op.coperacion, true);
                Saldo saldo = new Saldo(operacion, fcontable);
                saldo.Calculacuotaencurso();

                op.AddDatos("npersona", TperPersonaDetalleDal.Find((long)op.cpersona, (int)op.ccompania).nombre);
                op.AddDatos("nproducto", TgenProductoDal.Find((int)op.cmodulo, (int)op.cproducto).nombre);
                op.AddDatos("ntipoproducto", TgenTipoProductoDal.Find((int)op.cmodulo, (int)op.cproducto, (int)op.ctipoproducto).nombre);
                op.AddDatos("nestatus", TcarEstatusDal.Find(op.cestatus).nombre);
                op.AddDatos("pagar", false);
                op.AddDatos("saldo", saldo.Totalpendientepago + saldo.GetSaldoCuotasfuturas() - saldo.Cxp);
                op.AddDatos("valorcuotaencurso", saldo.Cuotaencurso == null ? op.valorcuota : saldo.GetValorCuota(saldo.Cuotaencurso));
                lrespgar.Add(op);
            }

            resp["OPERACIONESPORPERSONAGARANTE"] = lrespgar;
        }
    }
}
