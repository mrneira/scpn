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
    
    public partial class tbanusuariootpmovil: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        public string cusuario { get; set; }
        public string serial { get; set; }
        public string password { get; set; }
        public Nullable<System.DateTime> fcreacion { get; set; }
        public Nullable<System.DateTime> fcaducidad { get; set; }
        public string estado { get; set; }
        public string pin { get; set; }
    }
}