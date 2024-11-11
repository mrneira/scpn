using core.componente;
using modelo.servicios;
using System;
using System.Collections.Generic;
using util;
using util.dto;
using util.dto.consulta;
using util.servicios.ef;

namespace canalesdigitales.comp.consulta {

    public class LovUsuariosCanales : ComponenteConsulta {

        private Dictionary<string, object> mparametros = new Dictionary<string, object>();

        public override void Ejecutar(RqConsulta rqconsulta) {

            DtoConsulta dtoconsulta = rqconsulta.Mconsulta["LOVUSUARIOSCAN"];
            List<DtoDatos> ldatos = new List<DtoDatos>();
            IList<Dictionary<string, object>> lresp = this.Consultar(dtoconsulta);
            foreach (Dictionary<string, object> item in lresp) {
                DtoDatos d = new DtoDatos();
                d.AddDatos("cpersona", long.Parse(item["cpersona"].ToString()));
                d.AddDatos("npersona", item["nombre"].ToString());
                d.AddDatos("identificacion", item["identificacion"].ToString());
                d.AddDatos("cusuario", item["cusuario"].ToString());
                d.AddDatos("credencial", item["credencial"].ToString());
                d.AddDatos("celular", item["celular"].ToString());
                d.AddDatos("email", item["email"].ToString());
                d.AddDatos("equipo", item["equipo"].ToString());
                d.AddDatos("cestado", item["estadodetalle"].ToString());
                d.AddDatos("estado", item["nestado"].ToString());
                d.AddDatos("fregistro", Fecha.GetFechaPresentacionAnioMesDia(Convert.ToInt32(item["fsistema"])));
                ldatos.Add(d);
            }
            rqconsulta.Response["LOVUSUARIOSCAN"] = ldatos;

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
        private static string JPQL = "select pd.cpersona, pd.nombre, pd.identificacion, tu.cusuario, act.credencial, pd.celular, pd.email, teq.equipo, act.fsistema, tu.estadodetalle, catdet.nombre as nestado " +
                                     "from tperpersonadetalle pd, tcanusuario tu, tcanactivacion act, tcanequipo teq, tgencatalogodetalle catdet " +
                                     "where pd.cpersona = tu.cpersona AND tu.cpersona = act.cpersona  AND tu.cusuario = teq.cusuario AND tu.cequipo = teq.cequipo " +
                                     "AND tu.estadocatalogo = catdet.ccatalogo AND tu.estadodetalle = catdet.cdetalle " +
                                     "AND pd.verreg = 0";

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
                    condiciones = condiciones + " and pd." + filtro.Campo + " " + condicion + " @" + filtro.Campo;
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
