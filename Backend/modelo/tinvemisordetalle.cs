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
    
    public partial class tinvemisordetalle: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        public long cemisordetalle { get; set; }
        public Nullable<int> emisorccatalogo { get; set; }
        public string emisorcdetalle { get; set; }
        public Nullable<int> calificacionriesgoactualccatalogo { get; set; }
        public string calificacionriesgoactualcdetalle { get; set; }
        public Nullable<decimal> porcentajemaximoinversion { get; set; }
        public Nullable<int> sectorccatalogo { get; set; }
        public string sectorcdetalle { get; set; }
        public Nullable<System.DateTime> fingreso { get; set; }
        public string cusuarioing { get; set; }
        public Nullable<System.DateTime> fmodificacion { get; set; }
        public string cusuariomod { get; set; }
        public string nombrescontacto1 { get; set; }
        public string cargocontacto1 { get; set; }
        public string direccioncontacto1 { get; set; }
        public string telefonocontacto1 { get; set; }
        public string celularcontacto1 { get; set; }
        public string correocontacto1 { get; set; }
        public string nombrescontacto2 { get; set; }
        public string cargocontacto2 { get; set; }
        public string direccioncontacto2 { get; set; }
        public string telefonocontacto2 { get; set; }
        public string celularcontacto2 { get; set; }
        public string correocontacto2 { get; set; }
        public string faxcontacto1 { get; set; }
        public string faxcontacto2 { get; set; }
        public string identificacion { get; set; }
        public string cpais { get; set; }
        public Nullable<decimal> patrimonio { get; set; }
        public Nullable<decimal> capitalsocial { get; set; }
        public string tipoemcdetalle { get; set; }
        public Nullable<int> tipoemccatalogo { get; set; }
        public Nullable<int> enticalificadoraccatalogo { get; set; }
        public string enticalificadoracdetalle { get; set; }
        public Nullable<bool> banco { get; set; }
    
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgencatalogodetalle tgencatalogodetalle { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgencatalogodetalle tgencatalogodetalle1 { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgencatalogodetalle tgencatalogodetalle2 { get; set; }
    }
}
