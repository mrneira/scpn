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
    
    public partial class tgenentidad: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        public string tname { get; set; }
        public string entity { get; set; }
        public string project { get; set; }
        public string pac { get; set; }
        public string javaextends { get; set; }
        public string javaimplements { get; set; }
        public string createreferences { get; set; }
        public string optimisticlocking { get; set; }
        public string versionreg { get; set; }
        public string autoimport { get; set; }
        public string log { get; set; }
        public string cachetrans { get; set; }
        public string secautomatica { get; set; }
        public string retornapk { get; set; }
        public Nullable<int> tid { get; set; }
        public string camposecuencia { get; set; }
        public string codigosecuenciabase { get; set; }
        public string camposecuenciabase { get; set; }
        public string esquema { get; set; }
    }
}
