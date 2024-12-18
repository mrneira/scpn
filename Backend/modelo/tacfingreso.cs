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
    
    public partial class tacfingreso: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public tacfingreso()
        {
        }
    
        public int cingreso { get; set; }
        public string cctaporpagar { get; set; }
        public string ccomprobante { get; set; }
        public Nullable<bool> contabilizar { get; set; }
        public Nullable<System.DateTime> fechaingreso { get; set; }
        public Nullable<System.DateTime> fechafactura { get; set; }
        public Nullable<long> cgesarchivo { get; set; }
        public Nullable<int> cpersonaproveedor { get; set; }
        public Nullable<int> cegresodevolucion { get; set; }
        public Nullable<long> optlock { get; set; }
        public Nullable<int> verreg { get; set; }
        public string facturanumero { get; set; }
        public string memoautorizacion { get; set; }
        public string memocodificacion { get; set; }
        public string ordendecompra { get; set; }
        public string numerooficio { get; set; }
        public bool tienekardex { get; set; }
        public bool eliminado { get; set; }
        public string comentario { get; set; }
        public string cusuarioavala { get; set; }
        public string cusuarioautoriza { get; set; }
        public string cusuariodevolucion { get; set; }
        public string cusuarioadmincontrato { get; set; }
        public Nullable<int> tipoingresoccatalogo { get; set; }
        public string tipoingresocdetalle { get; set; }
        public Nullable<int> estadoingresoccatalogo { get; set; }
        public string estadoingresocdetalle { get; set; }
        public Nullable<decimal> subtotalivacero { get; set; }
        public string porcentajeiva { get; set; }
        public Nullable<decimal> subtotaliva { get; set; }
        public Nullable<decimal> subtotalnosujetoiva { get; set; }
        public Nullable<decimal> subtotalsinimpuestos { get; set; }
        public Nullable<decimal> descuento { get; set; }
        public Nullable<decimal> ice { get; set; }
        public Nullable<decimal> iva { get; set; }
        public Nullable<decimal> propina { get; set; }
        public Nullable<decimal> valortotal { get; set; }
        public string cusuarioing { get; set; }
        public Nullable<System.DateTime> fingreso { get; set; }
        public string cusuariomod { get; set; }
        public Nullable<System.DateTime> fmodificacion { get; set; }
        public Nullable<bool> codificado { get; set; }
    
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgencatalogodetalle tgencatalogodetalle { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual ICollection<tacfingresodetalle> tacfingresodetalle { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgesarchivo tgesarchivo { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgencatalogodetalle tgencatalogodetalle1 { get; set; }
    }
}
