using cartera.datos;
using core.componente;
using dal.cartera;
using dal.generales;
using dal.persona;
using modelo;
using System.Collections.Generic;
using util.dto;
using util.dto.consulta;

namespace cartera.comp.consulta.operacion {

    /// <summary>
    /// Clase que se encarga de consultar las operaciones asociadas a un garante
    /// </summary>
    public class OperacionesGarante : ComponenteConsulta {
        /// <summary>
        /// Consulta de operaciones
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            Response resp = rqconsulta.Response;
            List<tcaroperacion> lresp = new List<tcaroperacion>();

            long cgarante = long.Parse(rqconsulta.Mdatos["cpersona"].ToString());
            IList<Dictionary<string, object>> loperacion = TcarOperacionPersonaDal.FindGaranteOnSolicitudes(cgarante, rqconsulta.Ccompania);

            foreach (Dictionary<string, object> obj in loperacion) {
                string coperacion = obj["coperacion"].ToString();
                Operacion operacion = OperacionFachada.GetOperacion(coperacion, true);
                tcaroperacion op = operacion.tcaroperacion;
                tperpersonadetalle per = TperPersonaDetalleDal.Find((long)op.cpersona, (int)op.ccompania);
                op.AddDatos("identificacion", per.identificacion);
                op.AddDatos("nombre", per.nombre);
                op.AddDatos("nproducto", TgenProductoDal.Find((int)op.cmodulo, (int)op.cproducto).nombre);
                op.AddDatos("ntipoproducto", TgenTipoProductoDal.Find((int)op.cmodulo, (int)op.cproducto, (int)op.ctipoproducto).nombre);
                op.AddDatos("nestatus", TcarEstatusDal.Find(op.cestatus).nombre);
                lresp.Add(op);
            }

            resp["OPERACIONESGARANTE"] = lresp;
        }

    }
}
