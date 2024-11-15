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
    
    public partial class tcarsegmentotasasfrec: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        public string csegmento { get; set; }
        public string cmoneda { get; set; }
        public string csaldo { get; set; }
        public int cfrecuecia { get; set; }
        public int secuencia { get; set; }
        public int verreg { get; set; }
        public Nullable<long> optlock { get; set; }
        public Nullable<int> veractual { get; set; }
        public Nullable<int> plazodesde { get; set; }
        public Nullable<int> plazohasta { get; set; }
        public string cusuarioing { get; set; }
        public string cusuariomod { get; set; }
        public Nullable<System.DateTime> fingreso { get; set; }
        public Nullable<System.DateTime> fmodificacion { get; set; }
        public Nullable<int> ctasareferencial { get; set; }
        public string operador { get; set; }
        public decimal margen { get; set; }
        public Nullable<bool> activo { get; set; }
        public Nullable<decimal> tasamaxima { get; set; }
    
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tcarsegmento tcarsegmento { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgentasareferencial tgentasareferencial { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgenfrecuencia tgenfrecuencia { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tmonsaldo tmonsaldo { get; set; }
    }
}
