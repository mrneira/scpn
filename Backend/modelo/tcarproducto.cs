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
    
    public partial class tcarproducto: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public tcarproducto()
        {
        }
    
        public int cmodulo { get; set; }
        public int cproducto { get; set; }
        public int ctipoproducto { get; set; }
        public int verreg { get; set; }
        public Nullable<long> optlock { get; set; }
        public Nullable<int> veractual { get; set; }
        public string nombre { get; set; }
        public Nullable<bool> activo { get; set; }
        public string cusuarioing { get; set; }
        public string cusuariomod { get; set; }
        public Nullable<System.DateTime> fingreso { get; set; }
        public Nullable<System.DateTime> fmodificacion { get; set; }
        public string cbasecalculo { get; set; }
        public Nullable<int> cfrecuecia { get; set; }
        public string corigenfondos { get; set; }
        public string cdestinofondos { get; set; }
        public string ctipocredito { get; set; }
        public Nullable<int> periodicidadcapital { get; set; }
        public Nullable<bool> cobrovertical { get; set; }
        public Nullable<bool> tasareajustable { get; set; }
        public Nullable<int> numerocuotasreajuste { get; set; }
        public Nullable<bool> mantieneplazo { get; set; }
        public Nullable<bool> precancelacion { get; set; }
        public Nullable<bool> exigegarantia { get; set; }
        public Nullable<decimal> porcentajegarantia { get; set; }
        public Nullable<int> mincuotaspagoextraordinario { get; set; }
        public Nullable<int> ctabla { get; set; }
        public Nullable<int> mesnogeneracuota { get; set; }
        public Nullable<decimal> montominimo { get; set; }
        public Nullable<decimal> montomaximo { get; set; }
        public Nullable<bool> tasasegmento { get; set; }
        public string csegmento { get; set; }
        public Nullable<bool> tasasegmentofrec { get; set; }
        public Nullable<bool> gracia { get; set; }
        public Nullable<bool> absorberoperaciones { get; set; }
        public Nullable<bool> montoporaportaciones { get; set; }
        public Nullable<decimal> porcentajeaportaciones { get; set; }
        public Nullable<bool> productoconyuge { get; set; }
        public Nullable<bool> requieregarante { get; set; }
        public Nullable<bool> renovacion { get; set; }
        public Nullable<decimal> porcentajerenovacion { get; set; }
        public Nullable<bool> desembolsomasivo { get; set; }
        public Nullable<bool> capacidadconyuge { get; set; }
        public Nullable<int> cflujo { get; set; }
        public Nullable<bool> consolidado { get; set; }
        public Nullable<bool> educativo { get; set; }
        public Nullable<bool> aprobarsupervisor { get; set; }
        public Nullable<bool> convenio { get; set; }
        public Nullable<int> cconvenio { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual ICollection<tcarproductopermitidos> tcarproductopermitidos { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgenbasecalculo tgenbasecalculo { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgenfrecuencia tgenfrecuencia { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tcartipotablaamortizacion tcartipotablaamortizacion { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgenproducto tgenproducto { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tcarsegmento tcarsegmento { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgentipocredito tgentipocredito { get; set; }
    }
}
