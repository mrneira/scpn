using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace util.dto.consulta {
    [Serializable]
    public class SubQuery {

        /// <summary>
        /// Nombre del bean, asociado a una tabla a utilziar en el subquery.
        /// </summary>
        private string nombrebean;
        /// <summary>
        /// Campo a consultar en el subquery.
        /// </summary>
        private string campo;
        /// <summary>
        /// Nombre con el cual se entrega la respuesta, si el alias es null toma el valor de campo.
        /// </summary>
        private string alias;
        /// <summary>
        /// Where con el cual se ejecuta el subquery. <br>
        /// Ejemplo considera i.pk.pais = t.pk.pais and i.provincia = t.provincia.<br>
        /// siempre va(i) para el bean del subquery y(t) para la tabla externa.
        /// </summary>
        private string where;
        /// <summary>
        /// Sentencia especial utilizada en el subquery. Ejemplo <br>
        /// select pd.nombre from tperpersonadetalle pd, tsegusuariodetalle tu where pd.cpersona = tu.cpersona and pd.verreg = 0 and tu.verreg = 0 and tu.cusuario = t.cusuario < br >
        /// En donde t.cusuario es de la sentencia principal.
        /// </summary>
        private string sentencia;

        /// <summary>
        /// Crea una instancia de SubQuery.
        /// </summary>
        /// <param name="sentecnia">Sentencia del subquery.</param>
        /// <param name="alias">Alias con el cual se devuelve el valor del campo resultado del subquery.</param>
        public SubQuery(string sentecnia, string alias) {
            this.sentencia = sentecnia;
            this.alias = alias;
        }

        /// <summary>
        /// Crea una instancia de SubQuery.
        /// </summary>
        /// <param name="nombrebean">Nombre del dto asociado al entity.</param>
        /// <param name="campo">Campo a buscar.</param>
        /// <param name="alias">Alias con el cual se devuelve el valor del campo resultado del subquery.</param>
        /// <param name="filtro">Filtro a utilziar en el subquery</param>
        public SubQuery(string nombrebean, string campo, string alias, string filtro) {
            this.nombrebean = nombrebean;
            this.campo = campo;
            this.alias = alias;
            if (this.alias == null) {
                this.alias = this.campo;
            }
            this.where = " where " + filtro;
        }

        /// <summary>
        /// Crea una instancia de SubQuery.
        /// </summary>
        /// <param name="nombrebean">Nombre del dto entity bean.</param>
        /// <param name="campo">Campo a buscar.</param>
        /// <param name="alias">Alias con el cual se devuelve el valor del campo resultado del subquery.</param>
        /// <param name="where">Codicion a aplicar en el where de la sentenia.</param>
        /// <param name="sentencia">Sentencia del subquery.</param>
        public SubQuery(string nombrebean, string campo, string alias, string where, string sentencia) {
            this.nombrebean = nombrebean;
            this.campo = campo;
            this.alias = alias;
            this.where = where;
            this.sentencia = sentencia;
        }

        public string Nombrebean { get => nombrebean; set => nombrebean = value; }
        public string Campo { get => campo; set => campo = value; }
        public string Alias { get => alias; set => alias = value; }
        public string Where { get => where; set => where = value; }
        public string Sentencia { get => sentencia; set => sentencia = value; }

        /// <summary>
        /// Entrega la sentencia de subquery a ejecutar.
        /// </summary>
        /// <returns></returns>
        public string getSubQuery(string alias) {
            //si es una senetncia fija.
            if ((this.Sentencia != null) && !this.Sentencia.Equals("")) {
                return "(" + this.sentencia + ") as " + alias;
            }
            return "(select i." + this.campo + " from " + this.nombrebean + " i " + this.where + ") as "+ alias;
        }


    }
}
