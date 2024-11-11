using modelo.interfaces;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using util;
using util.thread;

namespace util.dto.lote {

    /// <summary>
    /// Clase que contiene la cabencera de un mensaje utilizado en la ejecucion de tareas previas en lotes.
    /// </summary>
    public class RequestModulo: Request {

        /// <summary>
        /// Codigo de compania en la cual esta ejecutando transacciones el usuario.
        /// </summary>
        private int ccompania;

        /// <summary>
        /// Fecha contable de la aplicacion.
        /// </summary>
        private int fconatble;

        /// <summary>
        /// Fecha de trabajo de la aplicacion.
        /// </summary>
        private Nullable<int> ftrabajo;

        /// <summary>
        /// Proxima fecha contable.
        /// </summary>
        private Nullable<int> fconatbleanterior;

        /// <summary>
        /// Proxima fecha contable.
        /// </summary>
        private Nullable<int> fconatbleproxima;

        /// <summary>
        /// Fecha del sistema en la que se ejecuta el lote.
        /// </summary>
        private int fejecucion;

        /// <summary>
        /// Codigo de lote.
        /// </summary>
        private string clote;

        /// <summary>
        /// Modulo asociado al lote.
        /// </summary>
        private int cmodulo;

        /// <summary>
        /// Numero de mensaje que se asocia a un lote.
        /// </summary>
        private string mensaje;

        /// <summary>
        /// Numero de veces en la que se ejecuta el lote para la fecha de ejecucion y codigo de lote.
        /// </summary>
        private int numeroejecucion;

        /// <summary>
        /// secuencia de ejecucion, cuando es horizontal aumenta la secuencia por cada tarea
        /// </summary>
        private int secuenciaresultado;

        /// <summary>
        /// Codigo de tarea cuandola ejecucion es horizontal.
        /// </summary>
        private string ctareahorizontal;

        /// <summary>
        /// Codigo generico de tipo long.
        /// </summary>
        private long? cregistronumero;

        /// <summary>
        /// Crea una instancia de RequestModulo.
        /// </summary>
        public RequestModulo() {
        }

        public RequestOperacion ToRequestOperacion() {
            RequestOperacion ro = new RequestOperacion();
            ro.Fconatble = fconatble;
		    ro.Fconatbleanterior = fconatbleanterior;
		    ro.Fconatbleproxima = fconatbleproxima;
		    ro.Ftrabajo = ftrabajo;
		    ro.Clote = clote;
		    ro.Cmodulo = cmodulo;
		    ro.Numeroejecucion = numeroejecucion;
            ro.Ctareahorizontal = this.ctareahorizontal;
            ro.Cregistronumero = cregistronumero;
            return ro;
	    }

        public int Ccompania { get => ccompania; set => ccompania = value; }
        public int Fconatble { get => fconatble; set => fconatble = value; }
        public int? Ftrabajo { get => ftrabajo; set => ftrabajo = value; }
        public int? Fconatbleanterior { get => fconatbleanterior; set => fconatbleanterior = value; }
        public int? Fconatbleproxima { get => fconatbleproxima; set => fconatbleproxima = value; }
        public int Fejecucion { get => fejecucion; set => fejecucion = value; }
        public string Clote { get => clote; set => clote = value; }
        public int Cmodulo { get => cmodulo; set => cmodulo = value; }
        public string Mensaje { get => mensaje; set => mensaje = value; }
        public int Numeroejecucion { get => numeroejecucion; set => numeroejecucion = value; }
        public int Secuenciaresultado { get => secuenciaresultado; set => secuenciaresultado = value; }
        public string Ctareahorizontal { get => ctareahorizontal; set => ctareahorizontal = value; }
        public long? Cregistronumero { get => cregistronumero; set => cregistronumero = value; }
    }
}
