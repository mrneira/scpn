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
    
    public partial class tcartransferenciapersona: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public tcartransferenciapersona()
        {
        }
    
        public int ctransferencia { get; set; }
        public long cpersona { get; set; }
        public int ccompania { get; set; }
        public Nullable<int> ftransferencia { get; set; }
        public string identificacion { get; set; }
        public string nombre { get; set; }
        public Nullable<decimal> monto { get; set; }
        public Nullable<decimal> montopago { get; set; }
        public Nullable<decimal> montodevolucion { get; set; }
        public string cusuarioing { get; set; }
        public Nullable<System.DateTime> fingreso { get; set; }
    
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tcartransferencia tcartransferencia { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual ICollection<tcartransferenciadetalle> tcartransferenciadetalle { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tperpersona tperpersona { get; set; }
    }
}
