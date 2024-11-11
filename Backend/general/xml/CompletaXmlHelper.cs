using System;
using System.Text;
using System.Xml;

namespace general.xml { 

    public class CompletaXmlHelper
    {
        public static byte[] ObtenerDocumentoAutorizado(byte[] xmlFirmado, string autorizacion, DateTime fechaAutorizacion, string estado, string ambiente)
        {
            string comrobanteXml = Encoding.UTF8.GetString(xmlFirmado);

            XmlCDataSection cData = new XmlDocument().CreateCDataSection(comrobanteXml);

            EntidadAutorizacionDescarga entidadAutorizacion = new EntidadAutorizacionDescarga
            {
                Estado = estado,
                NumeroAutorizacion = autorizacion,
                FechaAutorizacion = fechaAutorizacion,
                Ambiente = ambiente,
                Comprobante = cData,
            };

            string xmlSerializado = entidadAutorizacion.SerializeToXml();
            XmlDocument xmlDocumento = new XmlDocument();
            xmlDocumento.LoadXml(xmlSerializado.Substring(1, xmlSerializado.Length - 1));
            return Encoding.UTF8.GetBytes(xmlDocumento.InnerXml);
        }
    }
}
