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
    
    public partial class tnombeneficio: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public tnombeneficio()
        {
        }
    
        public long cbeneficio { get; set; }
        public Nullable<int> mesccatalogo { get; set; }
        public string mescdetalle { get; set; }
        public Nullable<int> tipoccatalogo { get; set; }
        public string tipocdetalle { get; set; }
        public Nullable<int> ingresoccatalogo { get; set; }
        public string ingresocdetalle { get; set; }
        public Nullable<System.DateTime> fpago { get; set; }
        public string nombre { get; set; }
        public bool porcentual { get; set; }
        public decimal valor { get; set; }
        public string descripcion { get; set; }
        public bool asignacion { get; set; }
        public bool aportepatrono { get; set; }
        public Nullable<bool> ingreso { get; set; }
        public bool estado { get; set; }
        public Nullable<System.DateTime> fingreso { get; set; }
        public Nullable<System.DateTime> fmodificacion { get; set; }
        public string cusuarioing { get; set; }
        public string cusuariomod { get; set; }
    
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgencatalogodetalle tgencatalogodetalle { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgencatalogodetalle tgencatalogodetalle1 { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgencatalogodetalle tgencatalogodetalle2 { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual ICollection<tnombeneficiopatrono> tnombeneficiopatrono { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual ICollection<tnombeneficiopatrono> tnombeneficiopatrono1 { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual ICollection<tnombeneficiopersona> tnombeneficiopersona { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual ICollection<tnomingreso> tnomingreso { get; set; }
    }
}