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
    
    public partial class tnommatrizvacacion: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        public int cmatrizv { get; set; }
        public Nullable<long> cfuncionario { get; set; }
        public Nullable<long> anio { get; set; }
        public System.DateTime finicio { get; set; }
        public System.DateTime ffin { get; set; }
        public bool estado { get; set; }
        public string descripcion { get; set; }
    
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tthfuncionario tthfuncionario { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tnomparametro tnomparametro { get; set; }
    }
}