using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace util {

    /// <summary>
    /// Clase que se encarga de generar y crear archivos
    /// </summary>
    /// <author>amerchan</author>
    [Serializable]
    public class Archivo {

        /// <summary>
        /// Codigo del archivo, es el pk de la tabla en la que se almacebna los datos.
        /// </summary>
        private long? codigo;

        /// <summary>
        /// Nombre fisico del archivo.
        /// </summary>
        private string nombre;

        /// <summary>
        /// Contenido en bytes del archivo.
        /// </summary>
        private byte[] archivobytes;

        /// <summary>
        /// Extension del archivo ejemplo doc, xls, gif, png etc.
        /// </summary>
        private string extension;

        /// <summary>
        /// Tamanio del archivo en kb.
        /// </summary>
        private long? tamanio;

        /// <summary>
        /// Contenttype se pone en el servelet de respuesta en una petición
        /// </summary>
        private string tipoContenido;

        public long? Codigo { get => codigo; set => codigo = value; }
        public string Nombre { get => nombre; set => nombre = value; }
        public byte[] Archivobytes { get => archivobytes; set => archivobytes = value; }
        public string Extension { get => extension; set => extension = value; }
        public long? Tamanio { get => tamanio; set => tamanio = value; }
        public string TipoContenido { get => tipoContenido; set => tipoContenido = value; }
    }
}
