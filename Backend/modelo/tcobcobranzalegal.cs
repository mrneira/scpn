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
    
    public partial class tcobcobranzalegal: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        public long ccobranza { get; set; }
        public string coperacion { get; set; }
        public int verreg { get; set; }
        public string secuencia { get; set; }
        public string cusuarioetapa { get; set; }
        public Nullable<int> ccatalogoetapa { get; set; }
        public string cdetalleetapa { get; set; }
        public Nullable<int> fingreso { get; set; }
        public Nullable<System.DateTime> freal { get; set; }
        public string observacion { get; set; }
    
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tcobcobranza tcobcobranza { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgencatalogodetalle tgencatalogodetalle { get; set; }
    }
}
