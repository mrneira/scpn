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
    
    public partial class tcarsolicitudpersona: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public tcarsolicitudpersona()
        {
        }
    
        public long csolicitud { get; set; }
        public long cpersona { get; set; }
        public int ccompania { get; set; }
        public int crelacion { get; set; }
    
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tcarrelacionpersona tcarrelacionpersona { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual ICollection<tcarsolicitudcapacidadpago> tcarsolicitudcapacidadpago { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tperpersona tperpersona { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgensolicitud tgensolicitud { get; set; }
    }
}
