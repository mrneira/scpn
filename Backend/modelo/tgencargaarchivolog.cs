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
    
    public partial class tgencargaarchivolog: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        public long clog { get; set; }
        public int cmodulo { get; set; }
        public int ctransaccion { get; set; }
        public string tipoarchivo { get; set; }
        public string nombre { get; set; }
        public System.DateTime fcarga { get; set; }
        public System.DateTime freal { get; set; }
        public string estado { get; set; }
        public int registrosok { get; set; }
        public int registroserror { get; set; }
        public int registrostotal { get; set; }
        public Nullable<decimal> valor1 { get; set; }
        public Nullable<decimal> valor2 { get; set; }
        public Nullable<decimal> valor3 { get; set; }
        public string comentario { get; set; }
        public Nullable<System.DateTime> fingreso { get; set; }
        public string cusuarioing { get; set; }
        public Nullable<System.DateTime> fmodificacion { get; set; }
        public string cusuariomod { get; set; }
    }
}