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
    
    public partial class tpptsaldoscierrepi: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        public int fcierre { get; set; }
        public string cpartidaingreso { get; set; }
        public int particion { get; set; }
        public int aniofiscal { get; set; }
        public string cclasificador { get; set; }
        public int ccompania { get; set; }
        public string padre { get; set; }
        public int nivel { get; set; }
        public bool movimiento { get; set; }
        public string nombre { get; set; }
        public Nullable<decimal> valormensual { get; set; }
        public Nullable<decimal> numeromeses { get; set; }
        public Nullable<decimal> montototal { get; set; }
        public Nullable<decimal> valordevengado { get; set; }
        public Nullable<decimal> porcenparticipacion { get; set; }
        public Nullable<decimal> porcenejecucion { get; set; }
    
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tpptpartidaingreso tpptpartidaingreso { get; set; }
    }
}
