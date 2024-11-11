using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace modelo.helper {
    /// <summary>
    /// Clase de la cual heredan todas las clases dto, esta clase contiene datos que tiene que yener todos los Dto.
    /// </summary>
    public abstract class AbstractDto {
        /// <summary>
        /// Id del registro que llega desde el front end, es el nuemro de registro que se inserat o modifica en el front end.
        /// </summary>
        private int idreg;
        /// <summary>
        /// Indica que el registro se actualiza en la base de datos en save generico.
        /// </summary>
        private bool actualizar = false;
        /// <summary>
        /// Indica que el registro se inserta en la base de datos.
        /// </summary>
        private bool esnuevo = false;
        /// <summary>
        /// Map que almacena datos adicionales por dto.
        /// </summary>
        private Dictionary<string, Object> mdatos = new Dictionary<string, Object>();
        /// Map que almacena datos de bce.
        /// </summary>
        private List<IBean> mbce = new List<IBean>();

        /// <summary>
        /// Fija y entrega el valor de id.
        /// </summary>
        [Newtonsoft.Json.JsonProperty(PropertyName = "idreg")]
        public virtual int Idreg { get => idreg; set => idreg = value; }

        /// <summary>
        /// Fija y entrega el valor de actualizar.
        /// </summary>
        [Newtonsoft.Json.JsonProperty(PropertyName = "actualizar")]
        public virtual bool Actualizar { get => actualizar; set => actualizar = value; }

        /// <summary>
        /// Fija y entrega el valor de nuevo.
        /// </summary>
        [Newtonsoft.Json.JsonProperty(PropertyName = "esnuevo")]
        public virtual bool Esnuevo { get => esnuevo; set => esnuevo = value; }

        /// <summary>
        /// Fija y entrega el valor de mdatos.
        /// </summary>
        [Newtonsoft.Json.JsonProperty(PropertyName = "mdatos")]
        public virtual Dictionary<string, object> Mdatos { get => mdatos; set => mdatos = value; }

        /// <summary>
        /// Fija y entrega el valor de mbce.
        /// </summary>
        [Newtonsoft.Json.JsonProperty(PropertyName = "mbce")]
        public virtual List<IBean> Mbce { get; set; }

        /// <summary>
        /// Adiciona un elemento a mdatos.
        /// </summary>
        public virtual void AddDatos(string key, Object valor)
        {
            mdatos[key] = valor;
        }

        /// <summary>
        /// Entrega un elemento de mdatos.
        /// </summary>
        public virtual Object GetDatos(string key)
        {
            if (mdatos.ContainsKey(key)) {
                return mdatos[key];
            }
            return null; // si no existe simepre retornar null
        }

        /// <summary>
        /// Elimina un elemento de mdatos.
        /// </summary>
        public virtual void RemoveDatos(String key)
        {
            mdatos.Remove(key);
        }

        /// <summary>
        /// Entrega un elemento string de mdatos.
        /// </summary>
        public virtual string GetString(String key)
        {
            if (!mdatos.ContainsKey(key)) {
                return null;
            }
            return (string)mdatos[key];
        }

        /// <summary>
        /// Entrega un elemento DateTime de mdatos.
        /// </summary>
        public virtual DateTime? GetDate(String key)
        {
            if (!mdatos.ContainsKey(key)) {
                return null;
            }
            return (DateTime)mdatos[key];
        }

        /// <summary>
        /// Entrega un elemento int de mdatos.
        /// </summary>
        public virtual int? GetInt(String key)
        {
            if (!mdatos.ContainsKey(key)) {
                return null;
            }
            int i = Int32.Parse(mdatos[key].ToString());
            return i;
        }

        /// <summary>
        /// Entrega un elemento long de mdatos.
        /// </summary>
        public virtual long? GetLong(String key)
        {
            if (!mdatos.ContainsKey(key)) {
                return null;
            }
            long l = long.Parse(mdatos[key].ToString());
            return l;
        }

        /// <summary>
        /// Entrega un elemento decimal de mdatos.
        /// </summary>
        public virtual decimal? GetDecimal(String key)
        {
            if (!mdatos.ContainsKey(key)) {
                return null;
            }
            decimal d = Decimal.Parse(mdatos[key].ToString());
            return d;
        }
    }
}
