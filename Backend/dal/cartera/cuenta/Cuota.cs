using modelo;
using modelo.helper;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.cartera.cuenta {

    /// <summary>
    /// Clase que que contiene valores volatiles de rubros asociados a cuotas de una tabla de pagos.
    /// </summary>
    public class Cuota : AbstractDto {

        /// <summary>
        /// Lista de objetos a insertar o actualizar en la base de datos.
        /// </summary>
        private List<tcaroperacionrubro> rubros = new List<tcaroperacionrubro>();

        /// <summary>
        /// Bandera que indica si inserto un registro de reverso.
        /// </summary>
        private bool registroregistrosreverso = false;

        public virtual bool Registroregistrosreverso { get => registroregistrosreverso; set => registroregistrosreverso = value; }

        /// <summary>
        /// Entrega el valor de: rubros
        /// </summary>
        /// <returns>List<TcarOperacionRubroDto></returns>
        public virtual List<tcaroperacionrubro> GetRubros() {
            return this.rubros;
        }

        /// <summary>
        /// Fija el valor de: rubros
        /// </summary>
        /// <param name="rubros">Lista de rubros</param>
        public virtual void SetRubros(List<tcaroperacionrubro> rubros) {
            this.rubros = rubros;
        }

    }
}
