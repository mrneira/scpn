using core.componente;
using modelo.servicios;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto;
using util.dto.consulta;
using util.servicios.ef;

namespace seguridad.comp.consulta.usuario {

    /// <summary>
    /// Entrega una lista de usuarios de la aplicacion.
    /// </summary>
    /// <author>amerchan</author>
    public class LovUsuarios :ComponenteConsulta {

        private Dictionary<string, object> mparametros = new Dictionary<string, object>();

        /// <summary>
        /// Map con el orden campos a aplicar a la consulta
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta) {
            DtoConsulta dtoconsulta = rqconsulta.Mconsulta["LOVUSUARIOS"];
            List<DtoDatos> ldatos = new List<DtoDatos>();
            IList<Dictionary<string, object>> lresp = this.Consultar(dtoconsulta);
            foreach(Dictionary<string, object> item in lresp) {
                DtoDatos d = new DtoDatos();
                d.AddDatos("cpersona", long.Parse(item["cpersona"].ToString()));
                d.AddDatos("npersona", item["nombre"].ToString());
                d.AddDatos("identificacion", item["identificacion"].ToString());
                d.AddDatos("cusuario", item["cusuario"].ToString());
                d.AddDatos("password", item["password"].ToString());
                d.AddDatos("ncatalogo", item["ncatalogo"].ToString());
                ldatos.Add(d);
            }
            rqconsulta.Response["LOVUSUARIOS"] = ldatos;
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
        private static String JPQL = "select pd.cpersona, pd.nombre, pd.identificacion, tu.cusuario, tu.password, ca.nombre as ncatalogo from tperpersonadetalle pd, tsegusuariodetalle tu , tgencatalogodetalle ca "
        + "where pd.cpersona = tu.cpersona and pd.verreg = 0 and tu.verreg = 0 and tu.estatuscusuariocatalogo = ca.ccatalogo and tu.estatuscusuariocdetalle = ca.cdetalle";

        /// <summary>
        /// Entrega la sentencia que incluye los parametrs que llegan desde la pantalla.
        /// </summary>
        private String getSentencia(DtoConsulta dtoconsulta) {
            String condiciones = "";
            List<Filtro> lfiltro = dtoconsulta.Lfiltros;
            List<FiltroEspecial> lfiltroesp = dtoconsulta.Lfiltroesp;
            foreach(Filtro filtro in lfiltro) {
                String condicion = filtro.Condicion == null ? "like" : filtro.Condicion;
                if(filtro.Campo.Equals("cpersona")) {
                    condicion = "=";
                }
                if(filtro.Campo.Equals("nombre")) {
                    this.mparametros[filtro.Campo] = "%" + filtro.Valor + "%";
                    condicion = "like";
                    condiciones = condiciones + " and " + filtro.Campo + " " + condicion + " @" + filtro.Campo;
                } else {
                    this.mparametros[filtro.Campo] = "%" + filtro.Valor + "%";
                    condicion = "like";
                    condiciones = condiciones + " and " + filtro.Campo + " " + condicion + " @" + filtro.Campo;
                }
            }

            foreach(FiltroEspecial filtro in lfiltroesp) {
                String condicion = filtro.Condicion == null ? "like" : filtro.Condicion;
                if(filtro.Campo.Equals("estatuscusuariocdetalle")) {
                    condiciones = condiciones + " and " + filtro.Campo + " " + condicion;
                }
            }
            return JPQL + condiciones + " order by pd.nombre ";
        }


    }
}
