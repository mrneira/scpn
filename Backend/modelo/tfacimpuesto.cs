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
    
    public partial class tfacimpuesto: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public tfacimpuesto()
        {
        }
    
        public int cimpuesto { get; set; }
        public string cpais { get; set; }
        public Nullable<int> cpadre { get; set; }
        public bool eshoja { get; set; }
        public string nombre { get; set; }
        public string codimpuesto { get; set; }
        public string codporcentaje { get; set; }
        public Nullable<decimal> porcentaje { get; set; }
        public string codigocontable { get; set; }
        public Nullable<bool> activo { get; set; }
        public string descripcion { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual ICollection<tfacfacturadetalle> tfacfacturadetalle { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual ICollection<tfacfacturadetalle> tfacfacturadetalle1 { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual ICollection<tfacfacturadetalle> tfacfacturadetalle2 { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgenpais tgenpais { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual ICollection<tfacproducto> tfacproducto { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual ICollection<tfacproducto> tfacproducto1 { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual ICollection<tfacproducto> tfacproducto2 { get; set; }
    }
}
