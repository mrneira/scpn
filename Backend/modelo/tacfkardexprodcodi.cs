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
    
    public partial class tacfkardexprodcodi: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        public long ckardexprodcodi { get; set; }
        public string serial { get; set; }
        public string cbarras { get; set; }
        public int cproducto { get; set; }
        public Nullable<bool> esingreso { get; set; }
        public string tipomovimiento { get; set; }
        public bool devuelto { get; set; }
        public Nullable<int> cmovimiento { get; set; }
        public Nullable<decimal> cantidad { get; set; }
        public Nullable<decimal> vunitario { get; set; }
        public Nullable<decimal> costopromedio { get; set; }
        public string cusuarioasignado { get; set; }
        public string infoadicional { get; set; }
        public Nullable<int> ubicacionccatalogo { get; set; }
        public string ubicacioncdetalle { get; set; }
        public string cusuarioing { get; set; }
        public Nullable<System.DateTime> fingreso { get; set; }
    
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tacfproducto tacfproducto { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgencatalogodetalle tgencatalogodetalle { get; set; }
    }
}
