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
    
    public partial class tthdocvinccontrato: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        public long ccontrato { get; set; }
        public long cfuncionario { get; set; }
        public int secuencia { get; set; }
        public Nullable<long> cplantilladocvinculacion { get; set; }
        public Nullable<long> responsablecfuncionario { get; set; }
        public string codigodocumento { get; set; }
        public string clausula { get; set; }
        public Nullable<System.DateTime> fechaemision { get; set; }
        public string cusuarioing { get; set; }
        public string cusuariomod { get; set; }
        public Nullable<System.DateTime> fingreso { get; set; }
        public Nullable<System.DateTime> fmodificacion { get; set; }
    
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tthcontrato tthcontrato { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tthplantilladocvinculacion tthplantilladocvinculacion { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tthfuncionario tthfuncionario { get; set; }
    }
}
