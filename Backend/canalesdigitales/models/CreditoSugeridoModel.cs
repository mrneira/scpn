namespace canalesdigitales.models {

    public class CreditoSugeridoModel {

        public long Csolicitud { get; set; }
        public int Cproducto { get; set; }
        public int CtipoProducto { get; set; }
        public int Ctabla { get; set; }
        public string NombreTabla { get; set; }
        public string Nombre { get; set; }
        public decimal Monto { get; set; }
        public decimal Cuota { get; set; }
        public int Plazo { get; set; }
        public decimal Tasa { get; set; }
    }
}
