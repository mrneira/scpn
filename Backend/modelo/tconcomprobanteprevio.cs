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
    
    public partial class tconcomprobanteprevio: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        public int fcontable { get; set; }
        public int particion { get; set; }
        public int ccompania { get; set; }
        public string ccuenta { get; set; }
        public int cagencia { get; set; }
        public int csucursal { get; set; }
        public bool debito { get; set; }
        public string cclase { get; set; }
        public string cmoneda { get; set; }
        public int ctransaccion { get; set; }
        public int cmodulo { get; set; }
        public string cmonedaoficial { get; set; }
        public Nullable<decimal> monto { get; set; }
        public Nullable<decimal> montooficial { get; set; }
        public int cmoduloproducto { get; set; }
        public int cproducto { get; set; }
        public int ctipoproducto { get; set; }
        public string cregistro { get; set; }
    
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tconcatalogo tconcatalogo { get; set; }
    }
}
