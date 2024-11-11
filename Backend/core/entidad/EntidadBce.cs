using modelo.helper;
using modelo.interfaces;
using System;

namespace core.util.entidad
{
    public class EntidadBce : AbstractDto, IBean
    {
        public bool esnuevo { get; set; }
        public string identificacionbeneficiario { get; set; }
        public string nombrebeneficiario { get; set; }
        public string numerocuentabeneficiario { get; set; }
        public long? codigobeneficiario { get; set; }
        public string tipocuentacdetalle { get; set; }
        public int tipocuentaccatalogo { get; set; }
        public string institucioncdetalle { get; set; }
        public int institucionccatalogo { get; set; }
        public decimal valorpago { get; set; }
        public string referenciainterna { get; set; }
        public int? secuenciainterna { get; set; }
        public string email { get; set; }
        public string telefono { get; set; }
        public string numerosuministro { get; set; }
        public string tipotransaccion { get; set; }
        public int fcontable { get; set; }
        public string ccomprobanteobligacion { get; set; }
        
        //Datos a Completar
        public int verreg { get; set; }
        public long? optlock { get; set; }
        public int? veractual { get; set; }
        public int cmodulo { get; set; }
        public int ctransaccion { get; set; }
        public string mensaje { get; set; }
        public string detalle { get; set; }
        public string cestado { get; set; }
        public bool? esproveedor { get; set; }

        //Campos Adicionales
        public long? numeroreferencia { get; set; }
        public long? numeroreferenciapago { get; set; }
        public string subcuenta { get; set; }
        public string concepto { get; set; }
        public bool esmanual { get; set; }

        public object Clone()
        {
            throw new NotImplementedException();
        }
    }
}