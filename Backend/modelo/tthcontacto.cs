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
    
    public partial class tthcontacto: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        public long cfuncionario { get; set; }
        public int secuencia { get; set; }
        public string primernombre { get; set; }
        public string segundonombre { get; set; }
        public string primerapellido { get; set; }
        public string segundoapellido { get; set; }
        public string telefonocelular { get; set; }
        public string telefonofijo { get; set; }
        public string direccion { get; set; }
        public Nullable<int> tipocontactoccatalogo { get; set; }
        public string tipocontactocdetalle { get; set; }
        public string empresaenquelabora { get; set; }
        public string telefonoempresa { get; set; }
    
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tgencatalogodetalle tgencatalogodetalle { get; set; }
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tthfuncionario tthfuncionario { get; set; }
    }
}
