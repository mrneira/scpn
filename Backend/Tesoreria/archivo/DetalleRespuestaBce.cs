using System;

namespace tesoreria.archivo
{
    /// <summary>
    /// Detalle Respuesta BCE
    /// </summary>
    public class DetalleRespuestaBce
    {
        public long crespuestabce { get; set; }
        public long idcabecera { get; set; }
        public string identificacionbeneficiario { get; set; }
        public long numeroreferencia { get; set; }
        public long secuencia { get; set; }
        public decimal valorpago { get; set; }
        public string numerocuentabeneficiario { get; set; }
        public int numero { get; set; }
        public string nombrebeneficiario { get; set; }
        public string codrespuestabce { get; set; }
        public DateTime fecha { get; set; }
        public DateTime fecharespuesta { get; set; }
        public string detalle { get; set; }
        public long numeroreferenciapago { get; set; }
        public bool procesado { get; set; }
        public string tipotransaccion { get; set; }
        public string codigoinstitucionbeneficiario { get; set; }
        public string referenciainterna { get; set; }
        public string referenciabce { get; set; }
    }
}
