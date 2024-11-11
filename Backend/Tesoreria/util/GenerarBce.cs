using core.util.entidad;
using dal.tesoreria;
using modelo;
using tesoreria.enums;
using util;
using util.dto.mantenimiento;

namespace bce.util
{
    /// <summary>
    /// Permite Generar, Eliminar Bce
    /// </summary>
    /// <param name="rq"></param>
    public class GenerarBce
    {
        public static RqMantenimiento InsertarPagoBce(RqMantenimiento rq, string identificacionBeneficiario, string nombreBeneficiario, string numeroCuentaBeneficiario,
            long? codigoBeneficiario, int tipoCuentaCcatalogo, string tipoCuentaCdetalle, int institucionBancariaCcatalogo, string institucionBancariaCdetalle,
            decimal valorPago, string referenciaInterna, int? secuenciaInterna, string ccomprobanteobligacion)
        {
            try
            {
                if (nombreBeneficiario.Length > 30)
                {
                    nombreBeneficiario = nombreBeneficiario.Substring(0, 30);
                }

                if (numeroCuentaBeneficiario.Length > 18)
                {
                    throw new AtlasException("BCE-015", "LONGITUD DE CAMPO EXCEDE, CAMPO {0}, PERMITIDO HASTA {1}", "Número Cuenta Beneficiario", 8);
                }
                decimal valor = decimal.Parse(numeroCuentaBeneficiario);
                EntidadBce entidadBce = new EntidadBce();
                entidadBce.esnuevo = true;
                entidadBce.identificacionbeneficiario = identificacionBeneficiario;
                entidadBce.nombrebeneficiario = nombreBeneficiario;
                entidadBce.numerocuentabeneficiario = numeroCuentaBeneficiario;
                entidadBce.codigobeneficiario = codigoBeneficiario;
                entidadBce.tipocuentacdetalle = tipoCuentaCdetalle;
                entidadBce.tipocuentaccatalogo = tipoCuentaCcatalogo;
                entidadBce.institucioncdetalle = institucionBancariaCdetalle;
                entidadBce.institucionccatalogo = institucionBancariaCcatalogo;
                entidadBce.valorpago = valorPago;
                entidadBce.referenciainterna = referenciaInterna;
                entidadBce.secuenciainterna = secuenciaInterna;
                entidadBce.mensaje = rq.Mensaje;
                entidadBce.cmodulo = rq.Cmodulo;
                entidadBce.ctransaccion = rq.Ctransaccion;
                entidadBce.tipotransaccion = EnumTesoreria.PAGO.Cpago;
                entidadBce.fcontable = rq.Fconatable;
                entidadBce.esmanual = false;
                entidadBce.ccomprobanteobligacion = ccomprobanteobligacion;
                if ((rq.Mdatos.ContainsKey("esmanual")))
                {
                    entidadBce.esmanual = (bool)rq.Mdatos["esmanual"];
                }
                rq.Mbce.Add(entidadBce);
                return rq;
            }
            catch (System.Exception)
            {
                throw;
            }
        }

        public static RqMantenimiento InsertarPagoTransferenciaBce(RqMantenimiento rq, string identificacionBeneficiario, string nombreBeneficiario, string numeroCuentaBeneficiario,
            long? codigoBeneficiario, int tipoCuentaCcatalogo, string tipoCuentaCdetalle, int institucionBancariaCcatalogo, string institucionBancariaCdetalle,
            decimal valorPago, string referenciaInterna, int? secuenciaInterna, string concepto, string subcuentaBeneficiario)
        {
            try
            {
                if (nombreBeneficiario.Length > 30)
                {
                    nombreBeneficiario = nombreBeneficiario.Substring(0, 30);
                }

                if (numeroCuentaBeneficiario.Length > 18)
                {
                    throw new AtlasException("BCE-015", "LONGITUD DE CAMPO EXCEDE, CAMPO {0}, PERMITIDO HASTA {1}", "Número Cuenta Beneficiario", 8);
                }
                EntidadBce entidadBce = new EntidadBce();
                entidadBce.esnuevo = true;
                entidadBce.identificacionbeneficiario = identificacionBeneficiario;
                entidadBce.nombrebeneficiario = nombreBeneficiario;
                entidadBce.numerocuentabeneficiario = numeroCuentaBeneficiario;
                entidadBce.codigobeneficiario = codigoBeneficiario;
                entidadBce.tipocuentacdetalle = tipoCuentaCdetalle;
                entidadBce.tipocuentaccatalogo = tipoCuentaCcatalogo;
                entidadBce.institucioncdetalle = institucionBancariaCdetalle;
                entidadBce.institucionccatalogo = institucionBancariaCcatalogo;
                entidadBce.valorpago = valorPago;
                entidadBce.referenciainterna = referenciaInterna;
                entidadBce.secuenciainterna = secuenciaInterna;
                entidadBce.mensaje = rq.Mensaje;
                entidadBce.cmodulo = rq.Cmodulo;
                entidadBce.ctransaccion = rq.Ctransaccion;
                entidadBce.tipotransaccion = EnumTesoreria.TRANSFERENCIA.Cpago;
                entidadBce.concepto = concepto;
                entidadBce.subcuenta = subcuentaBeneficiario;
                entidadBce.fcontable = rq.Fconatable;
                entidadBce.esmanual = false;
                if ((rq.Mdatos.ContainsKey("esmanual")))
                {
                    entidadBce.esmanual = (bool)rq.Mdatos["esmanual"];
                }
                rq.Mbce.Add(entidadBce);
                return rq;
            }
            catch (System.Exception ex)
            {
                throw;
            }
        }

        public static RqMantenimiento InsertarCobroBce(RqMantenimiento rq, string identificacionBeneficiario, string nombreBeneficiario, string numeroCuentaBeneficiario,
            long? codigoBeneficiario, int tipoCuentaCcatalogo, string tipoCuentaCdetalle, int institucionBancariaCcatalogo, string institucionBancariaCdetalle,
            decimal valorPago, string referenciaInterna, int? secuenciaInterna, string email, string telefono, string numeroSuministro)
        {
            try
            {
                if (nombreBeneficiario.Length > 30)
                {
                    nombreBeneficiario = nombreBeneficiario.Substring(0, 30);
                }

                if (numeroCuentaBeneficiario.Length > 18)
                {
                    throw new AtlasException("BCE-015", "LONGITUD DE CAMPO EXCEDE, CAMPO {0}, PERMITIDO HASTA {1}", "Número Cuenta Beneficiario", 8);
                }
                EntidadBce entidadBce = new EntidadBce();
                entidadBce.esnuevo = true;
                entidadBce.identificacionbeneficiario = identificacionBeneficiario;
                entidadBce.nombrebeneficiario = nombreBeneficiario;
                entidadBce.numerocuentabeneficiario = numeroCuentaBeneficiario;
                entidadBce.codigobeneficiario = codigoBeneficiario;
                entidadBce.tipocuentacdetalle = tipoCuentaCdetalle;
                entidadBce.tipocuentaccatalogo = tipoCuentaCcatalogo;
                entidadBce.institucioncdetalle = institucionBancariaCdetalle;
                entidadBce.institucionccatalogo = institucionBancariaCcatalogo;
                entidadBce.valorpago = valorPago;
                entidadBce.referenciainterna = referenciaInterna;
                entidadBce.secuenciainterna = secuenciaInterna;
                entidadBce.email = email;
                entidadBce.telefono = telefono;
                entidadBce.numerosuministro = numeroSuministro;
                entidadBce.mensaje = rq.Mensaje;
                entidadBce.cmodulo = rq.Cmodulo;
                entidadBce.ctransaccion = rq.Ctransaccion;
                entidadBce.tipotransaccion = EnumTesoreria.COBRO.Cpago;
                entidadBce.fcontable = rq.Fconatable;
                entidadBce.esmanual = false;
                if ((rq.Mdatos.ContainsKey("esmanual")))
                {
                    entidadBce.esmanual = (bool)rq.Mdatos["esmanual"];
                }
                rq.Mbce.Add(entidadBce);
                return rq;
            }
            catch (System.Exception ex)
            {
                throw;
            }
        }

        public static RqMantenimiento InsertarObligacionBce(RqMantenimiento rq, string identificacionBeneficiario, string nombreBeneficiario, string numeroCuentaBeneficiario,
            long? codigoBeneficiario, int tipoCuentaCcatalogo, string tipoCuentaCdetalle, int institucionBancariaCcatalogo, string institucionBancariaCdetalle,
            decimal valorPago, string referenciaInterna, int? secuenciaInterna)
        {
            try
            {
                if (nombreBeneficiario.Length > 30)
                {
                    nombreBeneficiario = nombreBeneficiario.Substring(0, 30);
                }

                if (numeroCuentaBeneficiario.Length > 18)
                {
                    throw new AtlasException("BCE-015", "LONGITUD DE CAMPO EXCEDE, CAMPO {0}, PERMITIDO HASTA {1}", "Número Cuenta Beneficiario", 8);
                }
                decimal valor = decimal.Parse(numeroCuentaBeneficiario);
                EntidadBce entidadBce = new EntidadBce();
                entidadBce.esnuevo = true;
                entidadBce.identificacionbeneficiario = identificacionBeneficiario;
                entidadBce.nombrebeneficiario = nombreBeneficiario;
                entidadBce.numerocuentabeneficiario = numeroCuentaBeneficiario;
                entidadBce.codigobeneficiario = codigoBeneficiario;
                entidadBce.tipocuentacdetalle = tipoCuentaCdetalle;
                entidadBce.tipocuentaccatalogo = tipoCuentaCcatalogo;
                entidadBce.institucioncdetalle = institucionBancariaCdetalle;
                entidadBce.institucionccatalogo = institucionBancariaCcatalogo;
                entidadBce.valorpago = valorPago;
                entidadBce.referenciainterna = referenciaInterna;
                entidadBce.secuenciainterna = secuenciaInterna;
                entidadBce.mensaje = rq.Mensaje;
                entidadBce.cmodulo = rq.Cmodulo;
                entidadBce.ctransaccion = rq.Ctransaccion;
                entidadBce.tipotransaccion = EnumTesoreria.SPL.Cpago;
                entidadBce.fcontable = rq.Fconatable;
                entidadBce.esmanual = false;
                if ((rq.Mdatos.ContainsKey("esmanual")))
                {
                    entidadBce.esmanual = (bool)rq.Mdatos["esmanual"];
                }
                rq.Mbce.Add(entidadBce);
                return rq;
            }
            catch (System.Exception)
            {
                throw;
            }
        }

        public static void EliminarPagoBce(RqMantenimiento rq, string referenciaInterna, int? secuenciaInterna)
        {
            try
            {
                ttestransaccion tran = TtesTransaccionDal.FindToReferenciaAnular(referenciaInterna, secuenciaInterna, ((int)EnumTesoreria.EstadoPagoBce.Anulado).ToString(), EnumTesoreria.PAGO.Cpago);
            }
            catch (System.Exception)
            {

                throw;
            }
        }

        public static void EliminarCobroBce(RqMantenimiento rq, string referenciaInterna, int? secuenciaInterna)
        {
            try
            {
                ttestransaccion tran = TtesTransaccionDal.FindToReferenciaAnular(referenciaInterna, secuenciaInterna, ((int)EnumTesoreria.EstadoPagoBce.Anulado).ToString(), EnumTesoreria.COBRO.Cpago);
            }
            catch (System.Exception)
            {

                throw;
            }
        }
    }
}
