using general.xml;
using System;

namespace facturacionelectronica.comp.consulta.entidades
{
    /// <summary>
    /// Entidad de autorización de documentos
    /// </summary>
    [Serializable]
    public class EntidadAutorizacion: BusinessEntity
    {
        public string Ambiente;
        public string Comprobante;
        public string Estado;
        public DateTime FechaAutorizacion;
        public string NumeroAutorizacion;

        public EntidadAutorizacionMensaje[] Mensajes;

        public EntidadAutorizacion()
        {

        }
    }
}
