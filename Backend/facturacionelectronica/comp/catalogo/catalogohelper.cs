
using System;
using System.Collections.Generic;
using System.Globalization;

namespace facturacionelectronica.comp.catalogo
{
    /// <summary>
    /// Catálogo para documentos.
    /// </summary>
    public class CatalogoHelper
    {
        public const string LocalHost = "127.0.0.1";

        public const string UserDefault = "System";

        public static CultureInfo Cultura = new CultureInfo("es-PE");

        [Serializable]
        public enum CodigoDocumento
        {
            Factura = 01,
            NotaCredito = 04,
            NotaDebito = 05,
            GuiaRemision = 06,
            ComprobanteRetencion = 07
        }

        [Serializable]
        public enum TipoAmbiente
        {
            Pruebas=1,
            Produccion=2
        }

        [Serializable]
        public enum TipoEmision
        {
            EmisionNormal=1
        }

    }
}
