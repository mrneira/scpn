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
    
    public partial class tconcuentaporpagarmigrada: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public tconcuentaporpagarmigrada()
        {
        }
    
        public string cctaporpagarmigrada { get; set; }
        public Nullable<long> cpersona { get; set; }
        public string ccomprobante { get; set; }
        public Nullable<int> ccompania { get; set; }
        public string ccuentaafectacion { get; set; }
        public string tipocxp { get; set; }
        public Nullable<int> estadocxpccatalogo { get; set; }
        public string estadocxpcdetalle { get; set; }
        public Nullable<decimal> valorpagar { get; set; }
        public string cusuarioautorizacion { get; set; }
        public Nullable<System.DateTime> fautorizacion { get; set; }
        public string comentario { get; set; }
        public string cusuarioing { get; set; }
        public Nullable<System.DateTime> fingreso { get; set; }
        public string cusuariomod { get; set; }
        public Nullable<System.DateTime> fmodificacion { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual ICollection<tconcxpmigjudicdetalle> tconcxpmigjudicdetalle { get; set; }
    }
}
