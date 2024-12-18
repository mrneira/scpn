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
    
    public partial class tsgspoliza: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        public string coperacioncartera { get; set; }
        public string coperaciongarantia { get; set; }
        public int secuencia { get; set; }
        public Nullable<int> ctiposeguro { get; set; }
        public Nullable<int> cpago { get; set; }
        public string cusuarioing { get; set; }
        public Nullable<bool> pagodirecto { get; set; }
        public Nullable<long> cgesarchivo { get; set; }
        public Nullable<bool> registranovedad { get; set; }
        public Nullable<int> ccatalogoestado { get; set; }
        public string cdetalleestado { get; set; }
        public Nullable<int> fingreso { get; set; }
        public Nullable<decimal> valorasegurado { get; set; }
        public Nullable<decimal> valorprimaretenida { get; set; }
        public Nullable<bool> renovacion { get; set; }
        public Nullable<decimal> valorprima { get; set; }
        public string numeropoliza { get; set; }
        public Nullable<int> finicio { get; set; }
        public Nullable<int> fvencimiento { get; set; }
        public long numerofactura { get; set; }
        public Nullable<decimal> valorfactura { get; set; }
        public Nullable<int> femision { get; set; }
        public Nullable<int> cuotainicio { get; set; }
        public Nullable<int> numerocuotas { get; set; }
        public Nullable<decimal> valordevolucion { get; set; }
        public Nullable<int> fdevolucion { get; set; }
        public string comentario { get; set; }
        public string coperacioncarteraanterior { get; set; }
    
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgesarchivo tgesarchivo { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tsgspago tsgspago { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tsgstiposeguro tsgstiposeguro { get; set; }
    }
}
