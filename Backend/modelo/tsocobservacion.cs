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
    
    public partial class tsocobservacion: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        public long ccodigo { get; set; }
        public long cpersona { get; set; }
        public int ccompania { get; set; }
        public string descripcion { get; set; }
        public int corden { get; set; }
        public System.DateTime forden { get; set; }
    
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tperpersona tperpersona { get; set; }
    }
}