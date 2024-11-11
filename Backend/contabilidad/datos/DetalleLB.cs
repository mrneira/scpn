using System;

namespace contabilidad.datos
{
	/// <summary>
	/// Detalle Libro Banco
	/// Fecha: 10012023
	/// RRO 20230130
	/// </summary>
    public class DetalleLB
    {
		public long clibrobanco { get; set; }
		public string cuentabanco { get; set; }
		public Nullable<System.DateTime> freal { get; set; }
		public int fcontable { get; set; }
		public string ccomprobante { get; set; }
		public Nullable<int> cmodulo { get; set; }
		public Nullable<int> ctransaccion { get; set; }
		public Nullable<decimal> montodebito { get; set; }
		public Nullable<decimal> montocredito { get; set; }
		public string documento { get; set; }
		public Nullable<bool> conciliado { get; set; }
		public string cusuariomod { get; set; }
		public Nullable<System.DateTime> fmodificacion { get; set; }
		public bool ajustelibro { get; set; }
		public string conciliaaux { get; set; }
		public string documentohist { get; set; }
		public Nullable<bool> cambioComprobante { get; set; }
		public string operacion { get; set; }
		public string formapago { get; set; }
	}
}
