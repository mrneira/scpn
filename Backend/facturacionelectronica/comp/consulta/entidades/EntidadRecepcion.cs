using System;

namespace facturacionelectronica.comp.consulta.entidades
{
    /// <summary>
    /// Entidad de recepción de documentos
    /// </summary>
    [Serializable]
    public class EntidadRecepcion
    {
        public string Estado;
        public string ClaveAcceso;
        public bool Reenvio;

        public EntidadRecepcionMensaje[] Mensajes;

        public EntidadRecepcion()
        {

        }
    }
}
