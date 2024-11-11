using cartera.enums;
using dal.cartera;
using dal.generales;
using dal.persona;
using dal.tesoreria;
using modelo;
using tesoreria.enums;
using util;
using util.dto.interfaces.lote;
using util.dto.mantenimiento;
using util.enums;

namespace cartera.lote.operacion {
    /// <summary>
    /// Clase que se encarga de ejecutar las cobranzas en base a las fechas de vencimiento de las operaciones de cartera.
    /// </summary>
    public class EnvioOcp : ITareaOperacion {

        public void Ejecutar(RqMantenimiento rqmantenimiento, RequestOperacion requestoperacion)
        {
            int particion = Constantes.GetParticion(rqmantenimiento.Fconatable);
            rqmantenimiento.Mbce = new System.Collections.Generic.List<modelo.interfaces.IBean>();
            tcardescuentosdetalle descuento = TcarDescuentosDetalleDal.Find(particion, EnumDescuentos.BANCOS.Cinstitucion, requestoperacion.Coperacion);

            tperpersonadetalle per = TperPersonaDetalleDal.Find(descuento.cpersona, (int)descuento.ccompania);
            tperreferenciabancaria cta = TperReferenciaBancariaDal.Find(descuento.cpersona, (int)descuento.ccompania);
            if (cta == null) {
                throw new AtlasException("CAR-0064", "REFERENCIA BANCARIA NO EXISTE PARA CLIENTE: {0}", per.nombre);
            }

            // Registra OCP
            ttestransaccion bce = new ttestransaccion();
            bce.Esnuevo = true;
            bce.identificacionbeneficiario = per.identificacion;
            bce.nombrebeneficiario = per.nombre;
            bce.numerocuentabeneficiario = cta.numero;
            bce.codigobeneficiario = descuento.cpersona;
            bce.tipocuentacdetalle = cta.tipocuentacdetalle;
            bce.tipocuentaccatalogo = (int)cta.tipocuentaccatalogo;
            bce.institucioncdetalle = cta.tipoinstitucioncdetalle;
            bce.institucionccatalogo = (int)cta.tipoinstitucionccatalogo;
            bce.valorpago = (decimal)descuento.monto;
            bce.referenciainterna = descuento.coperacion;
            bce.secuenciainterna = descuento.particion;
            bce.email = per.email;
            bce.telefono = per.celular;
            bce.tipotransaccion = EnumTesoreria.COBRO.Cpago;
            //Adicional para el proceso
            bce.verreg = Constantes.CERO;
            bce.optlock = Constantes.CERO;
            bce.cusuarioing = rqmantenimiento.Cusuario;
            bce.fingreso = rqmantenimiento.Freal;
            bce.cmodulo = rqmantenimiento.Cmodulo;
            bce.ctransaccion = rqmantenimiento.Ctransaccion;
            bce.mensaje = rqmantenimiento.Mensaje;
            bce.detalle = string.Format("{0}-{1}", TgentransaccionDal.Find(rqmantenimiento.Cmodulo, rqmantenimiento.Ctransaccion).nombre, descuento.coperacion);
            bce.cestado = ((int)EnumEstadoPagoBce.EstadoPagoBce.Registrado).ToString();
            bce.esproveedor = false;
            bce.fcontable = rqmantenimiento.Fconatable;
            bce.esmanual = false;

            TtesTransaccionDal.InsertarCobro(bce);
        }
    }
}
