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
    
    public partial class tpreaporte: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        public long caporte { get; set; }
        public long cpersona { get; set; }
        public int ccompania { get; set; }
        public int fechaaporte { get; set; }
        public Nullable<decimal> sueldo { get; set; }
        public Nullable<decimal> aportepatronal { get; set; }
        public Nullable<decimal> aportepersonal { get; set; }
        public Nullable<decimal> ajuste { get; set; }
        public string descripcion { get; set; }
        public Nullable<long> comprobantecontable { get; set; }
        public string cusuariocrea { get; set; }
        public Nullable<System.DateTime> fechahoracrea { get; set; }
        public Nullable<decimal> interesgenerado { get; set; }
        public Nullable<bool> activo { get; set; }
        public Nullable<bool> valido { get; set; }
        public Nullable<decimal> ajustepatronal { get; set; }
    }
}
