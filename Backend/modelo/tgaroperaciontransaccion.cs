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
    
    public partial class tgaroperaciontransaccion: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        public string mensaje { get; set; }
        public string coperacion { get; set; }
        public int particion { get; set; }
        public int fcontable { get; set; }
        public int ftrabajo { get; set; }
        public System.DateTime freal { get; set; }
        public Nullable<int> ctransaccion { get; set; }
        public Nullable<int> cmodulo { get; set; }
        public string cusuario { get; set; }
        public Nullable<int> ccompania { get; set; }
        public decimal monto { get; set; }
        public string reverso { get; set; }
    
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgentransaccion tgentransaccion { get; set; }
    }
}
