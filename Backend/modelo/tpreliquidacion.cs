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
    
    public partial class tpreliquidacion: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        public long secuencia { get; set; }
        public int verreg { get; set; }
        public Nullable<int> coeficiente { get; set; }
        public Nullable<int> veractual { get; set; }
        public Nullable<decimal> vcuantiabasica { get; set; }
        public Nullable<decimal> vbonificacion { get; set; }
        public Nullable<decimal> vinteres { get; set; }
        public Nullable<decimal> dprestamos { get; set; }
        public Nullable<decimal> dnovedades { get; set; }
        public Nullable<decimal> dretencion { get; set; }
        public Nullable<decimal> daportes { get; set; }
        public Nullable<decimal> taportes { get; set; }
        public Nullable<decimal> tdescuento { get; set; }
        public string cusuarioing { get; set; }
        public string cusuariomod { get; set; }
        public Nullable<System.DateTime> fingreso { get; set; }
        public Nullable<System.DateTime> fmodificacion { get; set; }
        public Nullable<decimal> porcentajeanticipo { get; set; }
    
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tpreexpediente tpreexpediente { get; set; }
    }
}
