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
    
    public partial class tgaroperacionhistoria: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        public string mensaje { get; set; }
        public string coperacion { get; set; }
        public string ctipogarantia { get; set; }
        public string ctipobien { get; set; }
        public string cclasificacion { get; set; }
        public Nullable<int> fvigencia { get; set; }
        public Nullable<long> cpersona { get; set; }
        public Nullable<int> cmodulo { get; set; }
        public Nullable<int> cproducto { get; set; }
        public Nullable<int> ctipoproducto { get; set; }
        public Nullable<int> ccompania { get; set; }
        public string cmoneda { get; set; }
        public Nullable<int> cagencia { get; set; }
        public Nullable<int> csucursal { get; set; }
        public string cusuarioapertura { get; set; }
        public string cusuariocancelacion { get; set; }
        public string cestatus { get; set; }
        public Nullable<decimal> montooriginal { get; set; }
        public Nullable<int> fconstitucion { get; set; }
        public Nullable<int> fcontabilizacion { get; set; }
        public Nullable<int> fvencimiento { get; set; }
        public Nullable<int> fcancelacion { get; set; }
        public Nullable<int> frealizacion { get; set; }
        public string descripcion { get; set; }
        public Nullable<bool> renovacion { get; set; }
        public string coperacionanterior { get; set; }
        public string caracteristicas { get; set; }
        public string cpais { get; set; }
        public string cpprovincia { get; set; }
        public string ccanton { get; set; }
        public string direccion { get; set; }
        public string mensajeanterior { get; set; }
    
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgaroperacion tgaroperacion { get; set; }
    }
}
