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
    
    public partial class tcardescuentoscarga: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        public int particion { get; set; }
        public int fcarga { get; set; }
        public int archivoinstitucioncodigo { get; set; }
        public string archivoinstituciondetalle { get; set; }
        public int cproductoarchivo { get; set; }
        public long cpersona { get; set; }
        public string identificacion { get; set; }
        public string nombre { get; set; }
        public decimal monto { get; set; }
    }
}