//------------------------------------------------------------------------------
// <auto-generated>
//     Este código se generó a partir de una plantilla.
//
//     Los cambios manuales en este archivo pueden causar un comportamiento inesperado de la aplicación.
//     Los cambios manuales en este archivo se sobrescribirán si se regenera el código.
// </auto-generated>
//------------------------------------------------------------------------------

namespace modelo
{
    using System;using modelo.helper;using modelo.helper.cartera;using modelo.interfaces;using System.Linq; using Newtonsoft.Json;using System.Runtime.Serialization;
    using System.Collections.Generic;
    
    public partial class tgencargacampos: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        public int cmodulo { get; set; }
        public int ctipoarchivo { get; set; }
        public int ccampo { get; set; }
        public Nullable<long> optlock { get; set; }
        public string nombre { get; set; }
        public string atributo { get; set; }
        public Nullable<bool> requerido { get; set; }
        public string tipodato { get; set; }
        public string formatofecha { get; set; }
        public Nullable<int> posicioninicio { get; set; }
        public Nullable<int> posicionfin { get; set; }
        public Nullable<int> longitud { get; set; }
    
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgencargaarchivo tgencargaarchivo { get; set; }
    }
}
