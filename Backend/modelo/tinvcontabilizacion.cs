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
    
    public partial class tinvcontabilizacion: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        public long cinvcontabilizacion { get; set; }
        public Nullable<long> optlock { get; set; }
        public Nullable<long> cinversion { get; set; }
        public Nullable<long> cinvtablaamortizacion { get; set; }
        public Nullable<long> cinversionrentavariable { get; set; }
        public Nullable<long> cinvprecancelacion { get; set; }
        public Nullable<long> cinvventaaccion { get; set; }
        public Nullable<long> cinversionhis { get; set; }
        public Nullable<int> procesoccatalogo { get; set; }
        public string procesocdetalle { get; set; }
        public Nullable<int> rubroccatalogo { get; set; }
        public string rubrocdetalle { get; set; }
        public string ccomprobante { get; set; }
        public Nullable<int> fcontable { get; set; }
        public Nullable<int> particion { get; set; }
        public Nullable<int> secuencia { get; set; }
        public Nullable<int> ccompania { get; set; }
        public Nullable<decimal> valor { get; set; }
        public string ccuenta { get; set; }
        public Nullable<bool> debito { get; set; }
        public string cpartidaingreso { get; set; }
        public Nullable<int> freal { get; set; }
        public Nullable<System.DateTime> fingreso { get; set; }
        public string cusuarioing { get; set; }
        public Nullable<System.DateTime> fmodificacion { get; set; }
        public string cusuariomod { get; set; }
        public Nullable<byte> mora { get; set; }
        public Nullable<int> fdividendo { get; set; }
        public Nullable<long> cinvemisorvalornominal { get; set; }
    
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgencatalogodetalle tgencatalogodetalle { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgencatalogodetalle tgencatalogodetalle1 { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tinvventaacciones tinvventaacciones { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tinvinversionhis tinvinversionhis { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tinvemisorvalornominal tinvemisorvalornominal { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tinvprecancelacion tinvprecancelacion { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tinvinversionrentavariable tinvinversionrentavariable { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tinvtablaamortizacion tinvtablaamortizacion { get; set; }
    }
}
