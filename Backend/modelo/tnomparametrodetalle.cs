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
    
    public partial class tnomparametrodetalle: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        public long anio { get; set; }
        public int verreg { get; set; }
        public Nullable<int> mesdcccatalogo { get; set; }
        public string mesdccdetalle { get; set; }
        public Nullable<int> mesfondoccatalogo { get; set; }
        public string mesfondocdetalle { get; set; }
        public Nullable<long> optlock { get; set; }
        public Nullable<int> veractual { get; set; }
        public Nullable<System.DateTime> fingreso { get; set; }
        public Nullable<System.DateTime> fmodificacion { get; set; }
        public string cusuarioing { get; set; }
        public string cusuariomod { get; set; }
        public Nullable<bool> estado { get; set; }
        public Nullable<System.DateTime> finicio { get; set; }
        public Nullable<System.DateTime> ffin { get; set; }
        public Nullable<decimal> sbu { get; set; }
        public Nullable<decimal> pperiesslosep { get; set; }
        public Nullable<decimal> pperiesscod { get; set; }
        public Nullable<decimal> ppaiesslosep { get; set; }
        public Nullable<decimal> ppaiesscod { get; set; }
        public Nullable<decimal> bimponiblegp { get; set; }
        public Nullable<decimal> pcccc { get; set; }
        public Nullable<decimal> pcccl { get; set; }
        public string descripcion { get; set; }
    
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgencatalogodetalle tgencatalogodetalle { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgencatalogodetalle tgencatalogodetalle1 { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tnomparametro tnomparametro { get; set; }
    }
}