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
    
    public partial class tnomdecimotercero: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        public long cdecimotercero { get; set; }
        public Nullable<int> mesccatalogo { get; set; }
        public Nullable<long> cfuncionario { get; set; }
        public string mescdetalle { get; set; }
        public Nullable<System.DateTime> fechageneracion { get; set; }
        public Nullable<long> anio { get; set; }
        public decimal sueldoactual { get; set; }
        public decimal valor { get; set; }
        public Nullable<bool> mensualiza { get; set; }
        public Nullable<bool> contabilizado { get; set; }
        public Nullable<long> crol { get; set; }
        public Nullable<System.DateTime> fingreso { get; set; }
        public Nullable<System.DateTime> fmodificacion { get; set; }
        public string cusuarioing { get; set; }
        public string cusuariomod { get; set; }
        public Nullable<System.DateTime> fpago { get; set; }
        public Nullable<long> aniopago { get; set; }
    
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgencatalogodetalle tgencatalogodetalle { get; set; }
    }
}
