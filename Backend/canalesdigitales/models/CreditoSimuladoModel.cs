using System;

namespace canalesdigitales.models {
    public class CreditoSimuladoModel {

        public decimal NuevoMonto { get; set; }
        public int NuevoPlazo { get; set; }
        public decimal NuevaCuota { get; set; }
        public decimal Encaje { get; set; }
        public decimal TotalAPagar { get; set; }
        public DateTime FSimulacion { get; set; }
        public decimal SeguroDesgravamen { get; set; }
        public decimal TasaInteres { get; set; }
        public decimal TasaEfectivaAnual { get; set; }
    }
}
