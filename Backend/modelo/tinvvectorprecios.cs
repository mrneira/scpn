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
    
    public partial class tinvvectorprecios: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        public long cinvvectorprecios { get; set; }
        public Nullable<long> optlock { get; set; }
        public Nullable<int> fvaloracion { get; set; }
        public Nullable<long> cinversion { get; set; }
        public string codigotitulo { get; set; }
        public Nullable<decimal> tasainterescuponvigente { get; set; }
        public Nullable<decimal> tasareferencia { get; set; }
        public Nullable<decimal> margen { get; set; }
        public Nullable<decimal> tasadescuento { get; set; }
        public Nullable<decimal> rendimientoequivalente { get; set; }
        public Nullable<decimal> porcentajeprecio { get; set; }
        public Nullable<int> calificacionriesgoccatalogo { get; set; }
        public string calificacionriesgocdetalle { get; set; }
        public Nullable<System.DateTime> fingreso { get; set; }
        public string cusuarioing { get; set; }
    
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgencatalogodetalle tgencatalogodetalle { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tinvinversion tinvinversion { get; set; }
    }
}