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
    
    public partial class tnomhoraextra: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        public long choraextra { get; set; }
        public Nullable<long> csolicitud { get; set; }
        public Nullable<int> tipoccatalogo { get; set; }
        public string tipocdetalle { get; set; }
        public Nullable<System.DateTime> finicio { get; set; }
        public Nullable<System.DateTime> ffin { get; set; }
        public Nullable<decimal> totalhoras { get; set; }
        public Nullable<bool> estado { get; set; }
    
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgencatalogodetalle tgencatalogodetalle { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tnomsolicitud tnomsolicitud { get; set; }
    }
}