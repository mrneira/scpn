using core.componente;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.consulta;
using modelo;
using util.dto;
using modelo.servicios;
using util.servicios.ef;
using util;

namespace general.comp.consulta {
    public class ParametrosSeguridad : ComponenteConsulta {
        private Dictionary<string, object> mparametros = new Dictionary<string, object>();
        public override void Ejecutar(RqConsulta rqconsulta) {
            DtoConsulta dtoconsulta = rqconsulta.Mconsulta["PARAMETROSSEGURIDAD"];
            List<DtoDatos> ldatos = new List<DtoDatos>();
            IList<Dictionary<string, object>> lresp = this.Consultar(dtoconsulta);
            foreach (Dictionary<string, object> item in lresp) {
                DtoDatos d = new DtoDatos();
                d.AddDatos("codigo", item["codigo"].ToString());
                d.AddDatos("ccompania", int.Parse(item["ccompania"].ToString()));
                d.AddDatos("texto", EncriptarParametros.Desencriptar(item["texto"].ToString()));
                d.AddDatos("numero", item["numero"] == null ? 0 : decimal.Parse(item["numero"].ToString()));
                d.AddDatos("optlock", int.Parse(item["optlock"].ToString()));
                d.AddDatos("nombre", item["nombre"].ToString());
                ldatos.Add(d);
            }
            rqconsulta.Response["PARAMETROSSEGURIDAD"] = ldatos;
        }

        private IList<Dictionary<string, object>> Consultar(DtoConsulta dtoconsulta) {
            ConsultaHelper ch = new ConsultaHelper(Sessionef.GetAtlasContexto(), mparametros, this.getSentencia(dtoconsulta));
            ch.pagina = dtoconsulta.Pagina;
            ch.registrosporpagina = dtoconsulta.Registrospagina;
            IList<Dictionary<string, object>> ldatos = ch.GetRegistrosDictionary();
            return ldatos;
        }

        /// <summary>
        /// Sentencia que permite buscar parametros.
        /// </summary>
        private static String JPQL = "SELECT * FROM tgenparametrosseguridad t ";

        /// <summary>
        /// Entrega la sentencia que incluye los parametrs que llegan desde la pantalla.
        /// </summary>
        private String getSentencia(DtoConsulta dtoconsulta) {
            String condiciones = " where ";
            List<Filtro> lfiltro = dtoconsulta.Lfiltros;
            foreach (Filtro filtro in lfiltro) {
                String condicion = filtro.Condicion == null ? "like" : filtro.Condicion;
                if (filtro.Campo.Equals("ccompania")) {
                    this.mparametros[filtro.Campo] = filtro.Valor;
                    condicion = "=";
                    condiciones = condiciones + filtro.Campo + " " + condicion + " @" + filtro.Campo;
                } else {
                    this.mparametros[filtro.Campo] = "%" + filtro.Valor + "%";
                    condicion = "like";
                    condiciones = condiciones + " and " + filtro.Campo + " " + condicion + " @" + filtro.Campo;
                }

            }
            return JPQL + condiciones + " order by t.nombre ";
        }
    }
}
