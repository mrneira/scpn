using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace util.dto.consulta {

    [Serializable]
    public class DtoConsulta {

        /// <summary>
        /// Nombre del bean, con el cual se va a ejecutar la consulta.
        /// </summary>
        private string nombrebean;
        /// <summary>
        /// Numero de pagina se utiliza para consultar mas de un registro.
        /// </summary>
        private int pagina = 0;
        /// <summary>
        /// Numero de registros por pagina.
        /// </summary>
        private int registrospagina = 0;
        /// <summary>
        /// True indica que la consulta espera de respuesrta de 0..n registros.
        /// </summary>
        private bool multiregristro = false;
        /// <summary>
        /// string que contiene la lista de campos por el cual se va a ordenar la consula.<br>
        /// ejemplo<br>
        /// pk.pais ordenado por pais<br>
        /// pk.pais, pk.provincia, nombre ordenado por 3 campo<br>
        /// nombre desc orden descendente por nombre<br>
        /// </summary>
        private string ordenadopor;
        /// <summary>
        /// Lista de filtros con los cuales se arma la sentencia de la consulta.
        /// </summary>
        /// <typeparam name="Filtro"></typeparam>
        /// <param name=""></param>
        /// <returns></returns>
        private List<Filtro> lfiltros = new List<Filtro>();
        /// <summary>
        /// Lista de filtros con nulos en los cuales se arma la sentencia de la consulta.
        /// </summary>
        private List<FiltroEspecial> lfiltroesp = new List<FiltroEspecial>();
        /// <summary>
        /// Atributo para la lista de subquerys de consultas.
        /// </summary>
        private List<SubQuery> lSubquery = new List<SubQuery>();

        public DtoConsulta(string nombrebean, Dictionary<string, string> mcriterios) {
            this.nombrebean = nombrebean;
            AddCriterios(mcriterios);
        }

        public DtoConsulta(string nombrebean, int pagina, int registrospagina, bool multiregristro) {
            this.nombrebean = nombrebean;
            this.pagina = pagina;
            this.registrospagina = registrospagina;
            this.multiregristro = multiregristro;
        }

        public DtoConsulta(string nombrebean, int pagina, int registrospagina, bool multiregristro, Dictionary<string, string> mcriterios) {
            this.nombrebean = nombrebean;
            this.pagina = pagina;
            this.registrospagina = registrospagina;
            this.multiregristro = multiregristro;
            AddCriterios(mcriterios);
        }

        public DtoConsulta(string nombrebean, int pagina, int registrospagina, bool multiregristro, Dictionary<string, string> mcriterios, Dictionary<string, string> mcriteriosesp) {
            this.nombrebean = nombrebean;
            this.pagina = pagina;
            this.registrospagina = registrospagina;
            this.multiregristro = multiregristro;
            AddCriterios(mcriterios);
            AddCriteriosesp(mcriteriosesp);
        }

        public void AddCriterios(Dictionary<String, String> mcriterios) {
            if (mcriterios == null) {
                return;
            }
            var Keys = mcriterios.Keys;
            foreach (var campo in Keys) {
                if (mcriterios[campo] != "" && mcriterios[campo] != null) {
                    Filtro filtro = new Filtro(campo, "=", mcriterios[campo]);
                    this.lfiltros.Add(filtro);
                }
            }
        }

        public void AddCriteriosesp(Dictionary<String, String> mcriterios) {
            if (mcriterios == null) {
                return;
            }
            var Keys = mcriterios.Keys;
            foreach (var campo in Keys) {
                if (mcriterios[campo] != "" && mcriterios[campo] != null) {
                    FiltroEspecial filtro = new FiltroEspecial(campo, mcriterios[campo]);
                    this.lfiltroesp.Add(filtro);
                }
            }
        }

        /// <summary>
        /// Adiciona un filtro a la consulta.
        /// </summary>
        /// <param name="filtro">Objeto que contiene los datos del filtro a utilizar en la consulta.</param>
        public void AddFiltro(Filtro filtro) {
            lfiltros.Add(filtro);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="filtro">Objeto que contiene los datos del filtro a utilizar en la consulta.</param>
        public void AddFiltroEspecial(FiltroEspecial filtro) {
            lfiltroesp.Add(filtro);
        }

        /// <summary>
        /// Adiciona un subquery a la consulta.
        /// </summary>
        /// <param name="subquery">Objeto que contiene los datos de subquery a utilizar en la consulta.</param>
        public void AddSubQuery(SubQuery subquery) {
            lSubquery.Add(subquery);
        }

        public string Nombrebean { get => nombrebean; set => nombrebean = value; }
        public int Pagina { get => pagina; set => pagina = value; }
        public int Registrospagina { get => registrospagina; set => registrospagina = value; }
        public bool Multiregristro { get => multiregristro; set => multiregristro = value; }
        public string Ordenadopor { get => ordenadopor; set => ordenadopor = value; }
        public List<Filtro> Lfiltros { get => lfiltros; set => lfiltros = value; }
        public List<FiltroEspecial> Lfiltroesp { get => lfiltroesp; set => lfiltroesp = value; }
        public List<SubQuery> LSubquery { get => lSubquery; set => lSubquery = value; }
    }
}
