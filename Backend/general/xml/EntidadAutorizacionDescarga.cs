using System;
using System.Xml;
using System.Xml.Serialization;
using general.xml;

namespace general.xml
{
    [XmlRoot(ElementName = "autorizacion", IsNullable = false), Serializable]
    public class EntidadAutorizacionDescarga: BusinessEntity
    {
        public string Estado;
        public string NumeroAutorizacion;
        public DateTime FechaAutorizacion;
        public string Ambiente;

        private string _comprobante;
        [XmlElement("comprobante")]
        public XmlCDataSection Comprobante
        {
            get
            {
                XmlDocument document = new XmlDocument();
                return document.CreateCDataSection(_comprobante);
            }
            set { _comprobante = value.Value; }
        }
        public string[] mensajes { get; set; }
    }
}