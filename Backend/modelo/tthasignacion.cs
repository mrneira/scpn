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
    
    public partial class tthasignacion: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public tthasignacion()
        {
        }
    
        public long cevaluacion { get; set; }
        public Nullable<long> optlock { get; set; }
        public long cfuncionario { get; set; }
        public long jefecfuncionario { get; set; }
        public long cperiodo { get; set; }
        public bool estado { get; set; }
        public string comentario { get; set; }
        public Nullable<System.DateTime> fingresof { get; set; }
        public Nullable<bool> finalizada { get; set; }
        public Nullable<bool> periodoprueba { get; set; }
        public System.DateTime fingreso { get; set; }
        public Nullable<System.DateTime> fmodificacion { get; set; }
        public string cusuarioing { get; set; }
        public string cusuariomod { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual ICollection<tthasignacionresp> tthasignacionresp { get; set; }
    }
}
