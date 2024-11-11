using System;

namespace tesoreria.archivo
{
    /// <summary>
    /// Entidad Respuesta Cash
    /// </summary>
    public class DetalleRespuestaCash {
        public string referenciasobre { get; set; }
        public string estadosobre { get; set; }
        public DateTime fechainicioproceso { get; set; }
        public DateTime fechavencimiento_proceso { get; set; }
        public string contrapartida { get; set; }
        public string referencia { get; set; }
        public string moneda { get; set; }
        public string nombrecontrapartida { get; set; }
        public decimal valor { get; set; }
        public string tipopago { get; set; }
        public string tipoidcliente { get; set; }
        public string numeroidcliente { get; set; }
        public string estadoproceso { get; set; }
        public string idcontrato { get; set; }
        public string idsobre { get; set; }
        public string iditem { get; set; }
        public string paisbancocuenta { get; set; }
        public string eliminado { get; set; }
        public string canal { get; set; }
        public string medio { get; set; }
        public string numerodocumento { get; set; }
        public string horario { get; set; }
        public string mensaje { get; set; }
        public string oficina { get; set; }
        public DateTime fechaprocesodate { get; set; }
        public DateTime fechaproceso { get; set; }
        public DateTime horaproceso { get; set; }
        public decimal valorprocc { get; set; }
        public string estadoimpresion { get; set; }
        public string formapago { get; set; }
        public string tabla { get; set; }
        public string pais { get; set; }
        public string banco { get; set; }
        public string referencia_adicional { get; set; }
        public string secuencialcobro { get; set; }
        public string numerocomprobante { get; set; }
        public string numerocuenta { get; set; }
        public string nodocumento { get; set; }
        public string tipocuenta { get; set; }
        public string numerocuenta1 { get; set; }
        public string condicionproceso { get; set; }
        public string numerotransaccion { get; set; }
        public string numerosri { get; set; }
        public string direccioncliente { get; set; }
        public string numeroautorizacion { get; set; }
        public bool procesado { get; set; }
    }
}
