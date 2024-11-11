using bce.util;
using contabilidad.saldo;
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
using util;
using util.dto.mantenimiento;

namespace contabilidad.comp.mantenimiento.cuentasporpagar {

    /// <summary>
    /// Clase que se encarga de completar información ded detalle de un comprobante contable.
    /// </summary>
    public class PagarMigradas : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            
            if (rqmantenimiento.GetTabla("tconcuentaporpagarmigrada").Lregistros.Count > 0) {
                List<IBean> lmantenimiento = rqmantenimiento.GetTabla("tconcuentaporpagarmigrada").Lregistros;
                CompletarAutorizacion(rqmantenimiento, lmantenimiento);
                //rqmantenimiento.Mtablas["tconcuentaporpagarmigrada"] = null;
                
            }
        }

        /// <summary>
        /// completar autorización
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="ldetalle"></param>
        public static void CompletarAutorizacion(RqMantenimiento rqmantenimiento, List<IBean> lcxp) {
            //bool autoriza;
            tconcomprobante comprobante = new tconcomprobante();
            List<tconcomprobantedetalle> lcomprobantedetalle = new List<tconcomprobantedetalle>();
            List<tconcuentaporpagarmigrada> lcuentasporpagar = new List<tconcuentaporpagarmigrada>();

            foreach (tconcuentaporpagarmigrada item in lcxp) {
                lcuentasporpagar.Add(item);
            }


            var ltotalporcuenta = lcuentasporpagar                      // No flattening
            .GroupBy(x => x.ccuentaafectacion)                       // Group the items by the Code
            .ToDictionary(g => g.Key , g => g.Sum(v => v.valorpagar.Value));


            comprobante = CompletarComprobante(rqmantenimiento, lcuentasporpagar.ElementAt(0).cpersona.Value);
            lcomprobantedetalle = CompletarComprobanteDetalle(rqmantenimiento,  comprobante, ltotalporcuenta);
            comprobante.actualizosaldo = true;
            foreach (tconcuentaporpagarmigrada item in lcxp) {
                item.Actualizar = true;
                item.Esnuevo = false;
                item.cusuarioautorizacion = rqmantenimiento.Cusuario;
                item.fautorizacion = rqmantenimiento.Freal;
                item.ccomprobante = comprobante.ccomprobante;
                tperproveedor prove = TperProveedorDal.Find(item.cpersona.Value, 1);
                tperpersonadetalle persona;
                tperreferenciabancaria referenciabancaria;
                string identificacion = "";
                string nombre = "";
                long cpersona = 0;
                ttestransaccion ttestransaccion = new ttestransaccion();
                if (prove != null) {
                    //persona = TperPersonaDetalleDal.FindByIdentification(prove.identificacion);
                    referenciabancaria = TperReferenciaBancariaDal.Find(prove.cpersona, 1);
                    ttestransaccion.identificacionbeneficiario = prove.identificacion;
                    ttestransaccion.nombrebeneficiario = prove.nombre;
                    identificacion = prove.identificacion;
                    nombre = prove.nombre;
                    cpersona = prove.cpersona;
                } else {
                    persona = TperPersonaDetalleDal.Find(item.cpersona.Value,1);
                    referenciabancaria = TperReferenciaBancariaDal.Find(persona.cpersona, 1);
                    ttestransaccion.identificacionbeneficiario = persona.identificacion;
                    ttestransaccion.nombrebeneficiario = persona.nombre;
                    identificacion = persona.identificacion;
                    nombre = persona.nombre;
                    cpersona = persona.cpersona;
                }
                //if (referenciabancaria == null) {
                //    throw new AtlasException("BPROV-004", "PROVEEDOR NO POSEE REFERENCIA BANCARIA {0}", cxp.cpersona.Value);
                //}

               
                //tperproveedor proveedor = TperProveedorDal.Find(cxp.cpersona.Value, cxp.ccompania.Value);
                ttestransaccion.numerocuentabeneficiario = referenciabancaria.numero;
                ttestransaccion.tipocuentaccatalogo = referenciabancaria.tipocuentaccatalogo.Value;
                ttestransaccion.tipocuentacdetalle = referenciabancaria.tipocuentacdetalle;
                ttestransaccion.institucionccatalogo = referenciabancaria.tipoinstitucionccatalogo.Value;
                ttestransaccion.institucioncdetalle = referenciabancaria.tipoinstitucioncdetalle;
                ttestransaccion.valorpago = Math.Abs(Convert.ToDecimal( item.valorpagar.Value));

                // Registro SPI
                GenerarBce.InsertarPagoBce(rqmantenimiento, identificacion, nombre, referenciabancaria.numero, cpersona, referenciabancaria.tipocuentaccatalogo.Value,
                    referenciabancaria.tipocuentacdetalle, referenciabancaria.tipoinstitucionccatalogo.Value, referenciabancaria.tipoinstitucioncdetalle,
                    Math.Abs(ttestransaccion.valorpago), item.cctaporpagarmigrada, null, comprobante.ccomprobante);
                //}

            }


            //transaccion spi o pago por bce


            //rqmantenimiento.AdicionarTabla("tconcuentaporpagarmigrada", lcxp, false);
            rqmantenimiento.AdicionarTabla("tconcomprobante", comprobante, false);
            rqmantenimiento.AdicionarTabla("tconcomprobantedetalle", lcomprobantedetalle, false);
            rqmantenimiento.Mdatos.Add("actualizarsaldosenlinea", true);
            //rqmantenimiento.Response["mayorizado"] = "OK";

        }


        /// <summary>
        /// completar comprobante contable
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="cxp"></param>
        /// <returns></returns>
        public static tconcomprobante CompletarComprobante(RqMantenimiento rqmantenimiento, long cpersona) {
            string ccomprobante = Secuencia.GetProximovalor("COMPROBANTE").ToString();
            string numerocomprobantecesantia = SecuenciaComprobanteContable.GetProximoValor(rqmantenimiento, "DIAGEN");
            string comentario = rqmantenimiento.Mdatos["comentario"].ToString();
            tconcomprobante comprobante = TconComprobanteDal.CrearComprobante(ccomprobante, rqmantenimiento.Fconatable, Constantes.GetParticion((int)rqmantenimiento.Fconatable),
                1, 0, "PR",cpersona, null, rqmantenimiento.Freal, rqmantenimiento.Fproceso, comentario, true, true, false, false, false, false, false,
                null, 3, 1, 1, 30, 10, 1003, "DIAGEN", 1, 1, 0, numerocomprobantecesantia,
                null, null, null, null, null, null, rqmantenimiento.Cusuario, rqmantenimiento.Freal, null, null);
            comprobante.Esnuevo = true;
            return comprobante;
        }


        /// <summary>
        /// completar comprobante contable detalle
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="cxp"></param>
        /// <param name="comprobante"></param>
        /// <param name="plantillaDetalle"></param>
        /// <returns></returns>
        public static List<tconcomprobantedetalle> CompletarComprobanteDetalle(RqMantenimiento rqmantenimiento, 
            tconcomprobante comprobante, Dictionary<string,decimal> ltotalxctaafectacion) {
            decimal valorCampo = 0, sumatorioDebitos = 0, sumatorioCreditos = 0;
            List<tconcomprobantedetalle> comprobanteDetalle = new List<tconcomprobantedetalle>();

            tconparametros parametro_centrocostos_default = TconParametrosDal.FindXCodigo("CENTROCOSTOS_DEFAULT", 1);
            if (parametro_centrocostos_default == null) {
                throw new AtlasException("CONTA-010", "ERROR: PARAMETROS CONTABLE [{0}] NO DEFINIDO PARA MODULO CONTABILIDAD", "CENTROCOSTOS_DEFAULT");
            }


            foreach (var item in ltotalxctaafectacion) {
                tconcomprobantedetalle cd = TconComprobanteDetalleDal.CrearComprobanteDetalle(true, comprobante, 0, null, item.Key, true, null,
                "USD", "USD", 0, 0, null, null, 1002, parametro_centrocostos_default.texto, null, null);
                cd.cclase = TconCatalogoDal.Find(comprobante.ccompania, cd.ccuenta).cclase;
                cd.suma = TmonClaseDal.Suma(cd.cclase, cd.debito);
                valorCampo = Convert.ToDecimal(item.Value);
                cd.monto = valorCampo;
                cd.montooficial = valorCampo;
                comprobanteDetalle.Add(cd);
                sumatorioDebitos += cd.monto.Value;
            }

            tconcomprobantedetalle cuentaSPI = TconComprobanteDetalleDal.CrearComprobanteDetalle(true, comprobante, 0, null, "721909097", false, null,
                "USD", "USD", 0, 0, null, null, 1002, parametro_centrocostos_default.texto, null, null);
            cuentaSPI.cclase = TconCatalogoDal.Find(comprobante.ccompania, cuentaSPI.ccuenta).cclase;
            cuentaSPI.suma = TmonClaseDal.Suma(cuentaSPI.cclase, cuentaSPI.debito);
            valorCampo = sumatorioDebitos;
            cuentaSPI.monto = valorCampo;
            cuentaSPI.montooficial = valorCampo;
            comprobanteDetalle.Add(cuentaSPI);
            sumatorioCreditos += cuentaSPI.monto.Value;

            if (sumatorioCreditos  != sumatorioDebitos) {
                throw new AtlasException("CONTA-011", "ERROR: NO ES POSIBLE GENERAR COMPROBANTE CONTABLE, VALORES INGRESADOS NO CUADRAN DEBITOS Y CREDITOS");
            }
            comprobante.montocomprobante = sumatorioCreditos;
            return comprobanteDetalle;
        }

    }
}
