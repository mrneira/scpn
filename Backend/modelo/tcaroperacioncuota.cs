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
    
    public partial class tcaroperacioncuota: Cuota,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        public string coperacion { get; set; }
        public int numcuota { get; set; }
        public Nullable<int> fvigencia { get; set; }
        public string cestatus { get; set; }
        public string ctipocredito { get; set; }
        public string cestadooperacion { get; set; }
        public string csegmento { get; set; }
        public Nullable<int> cbanda { get; set; }
        public Nullable<int> dias { get; set; }
        public Nullable<int> diasreales { get; set; }
        public Nullable<int> finicio { get; set; }
        public Nullable<int> fvencimiento { get; set; }
        public Nullable<int> fpago { get; set; }
        public Nullable<decimal> capitalreducido { get; set; }
        public Nullable<decimal> interesdeudor { get; set; }
        public Nullable<decimal> pagoextraordinario { get; set; }
        public string mensaje { get; set; }
    
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tcarestatus tcarestatus { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tcaroperacion tcaroperacion { get; set; }
    }
}
