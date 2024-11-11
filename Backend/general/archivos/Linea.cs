using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;

namespace general.archivos
{
    public class Linea
    {
        /// <summary>
        /// numero de Ejecucion del Archivo 
        /// </summary>
        private int? numEjecucion;
        /// <summary>
        /// Request con el que se ejecuta la transaccion.
        /// </summary>
        private RqMantenimiento rqmantenimiento;
        /// <summary>
        /// Numero de linea del registro a procesar.
        /// </summary>
        private int numLinea;
        /// <summary>
        /// Datos de una linea del archivo.
        /// </summary>
        private string datosRegistro;
        /// <summary>
        /// Codigo del modulo.
        /// </summary>
        private int? cmodulo;
        /// <summary>
        /// Codigo de tipo de archivo.
        /// </summary>
        private int? ctipoarchivo;

        /// <summary>
        /// Clase que se encarga de procesar una linea de un archivo.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        /// <param name="numlinea">Numero de linea del archivo.</param>
        /// <param name="registro">Objeto que contiene datos de una linea del archivo.</param>
        public Linea(RqMantenimiento rqmantenimiento, int numlinea, string datosRegistro, int cmodulo,int ctipoarchivo)
        {
            this.rqmantenimiento = rqmantenimiento;
            this.numLinea = numlinea;
            this.datosRegistro = datosRegistro;
            this.cmodulo = cmodulo;
            this.ctipoarchivo = ctipoarchivo;
        }
        public Linea(RqMantenimiento rqmantenimiento, int numlinea, string datosRegistro, int numEjecucion, int cmodulo, int ctipoarchivo)
        {
            this.rqmantenimiento = rqmantenimiento;
            this.numLinea = numlinea;
            this.datosRegistro = datosRegistro;
            this.numEjecucion = numEjecucion;
            this.cmodulo = cmodulo;
            this.ctipoarchivo = ctipoarchivo;
        }


        public RqMantenimiento Rqmantenimiento { get => rqmantenimiento; set => rqmantenimiento = value; }
        public int NumLinea { get => numLinea; set => numLinea = value; }
        public string DatosRegistro { get => datosRegistro; set => datosRegistro = value; }
        public int? NumEjecucion { get => numEjecucion; set => numEjecucion = value; }
        public int? Cmodulo { get => cmodulo; set => cmodulo = value; }
        public int? Ctipoarchivo { get => ctipoarchivo; set => ctipoarchivo = value; }
    }

}
