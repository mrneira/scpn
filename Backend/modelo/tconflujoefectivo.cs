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
    
    public partial class tconflujoefectivo: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        public string ccuenta { get; set; }
        public int aniofin { get; set; }
        public int anioinicio { get; set; }
        public Nullable<decimal> saldoinicial { get; set; }
        public Nullable<decimal> saldofinal { get; set; }
        public Nullable<decimal> variacion { get; set; }
        public Nullable<decimal> ajustedebe { get; set; }
        public Nullable<decimal> ajustehaber { get; set; }
        public Nullable<decimal> variacionajustada { get; set; }
        public Nullable<decimal> estadofuente { get; set; }
        public Nullable<decimal> estadouso { get; set; }
        public Nullable<decimal> flujodeefectivo { get; set; }
        public string tipo { get; set; }
        public Nullable<decimal> clientes { get; set; }
        public Nullable<decimal> proveedores { get; set; }
        public Nullable<decimal> empleados { get; set; }
        public Nullable<decimal> impuestorenta { get; set; }
        public Nullable<decimal> otros { get; set; }
        public Nullable<decimal> inversion { get; set; }
        public Nullable<decimal> financiamiento { get; set; }
        public Nullable<decimal> efectivo { get; set; }
        public Nullable<int> tipoplanccatalogo { get; set; }
        public string tipoplancdetalle { get; set; }
    }
}