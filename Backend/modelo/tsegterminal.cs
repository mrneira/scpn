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
    
    public partial class tsegterminal: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        public string cterminal { get; set; }
        public int cagencia { get; set; }
        public int csucursal { get; set; }
        public int ccompania { get; set; }
        public int verreg { get; set; }
        public Nullable<int> veractual { get; set; }
        public string cusuarioing { get; set; }
        public Nullable<System.DateTime> fingreso { get; set; }
        public string cusuariomod { get; set; }
        public Nullable<System.DateTime> fmodificacion { get; set; }
        public Nullable<int> carea { get; set; }
        public string mac { get; set; }
        public string impresoraslip { get; set; }
    
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgenagencia tgenagencia { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgenarea tgenarea { get; set; }
    }
}
