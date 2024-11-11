using bce.util;
using core.componente;
using core.servicios;
using dal.contabilidad;
using dal.contabilidad.cuentasporpagar;
using dal.facturacionelectronica;
using dal.generales;
using dal.monetario;
using dal.persona;
using facturacionelectronica.comp.consulta.entidades;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using util;
using util.dto.mantenimiento;

namespace contabilidad.comp.mantenimiento.cuentasporcobrar.facturasparqueaderocontrato {

    /// <summary>
    /// Clase que se encarga de completar información para registrar el comprobante de devolución de garantías del parqueadero.
    /// </summary>
    public class DevolverGarantiaFPC : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {

            if (!(bool)rqmantenimiento.Mdatos["generarcomprobante"]) {
                return;
            }
            DevolverGarantiaParqueadero(rqmantenimiento);
        }

        /// <summary>
        /// Devolución de garantías de parqueadero
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public static void DevolverGarantiaParqueadero(RqMantenimiento rqmantenimiento) {

            tconcomprobante comprobante;
            List<tconcomprobantedetalle> lcomprobantedetalle = new List<tconcomprobantedetalle>();

            int cplantilla = (int)TconParametrosDal.FindXCodigo("PLANTILLA_CONTABLE_DEV_PARQ_CONTRATO", rqmantenimiento.Ccompania).numero;
            if (cplantilla == 0) {
                throw new AtlasException("CONTA-010", "ERROR: PARAMETROS CONTABLE [{0}] NO DEFINIDO PARA MODULO CONTABILIDAD", "PLANTILLA_CONTABLE_DEV_PARQ_CONTRATO");
            }

            tcongarantiaparqueadero garantiaparqueadero = (tcongarantiaparqueadero)rqmantenimiento.GetTabla("GARANTIAPARQUEADERO").Lregistros[0];

            comprobante = CompletarComprobante(rqmantenimiento, cplantilla, garantiaparqueadero);
            lcomprobantedetalle = CompletarComprobanteDetalle(rqmantenimiento, comprobante, garantiaparqueadero, cplantilla);
            garantiaparqueadero.Esnuevo = false;
            garantiaparqueadero.Actualizar = true;
            garantiaparqueadero.ccomprobantedevolucion = comprobante.ccomprobante;
            garantiaparqueadero.cusuariomod = rqmantenimiento.Cusuario;
            garantiaparqueadero.fmodificacion = rqmantenimiento.Freal;

            //transaccion spi o pago por bce
            tperreferenciabancaria referenciabancaria = TperReferenciaBancariaDal.Find(garantiaparqueadero.cpersona, rqmantenimiento.Ccompania);
            if (referenciabancaria == null) {
                throw new AtlasException("BCLIE-007", "CLIENTE NO POSEE REFERENCIA BANCARIA {0}", garantiaparqueadero.cpersona);
            }

            ttestransaccion ttestransaccion = new ttestransaccion();
            tperproveedor cliente = TperProveedorDal.Find(garantiaparqueadero.cpersona, rqmantenimiento.Ccompania);

            ttestransaccion.identificacionbeneficiario = cliente.identificacion;
            ttestransaccion.nombrebeneficiario = cliente.nombre;
            ttestransaccion.numerocuentabeneficiario = referenciabancaria.numero;
            ttestransaccion.tipocuentaccatalogo = referenciabancaria.tipocuentaccatalogo.Value;
            ttestransaccion.tipocuentacdetalle = referenciabancaria.tipocuentacdetalle;
            ttestransaccion.institucionccatalogo = referenciabancaria.tipoinstitucionccatalogo.Value;
            ttestransaccion.institucioncdetalle = referenciabancaria.tipoinstitucioncdetalle;
            ttestransaccion.valorpago = Math.Abs(garantiaparqueadero.valor);

            // Registro SPI
            GenerarBce.InsertarPagoBce(rqmantenimiento, cliente.identificacion, cliente.nombre, referenciabancaria.numero, cliente.cpersona, referenciabancaria.tipocuentaccatalogo.Value,
                referenciabancaria.tipocuentacdetalle, referenciabancaria.tipoinstitucionccatalogo.Value, referenciabancaria.tipoinstitucioncdetalle,
                Math.Abs(garantiaparqueadero.valor), garantiaparqueadero.cgarantiaparqueadero.ToString(), null, comprobante.ccomprobante);
            //fin transaccion spi


            rqmantenimiento.Response["ccomprobantedevolucion"] = comprobante.ccomprobante;
            rqmantenimiento.Response["numerocomprobantecesantia"] = comprobante.numerocomprobantecesantia;
            rqmantenimiento.AdicionarTabla("tconcomprobante", comprobante, false);
            rqmantenimiento.AdicionarTabla("tconcomprobantedetalle", lcomprobantedetalle, false);
        }

        /// <summary>
        /// Completar comprobante
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="cplantilla"></param>
        /// <param name="garantiaparqueadero"></param>
        /// <returns></returns>
        public static tconcomprobante CompletarComprobante(RqMantenimiento rqmantenimiento, int cplantilla, tcongarantiaparqueadero garantiaparqueadero) {

            tconcomprobante comprobante = new tconcomprobante();
            comprobante.anulado = false;
            comprobante.cconcepto = 3;
            comprobante.automatico = true;
            comprobante.cagencia = 1;
            comprobante.cagenciaingreso = 1;
            comprobante.ccompania = rqmantenimiento.Ccompania;
            comprobante.ccomprobante = Secuencia.GetProximovalor("COMPROBANTE").ToString();
            comprobante.numerodocumentobancario = garantiaparqueadero.documentoreferencia;
            comprobante.numerocomprobantecesantia = SecuenciaComprobanteContable.GetProximoValor(rqmantenimiento, "DIAGEN");
            comprobante.tipopersona = "CL";
            comprobante.cpersonarecibido = garantiaparqueadero.cpersona;
            comprobante.freal = rqmantenimiento.Freal;
            comprobante.cusuarioing = rqmantenimiento.Cusuario;
            comprobante.fingreso = rqmantenimiento.Freal;
            comprobante.fproceso = rqmantenimiento.Fproceso;
            comprobante.ruteopresupuesto = false;
            comprobante.aprobadopresupuesto = false;
            comprobante.comentario = rqmantenimiento.Mdatos["comentario"].ToString();
            comprobante.cplantilla = cplantilla;
            comprobante.csucursal = 1;
            comprobante.csucursalingreso = 1;
            comprobante.cuadrado = true;
            comprobante.actualizosaldo = true;
            comprobante.cusuarioing = rqmantenimiento.Cusuario;
            comprobante.eliminado = false;
            comprobante.fcontable = rqmantenimiento.Fconatable;
            comprobante.fingreso = rqmantenimiento.Freal;
            comprobante.optlock = 0;
            comprobante.particion = Constantes.GetParticion((int)rqmantenimiento.Fconatable);
            comprobante.tipodocumentoccatalogo = 1003;
            comprobante.tipodocumentocdetalle = "DIAGEN";
            comprobante.Esnuevo = true;
            comprobante.cmodulo = rqmantenimiento.Cmodulo;
            comprobante.ctransaccion = rqmantenimiento.Ctransaccion;
            comprobante.cusuariopresupuesto = TconParametrosDal.FindXCodigo("CUSUARIOPRESUPUESTO", rqmantenimiento.Ccompania).texto;
            comprobante.cusuariocontador = TconParametrosDal.FindXCodigo("CUSUARIOCONTADOR", rqmantenimiento.Ccompania).texto;
            comprobante.cusuariocaja = TconParametrosDal.FindXCodigo("CUSUARIOCAJA", rqmantenimiento.Ccompania).texto;
            comprobante.cusuariotesoreria = TconParametrosDal.FindXCodigo("CUSUARIOTESORERIA", rqmantenimiento.Ccompania).texto;
            return comprobante;
        }

        /// <summary>
        /// completa comprobante detalle
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="comprobante"></param>
        /// <param name="garantiaparqueadero"></param>
        /// <param name="cplantilla"></param>
        /// <returns></returns>
        public static List<tconcomprobantedetalle> CompletarComprobanteDetalle(RqMantenimiento rqmantenimiento, 
            tconcomprobante comprobante, tcongarantiaparqueadero garantiaparqueadero, int cplantilla) {
            List<tconplantilladetalle> plantillaDetalle = TconPlantillaDetalleDal.Find(cplantilla, rqmantenimiento.Ccompania);
            decimal valor = garantiaparqueadero.valor;
            decimal sumatorioDebitos = 0, sumatorioCreditos = 0;
            List<tconcomprobantedetalle> comprobanteDetalle = new List<tconcomprobantedetalle>();
            foreach (tconplantilladetalle pd2 in plantillaDetalle) {
                tconcomprobantedetalle cd = new tconcomprobantedetalle();
                cd.monto = 0;
                cd.montooficial = 0;
                cd.Esnuevo = true;
                cd.ccomprobante = comprobante.ccomprobante;
                cd.fcontable = comprobante.fcontable;
                cd.particion = comprobante.particion;
                cd.ccompania = comprobante.ccompania;
                cd.optlock = 0;
                cd.cagencia = 1;
                cd.csucursal = 1;
                cd.ccuenta = pd2.ccuenta;
                cd.debito = pd2.debito;
                cd.cpartida = pd2.cpartida;
                cd.numerodocumentobancario = garantiaparqueadero.documentoreferencia;
                cd.cclase = TconCatalogoDal.Find(comprobante.ccompania, cd.ccuenta).cclase;
                cd.cmoneda = rqmantenimiento.Cmoneda == null ? "USD" : rqmantenimiento.Cmoneda;
                cd.cmonedaoficial = rqmantenimiento.Cmoneda == null ? "USD" : rqmantenimiento.Cmoneda;
                cd.cusuario = comprobante.cusuarioing;
                cd.cmonedaoficial = rqmantenimiento.Cmoneda;
                cd.suma = TmonClaseDal.Suma(cd.cclase, cd.debito);
                cd.centrocostosccatalogo = pd2.centrocostosccatalogo;
                cd.centrocostoscdetalle = pd2.centrocostoscdetalle;
                cd.monto = valor;
                cd.montooficial = valor;
                comprobanteDetalle.Add(cd);
                if (cd.debito.Value) sumatorioDebitos += cd.monto.Value;
                else sumatorioCreditos += cd.monto.Value;
            }
 
            if (sumatorioCreditos != sumatorioDebitos)
            {
                throw new AtlasException("CONTA-011", "ERROR: NO ES POSIBLE GENERAR COMPROBANTE CONTABLE, VALORES INGRESADOS NO CUADRAN DEBITOS Y CREDITOS");
            }
            comprobante.montocomprobante = valor;
            return comprobanteDetalle;
        }
    }
}
