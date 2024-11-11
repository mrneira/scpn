using System;
using System.IO;
using System.Xml;
using System.Xml.Serialization;
using System.Text;

namespace general.xml
{
    [Serializable]
    public class BusinessEntity
    {
        public static object DeserializeFromXml(Type pTipo, string pXml)
        {
            StringReader sr = new StringReader(pXml);
            XmlTextReader tr = new XmlTextReader(sr);
            XmlSerializerNamespaces ns = new XmlSerializerNamespaces();

            ns.Add(string.Empty, string.Empty);
            XmlSerializer serializer = new XmlSerializer(pTipo);
            object res = serializer.Deserialize(tr);

            return res;
        }

        public static string SerializeToXml(object pObj)
        {
            MemoryStream ms = new MemoryStream();
            XmlTextWriter tw = new XmlTextWriter(ms, Encoding.GetEncoding("UTF-8"));
            XmlSerializerNamespaces ns = new XmlSerializerNamespaces();
            tw.Formatting = Formatting.Indented;
            ns.Add(string.Empty, string.Empty);
         
            XmlSerializer serializer = new XmlSerializer(pObj.GetType());
            serializer.Serialize(tw, pObj, ns);

            string xmlString = Encoding.GetEncoding("UTF-8").GetString(ms.ToArray());
            return xmlString;
        }

        public string SerializeToXml()
        {
            return SerializeToXml(this);
        }
    }
}

