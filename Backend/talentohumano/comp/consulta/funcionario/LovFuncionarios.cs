using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using core.componente;
using util.dto.consulta;
using util.dto;
using modelo.servicios;
using util.servicios.ef;

namespace talentohumano.comp.consulta.funcionario
{
    /// <summary>
    /// Entrega una lista de funcionarios de la aplicacion.
    /// </summary>
    /// <author>jcuenca</author>

    class LovFuncionarios : ComponenteConsulta
    {
        private Dictionary<string, object> mparametros = new Dictionary<string, object>();

        /// <summary>
        /// Map con el orden campos a aplicar a la consulta
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            DtoConsulta dtoconsulta = rqconsulta.Mconsulta["LOVFUNCIONARIOS"];
            List<DtoDatos> ldatos = new List<DtoDatos>();
            IList<Dictionary<string, object>> lresp = this.Consultar(dtoconsulta);
            foreach (Dictionary<string, object> item in lresp)
            {
                DtoDatos d = new DtoDatos();
                d.AddDatos("cpersona", long.Parse(item["cfuncionario"].ToString()));
                d.AddDatos("identificacion", item["identificacion"].ToString());
                d.AddDatos("npersona", item["nombre"].ToString());
                d.AddDatos("ncargo", item["cargo"].ToString());
                ldatos.Add(d);
            }
            rqconsulta.Response["LOVFUNCIONARIOS"] = ldatos;
            

        }
        /// <summary>
        /// Consulta datos de usuario.
        /// </summary>
        /// <param name="dtoconsulta">Objeto que contien los datos necearios para armar y ejecutar una busqueda.</param>
        private IList<Dictionary<string, object>> Consultar(DtoConsulta dtoconsulta)
        {
            ConsultaHelper ch = new ConsultaHelper(Sessionef.GetAtlasContexto(), mparametros, this.getSentencia(dtoconsulta));
            ch.pagina = dtoconsulta.Pagina;
            ch.registrosporpagina = dtoconsulta.Registrospagina;
            IList<Dictionary<string, object>> ldatos = ch.GetRegistrosDictionary();
            return ldatos;
        }
        /// <summary>
        /// Sentencia que permite buscar funcionarios.
        /// </summary>
        private static String JPQL = "select ttf.cfuncionario, CONCAT(ttf.primernombre,' ',ttf.segundonombre,' ',ttf.primerapellido,' ',ttf.segundoapellido) as nnombre, ttf.identificacion,ttc.nombrecargo as ncargo from ttalfuncionario ttf ,ttalcargo ttc "
        + "where ttc.ccargo=ttf.ccargo and ttf.verreg = 0";

        /// <summary>
        /// Entrega la sentencia que incluye los parametros que llegan desde la pantalla.
        /// </summary>
        private String getSentencia(DtoConsulta dtoconsulta)
        {
            String condiciones = "";
            List<Filtro> lfiltro = dtoconsulta.Lfiltros;
            foreach (Filtro filtro in lfiltro)
            {
                String condicion = filtro.Condicion == null ? "like" : filtro.Condicion;
                if (filtro.Campo.Equals("cfuncionario"))
                {
                    condicion = "=";
                }
                if (filtro.Campo.Equals("nombre"))
                {
                    this.mparametros[filtro.Campo] = "%" + filtro.Valor + "%";
                    condicion = "like";
                    condiciones = condiciones + " and " + filtro.Campo + " " + condicion + " @" + filtro.Campo;
                }
                else
                {
                    this.mparametros[filtro.Campo] = "%" + filtro.Valor + "%";
                    condicion = "like";
                    condiciones = condiciones + " and " + filtro.Campo + " " + condicion + " @" + filtro.Campo;
                }
            }
            return JPQL + condiciones; //+ " order by pd.nombre ";
        }



    }

}
