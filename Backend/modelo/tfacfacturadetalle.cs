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
    
    public partial class tfacfacturadetalle: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        public long cfactura { get; set; }
        public int cdetalle { get; set; }
        public long cproducto { get; set; }
        public Nullable<int> cimpuestoiva { get; set; }
        public Nullable<int> cimpuestoice { get; set; }
        public Nullable<int> cimpuestoirbpnr { get; set; }
        public string csaldo { get; set; }
        public Nullable<int> cantidad { get; set; }
        public Nullable<decimal> preciounitario { get; set; }
        public Nullable<decimal> descuento { get; set; }
        public Nullable<decimal> subtotal { get; set; }
        public Nullable<decimal> total { get; set; }
        public Nullable<decimal> iva { get; set; }
        public Nullable<decimal> ice { get; set; }
        public Nullable<decimal> irbpnr { get; set; }
    
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tfacfactura tfacfactura { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tfacproducto tfacproducto { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tfacimpuesto tfacimpuesto { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tfacimpuesto tfacimpuesto1 { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tfacimpuesto tfacimpuesto2 { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tmonsaldo tmonsaldo { get; set; }
    }
}
