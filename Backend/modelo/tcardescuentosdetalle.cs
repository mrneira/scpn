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
    
    public partial class tcardescuentosdetalle: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        public int particion { get; set; }
        public string coperacion { get; set; }
        public long cpersona { get; set; }
        public Nullable<int> ccompania { get; set; }
        public Nullable<int> crelacion { get; set; }
        public Nullable<int> archivoinstitucioncodigo { get; set; }
        public string archivoinstituciondetalle { get; set; }
        public Nullable<decimal> monto { get; set; }
        public Nullable<int> frespuesta { get; set; }
        public Nullable<decimal> montorespuesta { get; set; }
        public Nullable<int> fpago { get; set; }
        public Nullable<decimal> montopago { get; set; }
        public string mensajepago { get; set; }
        public Nullable<int> fdevolucion { get; set; }
        public Nullable<decimal> montodevolucion { get; set; }
        public string mensajedevolucion { get; set; }
    
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tcarrelacionpersona tcarrelacionpersona { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgencatalogodetalle tgencatalogodetalle { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tperpersona tperpersona { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tcaroperacion tcaroperacion { get; set; }
    }
}