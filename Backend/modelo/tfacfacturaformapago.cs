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
    
    public partial class tfacfacturaformapago: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        public long cfactura { get; set; }
        public string cformapago { get; set; }
        public int csecuencia { get; set; }
        public Nullable<int> cmedida { get; set; }
        public string nombre { get; set; }
        public string numdocumento { get; set; }
        public Nullable<decimal> monto { get; set; }
        public Nullable<int> valormedida { get; set; }
    
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tfacfactura tfacfactura { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tfacformapago tfacformapago { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgenunidadmedida tgenunidadmedida { get; set; }
    }
}
