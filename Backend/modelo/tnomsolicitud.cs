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
    
    public partial class tnomsolicitud: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public tnomsolicitud()
        {
        }
    
        public long csolicitud { get; set; }
        public Nullable<long> cfuncionario { get; set; }
        public Nullable<int> estadoccatalogo { get; set; }
        public string estadocdetalle { get; set; }
        public Nullable<bool> estado { get; set; }
        public Nullable<int> tipoccatalogo { get; set; }
        public string tipocdetalle { get; set; }
        public Nullable<long> cgesarchivo { get; set; }
        public Nullable<System.DateTime> fingreso { get; set; }
        public Nullable<System.DateTime> fmodificacion { get; set; }
        public string cusuarioing { get; set; }
        public string cusuariomod { get; set; }
        public Nullable<bool> arrhh { get; set; }
        public Nullable<bool> ajefe { get; set; }
        public Nullable<bool> adir { get; set; }
        public Nullable<long> cusuariorrh { get; set; }
        public Nullable<bool> finalizada { get; set; }
        public Nullable<long> cfuncionariojefe { get; set; }
        public Nullable<long> cfuncionarioejecutivo { get; set; }
        public string cusuarioapr { get; set; }
        public string observacion { get; set; }
        public string cusuariorrhh { get; set; }
        public Nullable<System.DateTime> faprobacion { get; set; }
        public Nullable<bool> aprobada { get; set; }
    
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgencatalogodetalle tgencatalogodetalle { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgencatalogodetalle tgencatalogodetalle1 { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgesarchivo tgesarchivo { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual ICollection<tnomhoraextra> tnomhoraextra { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual ICollection<tnompermiso> tnompermiso { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tthfuncionario tthfuncionario { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual ICollection<tnomvacacion> tnomvacacion { get; set; }
    }
}
