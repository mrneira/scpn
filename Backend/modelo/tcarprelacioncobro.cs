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
    
    public partial class tcarprelacioncobro: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        public string csaldo { get; set; }
        public Nullable<int> orden { get; set; }
        public Nullable<int> rubro { get; set; }
        public Nullable<int> rubroasociado { get; set; }
    
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tmonsaldo tmonsaldo { get; set; }
    }
}