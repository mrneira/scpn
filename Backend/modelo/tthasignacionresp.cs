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
    
    public partial class tthasignacionresp: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public tthasignacionresp()
        {
        }
    
        public long casignacion { get; set; }
        public Nullable<long> optlock { get; set; }
        public long cfuncionario { get; set; }
        public Nullable<long> jefecfuncionario { get; set; }
        public int cinfoempresa { get; set; }
        public long cversion { get; set; }
        public bool finalizada { get; set; }
        public Nullable<long> cevaluacion { get; set; }
        public Nullable<bool> periodoprueba { get; set; }
        public decimal caperiodoprueba { get; set; }
        public decimal calidadoportunidad { get; set; }
        public decimal conocimientoespecifico { get; set; }
        public decimal competenciatecnica { get; set; }
        public decimal competenciaconductual { get; set; }
        public decimal sancionesadministrativas { get; set; }
        public decimal pcaperiodoprueba { get; set; }
        public decimal pcalidadoportunidad { get; set; }
        public decimal pconocimientoespecifico { get; set; }
        public decimal pcompetenciatecnica { get; set; }
        public decimal pcompetenciaconductual { get; set; }
        public decimal psancionesadministrativas { get; set; }
        public decimal calificacion { get; set; }
        public long cdepartamento { get; set; }
        public bool direstado { get; set; }
        public bool aprobada { get; set; }
        public bool diraprobado { get; set; }
        public long ccargo { get; set; }
        public long cgrupo { get; set; }
        public Nullable<long> cgesarchivo { get; set; }
        public Nullable<long> ccalificacion { get; set; }
        public Nullable<long> cperiodo { get; set; }
        public Nullable<decimal> promedio { get; set; }
        public string comentario { get; set; }
        public Nullable<System.DateTime> fevaluacion { get; set; }
        public System.DateTime fingreso { get; set; }
        public Nullable<System.DateTime> fmodificacion { get; set; }
        public string cusuarioing { get; set; }
        public string cusuariomod { get; set; }
    
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tcelinfoempresa tcelinfoempresa { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgesarchivo tgesarchivo { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tthasignacion tthasignacion { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual ICollection<tthasignacionconductuales> tthasignacionconductuales { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual ICollection<tthasignacionctecnicas> tthasignacionctecnicas { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual ICollection<tthasignaciondetalle> tthasignaciondetalle { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual ICollection<tthasignacionperfil> tthasignacionperfil { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual ICollection<tthasignacionpintermedio> tthasignacionpintermedio { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual ICollection<tthasignacionrel> tthasignacionrel { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tthevaluacionperiodo tthevaluacionperiodo { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tthcalificacioncualitativa tthcalificacioncualitativa { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tthgrupoocupacional tthgrupoocupacional { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual ICollection<tthasignacionsancion> tthasignacionsancion { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tthdepartamento tthdepartamento { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tthcargo tthcargo { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tthevaluacionversion tthevaluacionversion { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tthfuncionario tthfuncionario { get; set; }
    }
}
