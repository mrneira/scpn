using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

using System.Reflection;
using util;
using Newtonsoft.Json.Linq;
using util.enums;

namespace util.dto.consulta {

    /// <summary>
    /// Request de consultas.
    /// </summary>
    public class RqConsulta : Request {

        /// <summary>
        /// Numero de operacion asociada al rubro. Si el valor del atributo esta vacio se toma la cuenta que llega en el request monetario, 
        /// dependiendo de la definicion del rubro si es debito o credito.
        /// </summary>
        private string coperacion;

        public string Coperacion { get => coperacion; set => coperacion = value; }

        /// <summary>
        /// Crea una instancia de request.
        /// </summary>
        public RqConsulta() {
        }
        

        /// <summary>
        /// Completa informacion del request.
        /// </summary>
        /// <param name="mdatos"></param>
        public void CompletarRequest(Dictionary<string, Object> mdatos) {
            base.LlenarCampos(mdatos["c"]);

            if (Cmodulotranoriginal == EnumModulos.CANALES_DIGITALES.Cmodulo && Ccanal == "CAN") {
                Cusuariobancalinea = Cusuario;
                Cusuario = "BMOVIL";
            }

            if (mdatos.ContainsKey("m") && mdatos.ContainsKey("t") && mdatos["m"] != null && mdatos["t"] != null) {
                Cmodulotranoriginal = Cmodulo;
                Ctranoriginal = Ctransaccion;
                Cmodulo = (int)mdatos["m"];
                Ctransaccion = (int)mdatos["t"];
                mdatos.Remove("m");
                mdatos.Remove("t");
            }
            if (mdatos.ContainsKey("crol") && mdatos["crol"] != null) {
                Crol = Int32.Parse( mdatos["crol"].ToString());
            }
                mdatos.Remove("c");
            // copiar mdatos
            if (mdatos.ContainsKey("mdatos")) {
                JObject a = (JObject)mdatos["mdatos"];
                Dictionary<String, Object> mdatosbean = a.ToObject<Dictionary<String, Object>>();
                this.Mdatos = mdatosbean;
                mdatos.Remove("mdatos");
            }
            LlenaDtoConsulta(this, mdatos);
        }

        /// <summary>
        /// Metodo que crea y adicona objetos DtoConsulta al request.
        /// </summary>
        /// <param name="request"></param>
        /// <param name="mdatos">Metadata de consulta contiene 1..N tablas.</param>
        private void LlenaDtoConsulta(Request request, Dictionary<String, Object> mdatos) {
            Dictionary<String, DtoConsulta> mtablas = new Dictionary<String, DtoConsulta>();
            foreach (var key in mdatos.Keys) {                
                if (!(mdatos[key] is Newtonsoft.Json.Linq.JObject)) {
                    object valor = mdatos[key];
                    this.Mdatos[key] = valor;
                    continue;
                }
                JObject a = (JObject)mdatos[key];
                Dictionary<String, Object> mdatosbean = a.ToObject<Dictionary<String, Object>>();

                DtoConsulta dto = GetDtoConsulta(mdatosbean);
                mtablas[key] = dto;
            }
            request.Mconsulta = mtablas;
        }

        /// <summary>
        /// Crea y entrega un DtoConsulta por tabla.
        /// </summary>
        /// <param name="mdatosbean">Map con metadata de consulta de una tabla.</param>
        /// <returns>DtoConsulta</returns>
        private DtoConsulta GetDtoConsulta(Dictionary<String, Object> mdatosbean) {
            string nombrebean = !mdatosbean.ContainsKey("bean") ? "" : mdatosbean["bean"].ToString();
            string lista = !mdatosbean.ContainsKey("lista") ? "" : mdatosbean["lista"].ToString();

            DtoConsulta d = new DtoConsulta(nombrebean, Int32.Parse(mdatosbean["pagina"].ToString()), Int32.Parse(mdatosbean["cantidad"].ToString()), lista.Equals("Y") ? true : false);

            // Adiciona filtros o restricciones angular 2
            this.AddFiltrosDesdeArray(mdatosbean, d);
            this.AddFiltrosEspecialDesdeArray(mdatosbean, d);
            // Adiciona subqueries o restricciones angular 2
            this.AddSubqueryDesdeArray(mdatosbean, d);

            if (mdatosbean.ContainsKey("orderby") && mdatosbean["orderby"] != null && !mdatosbean["orderby"].Equals("")) {
                d.Ordenadopor = mdatosbean["orderby"].ToString();
            }
            return d;
        }

        /// <summary>
        /// Adiciona filtros al DtoConsulta.
        /// </summary>
        /// <param name="mdatosbean">Map que contiene metadata de una tabla a consultar.</param>
        /// <param name="dtoConsulta">Dto al cual se adiciona filtros.</param>
        private void AddFiltrosDesdeArray(Dictionary<String, Object> mdatosbean, DtoConsulta dtoConsulta) {
            if (!mdatosbean.ContainsKey("filtro")) {
                return;
            }
            // Newtonsoft.Json.Linq.JArray
            JArray a = (JArray)mdatosbean["filtro"];
            IList<Dictionary<string, object>> lfiltro = a.ToObject<IList<Dictionary<string, object>>>();
            foreach (Dictionary<string, object> m in lfiltro) {
                if (!m.ContainsKey("valor") || m["valor"] == null) {
                    continue;
                }
                string campo = m["campo"].ToString();
                campo = campo.Replace("_", ".");
                String valor = m["valor"].ToString();
                Filtro filtro = new Filtro(campo, valor);
                if (m.ContainsKey("condicion") && m["condicion"] != null) {
                    string cond = m["condicion"].ToString().Replace(";", "=");
                    filtro.Condicion = cond;
                }
                dtoConsulta.AddFiltro(filtro);
            }
        }

        /// <summary>
        /// Adiciona filtros especiales al DtoConsulta.
        /// </summary>
        /// <param name="mdatosbean">Map que contiene metadata de una tabla a consultar.</param>
        /// <param name="dtoConsulta">Dto al cual se adiciona filtros especiales.</param>
        private void AddFiltrosEspecialDesdeArray(Dictionary<String, Object> mdatosbean, DtoConsulta dtoConsulta) {
            if (!mdatosbean.ContainsKey("filtroEspecial")) {
                return;
            }
            JArray a = (JArray)mdatosbean["filtroEspecial"];
            IList<Dictionary<string, object>> lfiltro = a.ToObject<IList<Dictionary<string, object>>>();

            foreach (Dictionary<string, object> m in lfiltro) {
                if (m["condicion"] == null) {
                    continue;
                }
                string campo = m["campo"].ToString();
                campo = campo.Replace("_", ".");
                string cond = m["condicion"].ToString();
                FiltroEspecial filtro = new FiltroEspecial(campo, cond);
                if (cond != null) {
                    cond = cond.Replace(";", "=");
                    filtro.Condicion = cond;
                }
                dtoConsulta.AddFiltroEspecial(filtro);
            }
        }

        /// <summary>
        /// Adiciona subquery al DtoConsulta.
        /// </summary>
        /// <param name="mdatosbean">Map que contiene metadata de una tabla a consultar.</param>
        /// <param name="dtoConsulta">Dto al cual se adiciona subqueries.</param>
        private void AddSubqueryDesdeArray(Dictionary<String, Object> mdatosbean, DtoConsulta dtoConsulta) {
            if (!mdatosbean.ContainsKey("subquery")) {
                return;
            }
            JArray a = (JArray)mdatosbean["subquery"];
            IList<Dictionary<string, object>> lsubquery = a.ToObject<IList<Dictionary<string, object>>>();

            foreach (Dictionary<string, object> m in lsubquery) {
                string bean = m["bean"].ToString();
                string campo = m["campo"].ToString();
                string alias = m["alias"].ToString();
                string filtro = m["filtro"].ToString();
                string sentencia = m.ContainsKey("sentencia") ? m["sentencia"].ToString() : "";
                SubQuery sq = null;
                if (sentencia != null && sentencia != "") {
                    sq = new SubQuery(sentencia, alias);
                } else {
                    // Cuando en angular se pone = al core llega como ;
                    filtro = filtro.Replace(";", "=");
                    sq = new SubQuery(bean, campo, alias, filtro);
                }
                dtoConsulta.AddSubQuery(sq);
            }
        }

    }
}

