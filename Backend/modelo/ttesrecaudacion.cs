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
    
    public partial class ttesrecaudacion: AbstractDto,IBean
    {
    public virtual object Clone() {
    			return this.MemberwiseClone();
            }
        public long crecaudacion { get; set; }
        public int fcontable { get; set; }
        public int cmodulo { get; set; }
        public int ctransaccion { get; set; }
        public decimal totalcobro { get; set; }
        public string cestado { get; set; }
        public Nullable<int> fgeneracion { get; set; }
        public Nullable<long> registrosenviado { get; set; }
        public Nullable<long> registrosrecibido { get; set; }
        public string cusuarioing { get; set; }
        public Nullable<System.DateTime> fingreso { get; set; }
        public string cusuariomod { get; set; }
        public Nullable<System.DateTime> fmodificacion { get; set; }
        public string cusuarioautoriza { get; set; }
        public Nullable<System.DateTime> fautoriza { get; set; }
        public string cusuariogenera { get; set; }
        public Nullable<System.DateTime> fgenera { get; set; }
        public string cusuariodescarga { get; set; }
        public Nullable<System.DateTime> fdescarga { get; set; }
        public string cusuarioaplica { get; set; }
        public Nullable<System.DateTime> faplica { get; set; }
        public Nullable<int> finicio { get; set; }
        public Nullable<int> ffin { get; set; }
    }
}
