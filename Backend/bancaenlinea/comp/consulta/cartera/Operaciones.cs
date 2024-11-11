using core.componente;
using dal.cartera;
using dal.generales;
using modelo;
using System.Collections.Generic;
using util.dto;
using util.dto.consulta;

namespace bancaenlinea.comp.consulta.cartera {

    /// <summary>
    ///  Clase que se encarga de consultar las operaciones por cliente.
    /// </summary>
    public class Operaciones : ComponenteConsulta {

        /// <summary>
        /// Consulta datos de operaciones por cliente.
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            Response resp = rqconsulta.Response;
            long cpersona = (long)rqconsulta.Mdatos["cpersona"];


            int cproducto = rqconsulta.Mdatos.ContainsKey("cproducto") ? int.Parse(rqconsulta.Mdatos["cproducto"].ToString()) : 0;
            int ctipoproducto = rqconsulta.Mdatos.ContainsKey("ctipoproducto") ? int.Parse(rqconsulta.Mdatos["ctipoproducto"].ToString()) : 0;
            string cestatus = rqconsulta.Mdatos.ContainsKey("cestatus") ? (string)rqconsulta.Mdatos["cestatus"] : null;

            IList<tcaroperacion> loperacionxpersona = TcarOperacionDal.FindPorPersona(cpersona, cproducto, ctipoproducto, cestatus);
            List<Dictionary<string, object>> loperaciones = new List<Dictionary<string, object>>();
            foreach (tcaroperacion op in loperacionxpersona) {
                Dictionary<string, object> mdatos = new Dictionary<string, object> {
                    ["coperacion"] = op.coperacion,
                    ["nproducto"] = TgenProductoDal.Find((int)op.cmodulo, (int)op.cproducto).nombre,
                    ["ntipoproducto"] = TgenTipoProductoDal.Find((int)op.cmodulo, (int)op.cproducto, (int)op.ctipoproducto).nombre,
                    ["nestatus"] = TcarEstatusDal.Find(op.cestatus).nombre,
                    ["monto"] = op.montooriginal
                };
                loperaciones.Add(mdatos);
            }

            resp["LISTAOPERACIONES"] = loperaciones;
        }
    }
}
