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
    
    public partial class tinvemisorvalornominal: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public tinvemisorvalornominal()
        {
        }
    
        public long cinvemisorvalornominal { get; set; }
        public Nullable<long> optlock { get; set; }
        public Nullable<int> emisorccatalogo { get; set; }
        public string emisorcdetalle { get; set; }
        public Nullable<int> ftransaccion { get; set; }
        public Nullable<decimal> valornominal { get; set; }
        public Nullable<decimal> precio { get; set; }
        public Nullable<System.DateTime> fingreso { get; set; }
        public string cusuarioing { get; set; }
        public Nullable<System.DateTime> fmodificacion { get; set; }
        public string cusuariomod { get; set; }
        public Nullable<bool> debito { get; set; }
        public Nullable<decimal> saldo { get; set; }
        public Nullable<int> transaccionccatalogo { get; set; }
        public string transaccioncdetalle { get; set; }
        public Nullable<int> estadoccatalogo { get; set; }
        public string estadocdetalle { get; set; }
        public string motivo { get; set; }
    
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgencatalogodetalle tgencatalogodetalle { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgencatalogodetalle tgencatalogodetalle1 { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgencatalogodetalle tgencatalogodetalle2 { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual ICollection<tinvcontabilizacion> tinvcontabilizacion { get; set; }
    }
}