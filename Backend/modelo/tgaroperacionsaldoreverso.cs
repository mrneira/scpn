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
    
    public partial class tgaroperacionsaldoreverso: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        public string mensaje { get; set; }
        public string coperacion { get; set; }
        public Nullable<decimal> saldo { get; set; }
        public Nullable<int> ftrabajo { get; set; }
        public Nullable<int> fvigencia { get; set; }
        public string mensajerecuperar { get; set; }
    }
}
