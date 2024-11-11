using System;
using System.ComponentModel;

namespace cartera.enums
{
    /// <summary>
    /// Enumeracion que almacena estatus de cartera.
    /// </summary>
    public class EnumRecaudacion
    {
        [Serializable]
        public enum CodigoOrientacion
        {
            CO = 1,
            PA = 2
        }

        [Serializable]
        public enum FormaPago
        {
            REC = 1,
            CTA = 2,
            CHQ = 3,
            EFE = 4
        }

        [Serializable]
        public enum EstadoRecaudacion
        {
            Registrado = 1,
            Generado = 2,
            Cobrado = 3,
            Autorizado = 4
        }

        [Serializable]
        public enum BancosConciliacion
        {
            PIC = 711020202,
            FA = 711020101,
            ADF = 11020101
        }
    }
}
