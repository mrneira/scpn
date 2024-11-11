using core.componente;
using modelo.servicios;
using System;
using System.Collections.Generic;
using util.dto;
using util.dto.consulta;
using util.servicios.ef;

namespace bancaenlinea.comp.consulta.usuario {

    /// <summary>
    /// Entrega una lista de usuarios de la banca en linea.
    /// </summary>
    /// <author>amerchan</author>
    public class LovUsuarios : ComponenteConsulta {

        private Dictionary<string, object> mparametros = new Dictionary<string, object>();

        /// <summary>
        /// Map con el orden campos a aplicar a la consulta
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta) {
            DtoConsulta dtoconsulta = rqconsulta.Mconsulta["LOVUSUARIOSBAN"];
            List<DtoDatos> ldatos = new List<DtoDatos>();
            IList<Dictionary<string, object>> lresp = this.Consultar(dtoconsulta);
            foreach (Dictionary<string, object> item in lresp) {
                DtoDatos d = new DtoDatos();
                d.AddDatos("cpersona", long.Parse(item["cpersona"].ToString()));
                d.AddDatos("npersona", item["nombre"].ToString());
                d.AddDatos("identificacion", item["identificacion"].ToString());
                d.AddDatos("cusuario", item["cusuario"].ToString());
                ldatos.Add(d);
            }
            rqconsulta.Response["LOVUSUARIOSBAN"] = ldatos;
        }

        /// <summary>
        /// Consulta datos de usuario.
        /// </summary>
        /// <param name="dtoconsulta">Objeto que contien los datos necearios para armar y ejecutar una busqueda.</param>
        private IList<Dictionary<string, object>> Consultar(DtoConsulta dtoconsulta) {
            ConsultaHelper ch = new ConsultaHelper(Sessionef.GetAtlasContexto(), mparametros, this.getSentencia(dtoconsulta));
            ch.pagina = dtoconsulta.Pagina;
            ch.registrosporpagina = dtoconsulta.Registrospagina;
            IList<Dictionary<string, object>> ldatos = ch.GetRegistrosDictionary();
            return ldatos;
	    }

        /// <summary>
        /// Sentencia que permite buscar usuarios.
        /// </summary>
        private static String JPQL = "select pd.cpersona, pd.nombre, pd.identificacion, tu.cusuario from tperpersonadetalle pd, tbanusuarios tu "
        + "where pd.cpersona = tu.cpersona and pd.verreg = 0 and tu.verreg = 0";

        /// <summary>
        /// Entrega la sentencia que incluye los parametrs que llegan desde la pantalla.
        /// </summary>
        private String getSentencia(DtoConsulta dtoconsulta) {
            String condiciones = "";
            List<Filtro> lfiltro = dtoconsulta.Lfiltros;
            foreach (Filtro filtro in lfiltro) {
                String condicion = filtro.Condicion == null ? "like" : filtro.Condicion;
                if (filtro.Campo.Equals("cpersona")) {
                    condicion = "=";
                }
                if (filtro.Campo.Equals("nombre")) {
                    this.mparametros[filtro.Campo] = "%" + filtro.Valor + "%";
                    condicion = "like";
                    condiciones = condiciones + " and " + filtro.Campo + " " + condicion + " @" + filtro.Campo;
                } else {
                    this.mparametros[filtro.Campo] = "%" + filtro.Valor + "%";
                    condicion = "like";
                    condiciones = condiciones + " and " + filtro.Campo + " " + condicion + " @" + filtro.Campo;
                }
            }
            return JPQL + condiciones + " order by pd.nombre ";
        }


    }
}
