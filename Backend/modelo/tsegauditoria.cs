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
    
    public partial class tsegauditoria: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        public int fecha { get; set; }
        public string tabla { get; set; }
        public int particion { get; set; }
        public long hash { get; set; }
        public string pkregistro { get; set; }
        public string cusuario { get; set; }
        public string cterminal { get; set; }
        public Nullable<int> cagencia { get; set; }
        public Nullable<int> csucursal { get; set; }
        public Nullable<int> ccompania { get; set; }
        public Nullable<int> ctransaccion { get; set; }
        public Nullable<int> cmodulo { get; set; }
        public Nullable<System.DateTime> freal { get; set; }
        public string mensaje { get; set; }
        public string valorregistro { get; set; }
        public string valoretiqueta { get; set; }
    
    [JsonIgnore]
    [IgnoreDataMember]
        public virtual tsegusuario tsegusuario { get; set; }
    }
}
