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
    
    public partial class tthhorariodetalle: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        public long chorariodetalle { get; set; }
        public Nullable<long> chorario { get; set; }
        public Nullable<System.TimeSpan> ijornada { get; set; }
        public Nullable<System.TimeSpan> ialmuerzo { get; set; }
        public Nullable<System.TimeSpan> falmuerzo { get; set; }
        public Nullable<System.TimeSpan> fjornada { get; set; }
        public Nullable<int> ijornadaint { get; set; }
        public Nullable<int> ialmuerzoint { get; set; }
        public Nullable<int> falmuerzoint { get; set; }
        public Nullable<int> fjornadaint { get; set; }
        public Nullable<int> diaccatalogo { get; set; }
        public string diacdetalle { get; set; }
    
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgencatalogodetalle tgencatalogodetalle { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tthhorario tthhorario { get; set; }
    }
}
