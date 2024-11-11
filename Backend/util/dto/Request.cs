using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto;
using util.dto.consulta;

namespace util.dto {
    public class Request : RequestBase {

        /// <summary>
        /// Objeto que contiene la respuesta de ejecucion de un servicio.
        /// </summary>
        private Response response;
        /// <summary>
        /// Objeto que contiene la definicion de una transaccion que se esta ejecutando.
        /// </summary>
        private Object tgentransaccion;
        /// <summary>
        /// Objeto que contiene la definicion de una transaccion que se esta ejecutando.
        /// </summary>
        private Object tgenfechacontable;

        /// <summary>
        /// Map que contiene objetos necesarios para ejecutar una consulta.
        /// </summary>
        private Dictionary<string, Object> mtablasrequest = new Dictionary<string, Object>();

        /// <summary>
        /// Map que contiene objetos necesarios para ejecutar una consulta.
        /// </summary>
        private Dictionary<string, DtoConsulta> mconsulta = new Dictionary<string, DtoConsulta>();

        /// <summary>
        /// Map que contiene objetos a insertar, actualizar y modificar en la base de datos.
        /// </summary>
        //private Dictionary<string, TablaDto> mmantenimiento = new Dictionary<string, TablaDto>();

        public object Tgentransaccion { get => tgentransaccion; set => tgentransaccion = value; }
        public object Tgenfechacontable { get => tgenfechacontable; set => tgenfechacontable = value; }
        public Dictionary<string, object> Mtablasrequest { get => mtablasrequest; set => mtablasrequest = value; }
        public Dictionary<string, DtoConsulta> Mconsulta { get => mconsulta; set => mconsulta = value; }
        public Response Response { get => response; set => response = value; }





    }
}
