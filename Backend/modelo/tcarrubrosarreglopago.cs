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
    
    public partial class tcarrubrosarreglopago: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        public string ctipoarreglopago { get; set; }
        public string csaldo { get; set; }
        public string csaldodestino { get; set; }
        public Nullable<long> optlock { get; set; }
        public Nullable<bool> pagoobligatorio { get; set; }
    
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tmonsaldo tmonsaldo { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tcartipoarreglopago tcartipoarreglopago { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tmonsaldo tmonsaldo1 { get; set; }
    }
}
