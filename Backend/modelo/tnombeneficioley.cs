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
    
    public partial class tnombeneficioley: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        public long cbeneficioley { get; set; }
        public Nullable<long> crol { get; set; }
        public string descripcion { get; set; }
        public Nullable<bool> estado { get; set; }
        public Nullable<decimal> decimocuarto { get; set; }
        public Nullable<decimal> decimotercero { get; set; }
        public Nullable<decimal> fondoreserva { get; set; }
        public Nullable<System.DateTime> fingreso { get; set; }
        public Nullable<System.DateTime> fmodificacion { get; set; }
        public string cusuarioing { get; set; }
        public string cusuariomod { get; set; }
    
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tnomrol tnomrol { get; set; }
    }
}
