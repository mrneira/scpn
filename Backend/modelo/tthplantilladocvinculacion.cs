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
    
    public partial class tthplantilladocvinculacion: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public tthplantilladocvinculacion()
        {
        }
    
        public long cplantilladocvinculacion { get; set; }
        public Nullable<long> ctipovinculacion { get; set; }
        public string documento { get; set; }
        public Nullable<int> orden { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual ICollection<tthdocvinccontrato> tthdocvinccontrato { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tthtipovinculacion tthtipovinculacion { get; set; }
    }
}