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
    
    public partial class tnompermiso: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        public long cpermiso { get; set; }
        public Nullable<long> csolicitud { get; set; }
        public Nullable<int> permisoccatalogo { get; set; }
        public string permisocdetalle { get; set; }
        public Nullable<System.DateTime> finicio { get; set; }
        public Nullable<System.DateTime> ffin { get; set; }
        public Nullable<bool> diacompleto { get; set; }
        public Nullable<System.DateTime> hinicio { get; set; }
        public Nullable<System.DateTime> hfin { get; set; }
        public string motivo { get; set; }
        public Nullable<long> cgesarchivo { get; set; }
        public Nullable<bool> estado { get; set; }
        public string cusuariojefe { get; set; }
        public string cusuariorrh { get; set; }
        public string cusuariodejecutivo { get; set; }
    
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgencatalogodetalle tgencatalogodetalle { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tnomsolicitud tnomsolicitud { get; set; }
    }
}
