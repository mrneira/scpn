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
    
    public partial class tmoncargos: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        public string csaldo { get; set; }
        public string cmoneda { get; set; }
        public string cmonedacargo { get; set; }
        public Nullable<decimal> porcentaje { get; set; }
        public Nullable<decimal> valorminimo { get; set; }
        public Nullable<decimal> valormaximo { get; set; }
    
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgenmoneda tgenmoneda { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgenmoneda tgenmoneda1 { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tmonsaldo tmonsaldo { get; set; }
    }
}
