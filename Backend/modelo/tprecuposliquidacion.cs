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
    
    public partial class tprecuposliquidacion: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        public int anio { get; set; }
        public string tipocupocdetalle { get; set; }
        public string tipojerarquiacdetalle { get; set; }
        public long optlock { get; set; }
        public Nullable<int> tipocupoccatalogo { get; set; }
        public int tipojerarquiaccatalogo { get; set; }
        public string comentario { get; set; }
        public int cupostotal { get; set; }
        public Nullable<int> cuposusado { get; set; }
        public string cusuarioing { get; set; }
        public Nullable<System.DateTime> fingreso { get; set; }
        public string cusuariomod { get; set; }
        public Nullable<System.DateTime> fmodificacion { get; set; }
    
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgencatalogodetalle tgencatalogodetalle { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgencatalogodetalle tgencatalogodetalle1 { get; set; }
    }
}