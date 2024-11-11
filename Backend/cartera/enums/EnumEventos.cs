using System;

namespace cartera.enums {

    /// <summary>
    /// Enumeracion que almacena eventos de cartera.
    /// </summary>
    public class EnumEventos {

        public static readonly EnumEventos BAJACAPITAL = new EnumEventos("BAJACAPITAL");
        public static readonly EnumEventos COBRO = new EnumEventos("COBRO");
        public static readonly EnumEventos COBROANTICIPADO = new EnumEventos("COBROANTICIPADO");
        public static readonly EnumEventos COBRO_APORTES = new EnumEventos("COBRO-APORTES");
        public static readonly EnumEventos COBRO_DESCUENTOS = new EnumEventos("COBRO-DESCUENTOS");
        public static readonly EnumEventos COBRO_DEVOLUCION = new EnumEventos("COBRO-DEVOLUCION");
        public static readonly EnumEventos COBRO_RECAUDACION = new EnumEventos("COBRO-RECAUDACION");
        public static readonly EnumEventos CREDITO_CXP = new EnumEventos("CREDITO-CXP");
        public static readonly EnumEventos DEBITO_CXP = new EnumEventos("DEBITO-CXP");
        public static readonly EnumEventos DESEMBOLSO = new EnumEventos("DESEMBOLSO");
        public static readonly EnumEventos DESEMBOLSO_ANTICIPO = new EnumEventos("DESEMBOLSO-ANTICIPO");
        public static readonly EnumEventos DESEMBOLSOCUENTACONTABLE = new EnumEventos("DESEMBOLSO-CUENTA-CONTABLE");
        public static readonly EnumEventos DESEMBOLSO_REINCORPORADO = new EnumEventos("DESEMBOLSO-REINCORPORADO");
        public static readonly EnumEventos GASTOSLIQUIDACION = new EnumEventos("GASTOS-LIQUIDACION");
        public static readonly EnumEventos MADURACION = new EnumEventos("MADURACION");
        public static readonly EnumEventos PRECANCELACION = new EnumEventos("PRECANCELACION");
        public static readonly EnumEventos PRECANCELACION_ABSORCION = new EnumEventos("PRECANCELACION-ABSORCION");
        public static readonly EnumEventos PRECANCELACION_MASIVO = new EnumEventos("PRECANCELACION-MASIVO");
        public static readonly EnumEventos REGENERATABLAPAGEXTRAORDINARIO = new EnumEventos("REGENERA-TABLA-PAGEXTRAORDINA");
        public static readonly EnumEventos REGISTRODOLARCASTIGO = new EnumEventos("REGISTRO-DOLAR-CASTIGO");
        public static readonly EnumEventos SEGURODESGRAVAMEN = new EnumEventos("SEGURO-DESGRAVAMEN");
        public static readonly EnumEventos TABLAABONOEXTRAORDINARIO = new EnumEventos("TABLAABONOEXTRAORDINARIO");

        /// <summary>
        /// Codigo de estatus de una operacion.
        /// </summary>
        private String cevento;

        /// <summary>
        /// Crea una instancia de EnumEstatus.
        /// </summary>
        /// <param name="cevento">Codigo de estatus de la cartera.</param>
        private EnumEventos(String cevento)
        {
            this.Cevento = cevento;
        }

        /// <summary>
        /// Entrega y fija el valor de: cevento
        /// </summary>
        public string Cevento { get => cevento; set => cevento = value; }
    }
}
