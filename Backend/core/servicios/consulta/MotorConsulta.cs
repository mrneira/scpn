using dal.generales;
using modelo;
using modelo.helper;
using modelo.interfaces;
using modelo.servicios;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.consulta;
using util.interfaces;
using util.servicios.ef;

namespace core.servicios.consulta {

    /// <summary>
    /// Clase que implementa el motor de consultas generico, toma como metadata un DtoConsulta arma los dml los ejecuta y entrega una respuesta.
    /// </summary>
    public class MotorConsulta : IMotorConsulta {

        /// <summary>
        /// Map con el orden campos a aplicar a la consulta.
        /// </summary>
        private Dictionary<string, object> mparametros = new Dictionary<string, object>();
        /// <summary>
        /// Parte de la setencia que tiene la instruccion for de la cosnualta.
        /// </summary>
        private StringBuilder sql;

        /// <summary>
        /// Almacena las restriciones de la consulta.
        /// </summary>
        private StringBuilder where;
        /// <summary>
        /// Lista de campos del base de la tabla a consultar.
        /// </summary>
        IEnumerable<FieldInfo> lcampos;
        /// <summary>
        /// Objeto que contiene informacion de la tabla a consultar.
        /// </summary>
        private tgenentidad tgenEntidad;
        /// <summary>
        /// AL fijar parametros adiciona Pk. eb los campos que forman parte del where.
        /// </summary>
        private bool addPkNombreCampo = false;
        private List<string> lcampossubquery = new List<string>();

        public StringBuilder Where { get => where; set => where = value; }

        public void Consultar(RqConsulta rqConsulta) {
            Dictionary<string, DtoConsulta> mtablas = rqConsulta.Mconsulta;
            foreach (String key in mtablas.Keys) {
                // Encerar campos subquerys por cada tabla a consultar
                lcampossubquery = new List<string>();
                // Ejecuta consulta de la tabla.
                DtoConsulta dtoconsulta = mtablas[key];
                Object resp = ConsultaPorTabla(dtoconsulta);
                rqConsulta.Response[key] = resp;

            }
        }

        /// <summary>
        /// Arma y ejecuta una sentencia sql con la cual se obtiene datos de la base.
        /// </summary>
        /// <param name="dtoconsulta">Objeto que contien metadata de consulta.</param>
        /// <returns>Object</returns>
        private Object ConsultaPorTabla(DtoConsulta dtoconsulta) {
            // Crea nuevos objetos por cada tabla que se consulta.
            this.sql = new StringBuilder();
            this.where = new StringBuilder();
            this.mparametros.Clear();
            tgenEntidad = TgenentidadDal.Find(dtoconsulta.Nombrebean);
            lcampos = DtoUtil.GetCampos("modelo", dtoconsulta.Nombrebean);
            this.ArmarSentencia(dtoconsulta);
            return this.EjecutarConsulsulta(dtoconsulta);
        }

        private void ArmarSentencia(DtoConsulta dtoconsulta)
        {
            this.ArmaSql(dtoconsulta);
            this.ArmaRestricciones(dtoconsulta);
            this.sql.Append(this.where);
            if (dtoconsulta.Ordenadopor != null)
            {
                this.sql.Append(" order by " + dtoconsulta.Ordenadopor);
            }
            
        }
        /// <summary>
        /// Arma la parte del select de la sentencia para ejecutar la consulta de la tabla.
        /// </summary>
        /// <param name="dtoconsulta">Objeto que contien metadata de consulta.</param>
        private void ArmaSql(DtoConsulta dtoconsulta) {
            this.sql.Append("select t.* ");
            List<SubQuery> lsubquery = dtoconsulta.LSubquery;
            foreach (SubQuery subQuery in lsubquery) {
                this.lcampossubquery.Add(subQuery.Alias);
                this.sql.Append("," + subQuery.getSubQuery(subQuery.Alias));
            }
            // Adiciona subqueries.
            this.sql.Append(" from " + dtoconsulta.Nombrebean + " t");
        }

        /// <summary>
        /// Adiciona restricciones a la consulta.
        /// </summary>
        /// <param name="dtoconsulta">Objeto que contien metadata de consulta.</param>
        protected void ArmaRestricciones(DtoConsulta dtoconsulta) {
            List<Filtro> lfiltro = dtoconsulta.Lfiltros;
            bool first = true;
            foreach (Filtro filtro in lfiltro) {
                if (filtro.Valor == null) {
                    continue;
                }
                this.AdicionaFiltro(dtoconsulta.Nombrebean, filtro, first);
                first = false;
            }
            ArmaRestriccionesEspeciales(dtoconsulta.Lfiltroesp, first);
        }

        /// <summary>
        /// Adiciona filtros a la consulta.
        /// </summary>
        /// <param name="bean">Nombre del dto asociado a una tabla.</param>
        /// <param name="filtro">Objeto que contiene la metadata de un filtro a aplicar en la consulta.</param>
        /// <param name="first">true indica que es la primera restriccion de la sentencia.</param>
        private void AdicionaFiltro(String bean, Filtro filtro, bool first) {
            bool tieneis = false;
            Object valor = filtro.Valor;
            if (valor.Equals("False") || valor.Equals("false")) {
                valor = false;
            }
            if (valor.Equals("True") || valor.Equals("true")) {
                valor = true;
            }
            String campo = filtro.Campo;
            bool llegaCondicion = filtro.Condicion == null ? false : true;
            String condicion = filtro.Condicion ?? "=";

            if (valor != null && (valor.ToString().ToLower().CompareTo("is null") == 0 || valor.ToString().ToLower().CompareTo("is not null") == 0)) {
                condicion = valor.ToString();
                tieneis = true;
            } else {
                Type tipo = DtoUtil.GetTipo(lcampos, campo);
                valor = DtoUtil.CambiarTipo(tipo, valor);
            }

            if(!llegaCondicion && valor is string ) {
                if(!valor.ToString().StartsWith("%")) {
                    valor = "%" + valor.ToString() ;
                }
                if (!valor.ToString().EndsWith("%")) {
                    valor = valor.ToString() + "%";
                }                    
            }

            if (valor.ToString().IndexOf("%") >= 0) {
                condicion = "like";
            }

            String aux = campo.Replace(".", "");
            String cond = "t." + campo + " " + condicion + " ";
            if (!tieneis) {
                cond = cond + "@" + aux;
                this.mparametros[aux] = valor;
            }
            if (this.addPkNombreCampo) {
                //cond = cond.Replace("t.", "t.pk.");
            }

            if (first) {
                this.where.Append(" where " + cond);
            } else {

                this.where.Append(" and " + cond);
            }
        }

        /// <summary>
        /// Adiciona restricciones especiales a la consulta.
        /// </summary>
        /// <param name="lfiltroesp">Lista de filtros especiales.</param>
        /// <param name="first">true indica que es la primera restriccion de la sentencia.</param>
        private void ArmaRestriccionesEspeciales(List<FiltroEspecial> lfiltroesp, bool first) {
            foreach (FiltroEspecial filtro in lfiltroesp) {
                // String condicion = filtro.isNull() ? "is null" : "is not null";
                if (first) {
                    this.where.Append(" where ").Append(filtro.Campo).Append(" ").Append(filtro.Condicion);
                    first = false;
                } else {
                    this.where.Append(" and ").Append(filtro.Campo).Append(" ").Append(filtro.Condicion);
                }
            }
        }

        /// <summary>
        /// Ejecuta consulta de una tabla.
        /// </summary>
        /// <param name="dtoconsulta">Objeto que contien metadata de consulta.</param>
        /// <returns>object</returns>
        private object EjecutarConsulsulta(DtoConsulta dtoconsulta) {
            if (dtoconsulta.Multiregristro) {
                object lresp = this.ConsultaLista(dtoconsulta);
                return lresp;
            }
            object resp = this.ConsultaObjeto(dtoconsulta);
            return resp;
        }

        /// <summary>
        /// Consulta y entrega una lista de registros.
        /// </summary>
        /// <param name="dtoconsulta">Objeto que contien metadata de consulta.</param>
        /// <returns>List<object></returns>
        private List<IBean> ConsultaLista(DtoConsulta dtoconsulta) {
            ConsultaHelper ch = new ConsultaHelper(Sessionef.GetAtlasContexto(), this.mparametros, this.sql.ToString());
            ch.pagina = dtoconsulta.Pagina;
            ch.registrosporpagina = dtoconsulta.Registrospagina;
            List<IBean> lresp = (List<IBean>)ch.GetRegistros( this.tgenEntidad.tname, this.lcampossubquery);
            return lresp;
        }

        /// <summary>
        /// Consulta y entrega una lista de registros.
        /// </summary>
        /// <param name="dtoconsulta">Objeto que contien metadata de consulta.</param>
        /// <returns>List<object></returns>
        private IList<Dictionary<string, object>> ConsultaListaDictionary(DtoConsulta dtoconsulta) {
            ConsultaHelper ch = new ConsultaHelper(Sessionef.GetAtlasContexto(), this.mparametros, this.sql.ToString());
            ch.pagina = dtoconsulta.Pagina;
            ch.registrosporpagina = dtoconsulta.Registrospagina;
            IList<Dictionary<string, object>> lresp = (IList<Dictionary<string, object>>)ch.GetRegistrosDictionary();
            return lresp;
        }

        /// <summary>
        /// Consulta un registro en la base de datos.
        /// </summary>
        /// <param name="dtoconsulta">Objeto que contien metadata de consulta.</param>
        /// <returns>object</returns>
        private object ConsultaObjeto(DtoConsulta dtoconsulta) {
            ConsultaHelper ch = new ConsultaHelper(Sessionef.GetAtlasContexto(), this.mparametros, this.sql.ToString());
            object resp = ch.GetRegistro( this.tgenEntidad.tname,  this.lcampossubquery);
            return resp;
        }

        public object ConsultarPorPk(string nombreBean, Dictionary<string, string> mcriterios) {
            DtoConsulta dto = new DtoConsulta(nombreBean, mcriterios);

            MotorConsulta mc = new MotorConsulta();
            return mc.ConsultaPorTabla(dto);
        }

        public static object Consultar(string nombreBean, Dictionary<string, string> mcriterios) {
            DtoConsulta dto = new DtoConsulta(nombreBean, mcriterios);

            MotorConsulta mc = new MotorConsulta();
            return mc.ConsultaPorTabla(dto);
        }

        public IList<Dictionary<string, object>> EjecutarConsultaNativa(DtoConsulta dtoconsulta, String sqle) {
		    if(String.IsNullOrEmpty(sqle)){
			    if(this.sql.ToString().ToLower().Contains("where")){
                this.sql.Append(" and " + this.where);
            } else {
                this.sql.Append(" where " + this.where);
            }

		    if (dtoconsulta.Ordenadopor != null) {
			    this.sql.Append(" order by " + dtoconsulta.Ordenadopor);
			    }
            }

            this.sql = new StringBuilder(sqle);
            IList<Dictionary<string, object>> lresp = this.ConsultaListaDictionary(dtoconsulta);
		    return lresp;
        }

        public void ArmaRestriccionesNativo(DtoConsulta dtoconsulta, Boolean auditoria) {
            tgenEntidad = TgenentidadDal.Find(dtoconsulta.Nombrebean);
            lcampos = DtoUtil.GetCampos("modelo", dtoconsulta.Nombrebean);
            this.where = new StringBuilder();
            List<Filtro> lfiltro = dtoconsulta.Lfiltros;
            Boolean first = true;
		    if (lfiltro.Any()) {
			    foreach (Filtro filtro in lfiltro) {
				    if (filtro.Valor == null) {
					    continue;
				    }

                    this.AdicionaFiltroNativo(dtoconsulta.Nombrebean, filtro, first);
                first = false;
                }
		    }
            if (auditoria) {
                ArmaRestriccionesEspNativoAudit(dtoconsulta.Lfiltroesp, first);
            }
        }

        protected void ArmaRestriccionesEspNativoAudit(List<FiltroEspecial> lfiltroesp, Boolean first) {
            if (lfiltroesp.Any()) {
                StringBuilder jsonpk = new StringBuilder();
                StringBuilder json = new StringBuilder();

                jsonpk.Append("(pk.value IN(");
                json.Append("(f.value IN(");

                Boolean firstjson = true;
                foreach (FiltroEspecial filtro in lfiltroesp) {
                    if (firstjson) {
                        jsonpk.Append("'{\"c\":\"" + filtro.Campo + "\",\"v\":\"" + filtro.Condicion + "\"}'");
                        json.Append("'{\"c\":\"" + filtro.Campo + "\",\"v\":\"" + filtro.Condicion + "\"}'");
                        firstjson = false;
                    } else {
                        jsonpk.Append("," + "'{\"c\":\"" + filtro.Campo + "\",\"v\":\"" + filtro.Condicion + "\"}'");
                        json.Append("," + "'{\"c\":\"" + filtro.Campo + "\",\"v\":\"" + filtro.Condicion + "\"}'");
                    }
                }
                jsonpk.Append("))");
                json.Append("))");

                if (jsonpk.ToString().CompareTo("(pk.value IN())") != 0) {
                    if (first) {
                        this.where.Append(" where (").Append(jsonpk).Append(" or ").Append(json).Append(")");
                        first = false;
                    } else {
                        this.where.Append(" and (").Append(jsonpk).Append(" or ").Append(json).Append(")");
                    }
                }
            }
        }

        private void AdicionaFiltroNativo(String bean, Filtro filtro, Boolean first) {
            Boolean tieneis = false;
            Object valor = filtro.Valor;
            String campo = filtro.Campo;
            Boolean llegaCondicion = filtro.Condicion == null ? false : true;
            String condicion = filtro.Condicion == null ? "=" : filtro.Condicion;
		    if (valor != null && valor.Equals("true")) {
                valor = true;
            }
		    if (valor != null && valor.Equals("false")) {
                valor = false;
            }
		    if (valor != null && (valor.ToString().ToLower().CompareTo("is null") == 0 || valor.ToString().ToLower().CompareTo("is not null") == 0)) {
                condicion = valor.ToString();
                tieneis = true;
            } else if (condicion.ToLower().CompareTo("in") == 0) {
                condicion = condicion + valor.ToString();
                tieneis = true;
            } else {
                Type tipo = DtoUtil.GetTipo(lcampos, campo);
                valor = DtoUtil.CambiarTipo(tipo, valor);
            }

            if (!llegaCondicion && valor is string) {
                if (!valor.ToString().StartsWith("%")) {
                    valor = "%" + valor.ToString();
                }
                if (!valor.ToString().EndsWith("%")) {
                    valor = valor.ToString() + "%";
                }
            }

            if (valor.ToString().IndexOf("%") >= 0) {
                condicion = "like";
            }

            String aux = campo.Substring(campo.IndexOf(".") + 1, campo.Length);
            String cond = "t." + campo + " " + condicion + " ";
		        if (!tieneis) {
                cond = cond + "@" + aux;
                this.mparametros[aux] = valor;
            }

		    if (first) {
                this.where.Append(cond);
            } else {
                this.where.Append(" and " + cond);
            }
        }


    }
}
