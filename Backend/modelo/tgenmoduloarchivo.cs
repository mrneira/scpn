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
    
    public partial class tgenmoduloarchivo: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        public long carchivo { get; set; }
        public Nullable<int> cmodulo { get; set; }
        public Nullable<int> verreg { get; set; }
        public Nullable<long> optlock { get; set; }
        public Nullable<int> veractual { get; set; }
        public string cusuarioing { get; set; }
        public string cusuariomod { get; set; }
        public Nullable<System.DateTime> fingreso { get; set; }
        public Nullable<System.DateTime> fmodificacion { get; set; }
        public byte[] archivo { get; set; }
        public string extension { get; set; }
        public Nullable<long> tamanio { get; set; }
        public string nombre { get; set; }
        public string tipo { get; set; }
        public string descripcion { get; set; }
    
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgenmodulo tgenmodulo { get; set; }
    }
}
