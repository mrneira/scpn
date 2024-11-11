using System;

namespace facturacionelectronica.comp.consulta.entidades
{
    /// <summary>
    /// Entidad de autorización Mensaje de documentos
    /// </summary>
    [Serializable]
    public class EntidadAutorizacionMensaje
    {
        public string Identificador;
        public string InformacionAdicional;
        public string Mensaje;
        public string Tipo;

        public EntidadAutorizacionMensaje()
        {
        }
    }
}
