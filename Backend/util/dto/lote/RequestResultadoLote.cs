
namespace util.dto.lote {

    /// <summary>
    /// Clase que contiene el request para actualizar resultados de ejecucion de lotes.
    /// </summary>
    public class RequestResultadoLote {

        /// <summary>
        /// Codigo de compania en la cual esta ejecutando transacciones el usuario.
        /// </summary>
        private int ccompania;

        /// <summary>
        /// Fecha contable de la aplicacion.
        /// </summary>
        private int fconatble;

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
        /// Codigo de usuario que ejecuta el lote.
        /// </summary>
        private string cusuario;

        /// <summary>
        /// Modulo asociado al lote.
        /// </summary>
        private int cmodulotransaccionejecucion;

        /// <summary>
        /// Modulo asociado al lote.
        /// </summary>
        private int ctransaccionejecucion;

        /// <summary>
        /// Numero de registros a procesar
        /// </summary>
        private int total;

        /// <summary>
        /// Numero de registros procesados con exito.
        /// </summary>
        private int totalexito;

        /// <summary>
        /// Numero de registros procesados con errores.
        /// </summary>
        private int totalerror;

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
        /// Filtros usados en el proceso batch.
        /// </summary>
        private string filtros;




        /// <summary>
        /// Crea una instancia de RequestModulo.
        /// </summary>
        public RequestResultadoLote() {
        }

        public int Ccompania { get => ccompania; set => ccompania = value; }
        public int Fconatble { get => fconatble; set => fconatble = value; }
        public string Clote { get => clote; set => clote = value; }
        public int Cmodulo { get => cmodulo; set => cmodulo = value; }
        public string Mensaje { get => mensaje; set => mensaje = value; }
        public string Cusuario { get => cusuario; set => cusuario = value; }
        public int Cmodulotransaccionejecucion { get => cmodulotransaccionejecucion; set => cmodulotransaccionejecucion = value; }
        public int Ctransaccionejecucion { get => ctransaccionejecucion; set => ctransaccionejecucion = value; }
        public int Total { get => total; set => total = value; }
        public int Totalexito { get => totalexito; set => totalexito = value; }
        public int Totalerror { get => totalerror; set => totalerror = value; }
        public int Numeroejecucion { get => numeroejecucion; set => numeroejecucion = value; }
        public string Filtros { get => filtros; set => filtros = value; }
        public int Secuenciaresultado { get => secuenciaresultado; set => secuenciaresultado = value; }
        public string Ctareahorizontal { get => ctareahorizontal; set => ctareahorizontal = value; }
    }
}
