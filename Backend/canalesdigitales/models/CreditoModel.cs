using System.Collections.Generic;

namespace canalesdigitales.models {
    public class CreditoModel {

        public string Coperacion { get; set; }
        public string Producto { get; set; }
        public string Estado { get; set; }
        public decimal MontoOriginal { get; set; }
        public int Fvencimiento { get; set; }
        public int Faprobacion { get; set; }
        public decimal Tasa { get; set; }
        public List<Dictionary<string, object>> Cuotas { get; set; }
    }
}
