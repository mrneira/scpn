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
    
    public partial class tcelcertificado: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        public string ccertificado { get; set; }
        public Nullable<System.DateTime> fechainicio { get; set; }
        public Nullable<System.DateTime> fechafin { get; set; }
        public string clave { get; set; }
        public byte[] firma { get; set; }
        public string nombrecertificado { get; set; }
        public string extension { get; set; }
        public Nullable<bool> activo { get; set; }
        public Nullable<System.DateTime> fingreso { get; set; }
        public string cusuarioing { get; set; }
        public Nullable<System.DateTime> fmodificacion { get; set; }
        public string cusuariomod { get; set; }
    }
}