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
    
    public partial class tthreferencialaboral: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        public long creferencialaboral { get; set; }
        public Nullable<long> cexperiencia { get; set; }
        public string nombres { get; set; }
        public string telefono1 { get; set; }
        public string telefono2 { get; set; }
        public string ocupacion { get; set; }
        public string profesion { get; set; }
    
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tthexperiencialaboral tthexperiencialaboral { get; set; }
    }
}
