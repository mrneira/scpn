using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace util {
    public class AtlasException : Exception {
        public string Codigo { get; set; }
        public object[] parametros;

        public AtlasException(string codigo, string mensaje) : base(mensaje) {
            this.Codigo = codigo;
        }

        public AtlasException(string codigo, string mensaje, params object[] parametros) : base(mensaje) {
            this.Codigo = codigo;
            this.parametros = parametros;
        }
        public AtlasException(string codigo, string mensaje, System.Exception inner, params object[] parametros) : base(mensaje, inner) {
            this.Codigo = codigo;
            this.parametros = parametros;
        }

        //public AtlasException() : base() { }
        //public AtlasException(string message) : base(message) { }
        //public AtlasException(string message, System.Exception inner) : base(message, inner) { }

        // A constructor is needed for serialization when an
        // exception propagates from a remoting server to the client. 
        //protected AtlasException(System.Runtime.Serialization.SerializationInfo info,
        //    System.Runtime.Serialization.StreamingContext context)
        //{ }

    }
}
