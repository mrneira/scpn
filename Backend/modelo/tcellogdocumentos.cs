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
    
    public partial class tcellogdocumentos: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        public long clog { get; set; }
        public string tipodocumento { get; set; }
        public string numerodocumento { get; set; }
        public Nullable<int> estado { get; set; }
        public string mensaje { get; set; }
        public string autorizacion { get; set; }
        public string clavedeacceso { get; set; }
        public Nullable<bool> esreenvio { get; set; }
        public byte[] xmlfirmado { get; set; }
        public string ambiente { get; set; }
        public string tipoemision { get; set; }
        public string cusuarioing { get; set; }
        public Nullable<System.DateTime> fingreso { get; set; }
        public string cusuariomod { get; set; }
        public Nullable<System.DateTime> fmodificacion { get; set; }
    }
}
