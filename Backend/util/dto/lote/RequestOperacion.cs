using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace util {

    public class RequestOperacion : Dictionary<string, object>, ICloneable {


        /// <summary>
        /// Número de cuenta a la cual se va a ejecutar el proceso de fin de dia.
        /// </summary>
        private String coperacion;

        /// <summary>
        /// Fecha contable de la aplicacion.
        /// </summary>
        private int? fconatble;

        /// <summary>
        /// Fecha de trabajo de la aplicacion.
        /// </summary>
        private int? ftrabajo;

        /// <summary>
        /// Fecha contable anterior a la fecha contable.
        /// </summary>
        private int? fconatbleanterior;

        /// <summary>
        /// Proxima fecha contable
        /// </summary>
        private int? fconatbleproxima;

        /// <summary>
        /// Codigo de lote.
        /// </summary>
        private String clote;

        /// <summary>
        /// Modulo asociado al lote.
        /// </summary>
        private int? cmodulo;

        /// <summary>
        /// Numero de hilo con el cual se ejecuta el proceso batch.
        /// </summary>
        private int? numerohilo;

        /// <summary>
        /// Numero de veces en la que se ejecuta el lote para la fecha de ejecucion y codigo de lote.
        /// </summary>
        private int? numeroejecucion;

        /// <summary>
        /// Numero de registro a procesar ejemplo sucursal + oficina utilizado para generar comprobantes contables.
        /// </summary>
        private String cregistro;

        /// <summary>
        /// Secuenta de registro dentro del resultset que se ejecuta.
        /// </summary>
        private int? secuencia;

        /// <summary>
        /// Codigo de tarea cuandola ejecucion es horizontal.
        /// </summary>
        private string ctareahorizontal;

        /// <summary>
        /// Codigo generico de tipo long.
        /// </summary>
        private long? cregistronumero;

        public string Coperacion { get => coperacion; set => coperacion = value; }
        public int? Fconatble { get => fconatble; set => fconatble = value; }
        public int? Ftrabajo { get => ftrabajo; set => ftrabajo = value; }
        public int? Fconatbleanterior { get => fconatbleanterior; set => fconatbleanterior = value; }
        public int? Fconatbleproxima { get => fconatbleproxima; set => fconatbleproxima = value; }
        public string Clote { get => clote; set => clote = value; }
        public int? Cmodulo { get => cmodulo; set => cmodulo = value; }
        public int? Numerohilo { get => numerohilo; set => numerohilo = value; }
        public int? Numeroejecucion { get => numeroejecucion; set => numeroejecucion = value; }
        public string Cregistro { get => cregistro; set => cregistro = value; }
        public int? Secuencia { get => secuencia; set => secuencia = value; }
        public string Ctareahorizontal { get => ctareahorizontal; set => ctareahorizontal = value; }
        public long? Cregistronumero { get => cregistronumero; set => cregistronumero = value; }

        public virtual object Clone() {
            RequestOperacion obj = (RequestOperacion)this.MemberwiseClone();
            return obj;
        }

    }
}
