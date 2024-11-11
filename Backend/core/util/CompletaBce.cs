using core.util.entidad;
using dal.contabilidad;
using dal.generales;
using dal.tesoreria;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using util;
using util.dto.mantenimiento;
using util.enums;

namespace core.util
{
    public class ProcesarBce
    {
        public static void CompletaBce(RqMantenimiento rm)
        {
            try
            {
                List<IBean> bceCompleta = AgregarInformacionBce(rm);
                List<ttestransaccion> lbce = new List<ttestransaccion>();
                ttestransaccion bce = new ttestransaccion();
                foreach (EntidadBce item in bceCompleta)
                {
                    if (item.esnuevo)
                    {
                        bce = GenerarEntidadTransaccion(item);
                    }
                    else
                    {
                        bce = EliminarBce(item);
                    }
                    ValidarInformacionBce(bce);
                    lbce.Add(bce);
                }
                rm.AdicionarTabla(typeof(ttestransaccion).Name.ToUpper(), lbce, false);
                rm.Mbce = null;
            }
            catch (Exception ex)
            {
                throw new AtlasException("BCE-005", "INFORMACIÓN INCOMPLETA, VERIFIQUE DATOS DE LA CUENTA", ex.Message);
            }

        }

        private static ttestransaccion GenerarEntidadTransaccion(EntidadBce entidadbce)
        {
            ttestransaccion bce = new ttestransaccion();
            bce.Esnuevo = entidadbce.esnuevo;
            bce.identificacionbeneficiario = entidadbce.identificacionbeneficiario;
            bce.nombrebeneficiario = entidadbce.nombrebeneficiario;
            bce.numerocuentabeneficiario = entidadbce.numerocuentabeneficiario;
            bce.codigobeneficiario = entidadbce.codigobeneficiario;
            bce.tipocuentacdetalle = entidadbce.tipocuentacdetalle;
            bce.tipocuentaccatalogo = entidadbce.tipocuentaccatalogo;
            bce.institucioncdetalle = entidadbce.institucioncdetalle;
            bce.institucionccatalogo = entidadbce.institucionccatalogo;
            bce.valorpago = entidadbce.valorpago;
            bce.referenciainterna = entidadbce.referenciainterna;
            bce.secuenciainterna = entidadbce.secuenciainterna;
            bce.email = entidadbce.email;
            bce.telefono = entidadbce.telefono;
            bce.numerosuministro = entidadbce.numerosuministro;
            bce.tipotransaccion = entidadbce.tipotransaccion;
            //Adicional para el proceso
            bce.verreg = entidadbce.verreg;
            bce.optlock = entidadbce.optlock;
            bce.veractual = entidadbce.veractual;
            bce.cmodulo = entidadbce.cmodulo;
            bce.ctransaccion = entidadbce.ctransaccion;
            bce.mensaje = entidadbce.mensaje;
            bce.detalle = entidadbce.detalle;
            bce.cestado = entidadbce.cestado;
            bce.esproveedor = entidadbce.esproveedor;
            bce.concepto = entidadbce.concepto;
            bce.subcuenta = entidadbce.subcuenta;
            bce.fcontable = entidadbce.fcontable;
            bce.esmanual = entidadbce.esmanual;
            bce.ccomprobanteobligacion = entidadbce.ccomprobanteobligacion;
            return bce;
        }
        private static List<IBean> AgregarInformacionBce(RqMantenimiento rm)
        {
            foreach (EntidadBce item in rm.Mbce)
            {
                if (item.esnuevo)
                {
                    bool esproveedor = false;
                    item.optlock = 0;
                    item.detalle = string.Format("{0}-{1}", TgentransaccionDal.Find(item.cmodulo, item.ctransaccion).nombre, item.referenciainterna);
                    item.cestado = ((int)EnumEstadoPagoBce.EstadoPagoBce.Registrado).ToString();
                    // Cambio para no generar archivo de proveedor
                    //if (item.tipotransaccion.Equals("P")) {
                    //    List<tperproveedor> proveedor = TperProveedorDal.FindByIdentificacion(item.identificacionbeneficiario);
                    //    if (proveedor.Count > 0) {
                    //        esproveedor = true;
                    //    }
                    //}
                    item.esproveedor = esproveedor;
                    if (string.IsNullOrEmpty(item.tipotransaccion))
                    {
                        throw new AtlasException("BCE-005", "INFORMACIÓN INCOMPLETA, VERIFIQUE DATOS", "Tipo Transacción es necesaria");
                    }
                }
            }
            return rm.Mbce;
        }

        private static void ValidarInformacionBce(ttestransaccion tx)
        {
            if (tx.Esnuevo)
            {
                if (string.IsNullOrEmpty(tx.identificacionbeneficiario) || string.IsNullOrEmpty(tx.nombrebeneficiario) || string.IsNullOrEmpty(tx.numerocuentabeneficiario))
                {
                    throw new AtlasException("BCE-003", "INFORMACIÓN INCOMPLETA, VERIFIQUE DATOS DEL BENEFICIARIO {0}", "Identificación " + tx.identificacionbeneficiario +
                        "Nombre " + tx.nombrebeneficiario + "Cuenta " + tx.numerocuentabeneficiario);
                }
                if (tx.cmodulo == null || tx.ctransaccion == null)
                {
                    throw new AtlasException("BCE-004", "INFORMACIÓN INCOMPLETA, VERIFIQUE DATOS DE LA TRANSACCIÓN {0}", "Módulo" + tx.cmodulo + "Transacción" + tx.ctransaccion);
                }
                if (string.IsNullOrEmpty(tx.tipocuentacdetalle) || tx.tipocuentaccatalogo == 0 || string.IsNullOrEmpty(tx.institucioncdetalle)
                    || tx.institucionccatalogo == 0 || tx.valorpago < 0)
                { // CCA 20220418 ==
                    throw new AtlasException("BCE-005", "INFORMACIÓN INCOMPLETA, VERIFIQUE DATOS DE LA CUENTA {0}", "Identificación " + tx.identificacionbeneficiario
                        + "Nombre " + tx.nombrebeneficiario + "Tipo Cuenta Cdetalle " + tx.tipocuentacdetalle + "Tipo Cuenta Ccatalogo " + tx.tipocuentaccatalogo
                        + "Institución Cdetalle " + tx.institucioncdetalle + "Institución Ccatalogo " + tx.institucionccatalogo + "Valor Pago " + tx.valorpago);
                }
            }
        }

        private static ttestransaccion EliminarBce(EntidadBce entidadbce)
        {
            try
            {
                ttestransaccion bce = new ttestransaccion();
                bce.Esnuevo = false;
                bce.identificacionbeneficiario = entidadbce.identificacionbeneficiario;
                bce.nombrebeneficiario = entidadbce.nombrebeneficiario;
                bce.numerocuentabeneficiario = entidadbce.numerocuentabeneficiario;
                bce.codigobeneficiario = entidadbce.codigobeneficiario;
                bce.tipocuentacdetalle = entidadbce.tipocuentacdetalle;
                bce.tipocuentaccatalogo = entidadbce.tipocuentaccatalogo;
                bce.institucioncdetalle = entidadbce.institucioncdetalle;
                bce.institucionccatalogo = entidadbce.institucionccatalogo;
                bce.valorpago = entidadbce.valorpago;
                bce.referenciainterna = entidadbce.referenciainterna;
                bce.secuenciainterna = entidadbce.secuenciainterna;
                bce.email = entidadbce.email;
                bce.telefono = entidadbce.telefono;
                bce.numerosuministro = entidadbce.numerosuministro;
                bce.tipotransaccion = entidadbce.tipotransaccion;
                //Adicional para el proceso
                bce.verreg = entidadbce.verreg;
                bce.optlock = entidadbce.optlock;
                bce.veractual = entidadbce.veractual;
                bce.cmodulo = entidadbce.cmodulo;
                bce.ctransaccion = entidadbce.ctransaccion;
                bce.mensaje = entidadbce.mensaje;
                bce.detalle = entidadbce.detalle;
                bce.cestado = entidadbce.cestado;
                bce.esproveedor = entidadbce.esproveedor;
                bce.esmanual = entidadbce.esmanual;
                ttestransaccion bcetran = TtesTransaccionDal.FindToReferenciaAnular(bce.referenciainterna, bce.secuenciainterna, ((int)EnumEstadoPagoBce.EstadoPagoBce.Anulado).ToString(), bce.tipotransaccion);
                bcetran.Actualizar = true;
                bcetran.cestado = ((int)EnumEstadoPagoBce.EstadoPagoBce.Anulado).ToString();
                return bce;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
    }
}
