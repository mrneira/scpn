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
    
    public partial class tgarsaldoscontables: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        public int fcierre { get; set; }
        public int particion { get; set; }
        public int cmodulo { get; set; }
        public int cproducto { get; set; }
        public int ctipoproducto { get; set; }
        public string ctipogarantia { get; set; }
        public string ctipobien { get; set; }
        public string csaldo { get; set; }
        public Nullable<decimal> saldo { get; set; }
    
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgartipobien tgartipobien { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgentipoproducto tgentipoproducto { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tmonsaldo tmonsaldo { get; set; }
    }
}
