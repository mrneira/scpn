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
    
    public partial class tsegpolitica: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        public int ccompania { get; set; }
        public string ccanal { get; set; }
        public Nullable<int> longitud { get; set; }
        public Nullable<int> diasvalidez { get; set; }
        public Nullable<int> diasmensajedeinvalidez { get; set; }
        public Nullable<int> intentos { get; set; }
        public Nullable<int> repeticiones { get; set; }
        public Nullable<int> numeros { get; set; }
        public Nullable<int> especiales { get; set; }
        public Nullable<int> minusculas { get; set; }
        public Nullable<int> mayusculas { get; set; }
        public Nullable<int> tiemposesion { get; set; }
    
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgencanales tgencanales { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgencompania tgencompania { get; set; }
    }
}
