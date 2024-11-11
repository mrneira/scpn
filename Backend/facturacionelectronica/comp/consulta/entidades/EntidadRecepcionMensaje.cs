using System;

namespace facturacionelectronica.comp.consulta.entidades
{
    /// <summary>
    /// Entidad de recepción de mensajes de documentos
    /// </summary>
    [Serializable]
    public class EntidadRecepcionMensaje
    {
        public string Identificador;
        public string InformacionAdicional;
        public string Mensaje;
        public string Tipo;

        public EntidadRecepcionMensaje()
        {
        }
    }
}
