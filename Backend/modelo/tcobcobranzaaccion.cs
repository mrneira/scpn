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
    
    public partial class tcobcobranzaaccion: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        public Nullable<int> caccion { get; set; }
        public Nullable<int> verreg { get; set; }
        public long ccobranza { get; set; }
        public string coperacion { get; set; }
        public string secuencia { get; set; }
        public string cusuarioaccion { get; set; }
        public Nullable<int> fingreso { get; set; }
        public Nullable<System.DateTime> freal { get; set; }
        public Nullable<int> numcuotavencido { get; set; }
        public Nullable<decimal> saldovencido { get; set; }
        public Nullable<int> diasvencido { get; set; }
        public string telefono { get; set; }
        public string correo { get; set; }
        public Nullable<System.DateTime> fcompromisopago { get; set; }
        public string observacion { get; set; }
        public Nullable<int> ccatalogo { get; set; }
        public string cdetalle { get; set; }
    
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tcobaccion tcobaccion { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tcobcobranza tcobcobranza { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgencatalogodetalle tgencatalogodetalle { get; set; }
    }
}