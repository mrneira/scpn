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
    public class PagarMigradasJudiciales : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            
            if (rqmantenimiento.GetTabla("CABECERA").Lregistros.Count > 0 &&
                rqmantenimiento.GetTabla("DETALLE").Lregistros.Count > 0) {
                List<IBean> lcxp = rqmantenimiento.GetTabla("CABECERA").Lregistros;
                List<IBean> ldetallebeneficiarios = rqmantenimiento.GetTabla("DETALLE").Lregistros;
                CompletarAutorizacion(rqmantenimiento, lcxp, ldetallebeneficiarios);
                //rqmantenimiento.Mtablas["tconcuentaporpagarmigrada"] = null;
                
            }
        }

        /// <summary>
        /// completar autorización
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="ldetalle"></param>
        public static void CompletarAutorizacion(RqMantenimiento rqmantenimiento, List<IBean> lcxp, List<IBean> ldetallebeneficiarios) {
            //bool autoriza;
            tconcomprobante comprobante = new tconcomprobante();
            List<tconcomprobantedetalle> lcomprobantedetalle = new List<tconcomprobantedetalle>();
            decimal valorpagar = 0;

            
            tconcuentaporpagarmigrada cxpmigrada = TconCuentaporpagarMigradaDal.Find(((tconcuentaporpagarmigrada)lcxp.ElementAt(0)).cctaporpagarmigrada);

            tconcxpmigjudicdetalle beneficiario = (tconcxpmigjudicdetalle)ldetallebeneficiarios.ElementAt(0);
            valorpagar = beneficiario.valorpagar;

            comprobante = CompletarComprobante(rqmantenimiento, cxpmigrada);
            comprobante.actualizosaldo = true;
            lcomprobantedetalle = CompletarComprobanteDetalle(rqmantenimiento,  comprobante, valorpagar, cxpmigrada.ccuentaafectacion );

            

            beneficiario.Esnuevo = false;
            beneficiario.ccomprobante = comprobante.ccomprobante;
            beneficiario.cusuarioing = rqmantenimiento.Cusuario;
            beneficiario.fingreso = rqmantenimiento.Freal.Date.ToString();
            beneficiario.ccomprobante = comprobante.ccomprobante;
            beneficiario.valorpagar = beneficiario.valorpagar;
            beneficiario.tipoinstitucionccatalogo = 305;
            beneficiario.tipocuentaccatalogo = 306;

            beneficiario.cctaporpagarmigrada = cxpmigrada.cctaporpagarmigrada;
            cxpmigrada.valorpagar -= valorpagar;
            if (cxpmigrada.valorpagar == 0) {
                cxpmigrada.estadocxpcdetalle = "PAGADA";
            }

            ttestransaccion ttestransaccion = new ttestransaccion();
            ttestransaccion.identificacionbeneficiario = beneficiario.cedula;
            ttestransaccion.nombrebeneficiario = beneficiario.nombrebeneficiario;
            ttestransaccion.numerocuentabeneficiario = beneficiario.numerocuenta ;
            ttestransaccion.tipocuentaccatalogo = beneficiario.tipocuentaccatalogo;
            ttestransaccion.tipocuentacdetalle = beneficiario.tipocuentacdetalle.ToString();
            ttestransaccion.institucionccatalogo = beneficiario.tipoinstitucionccatalogo;
            ttestransaccion.institucioncdetalle = beneficiario.tipoinstitucioncdetalle;
            ttestransaccion.valorpago = Math.Abs(Convert.ToDecimal( beneficiario.valorpagar));

            GenerarBce.InsertarPagoBce(rqmantenimiento, beneficiario.cedula, beneficiario.nombrebeneficiario, beneficiario.numerocuenta, null, beneficiario.tipocuentaccatalogo,
                beneficiario.tipocuentacdetalle.ToString(), beneficiario.tipoinstitucionccatalogo, beneficiario.tipoinstitucioncdetalle,
                Math.Abs(ttestransaccion.valorpago), beneficiario.cctaporpagarmigrada, null, comprobante.ccomprobante);
            //}


            rqmantenimiento.Mtablas["CABECERA"] = null;
            rqmantenimiento.Mtablas["DETALLE"] = null;

            rqmantenimiento.AdicionarTabla("tconcuentaporpagarmigrada", cxpmigrada, false);
            rqmantenimiento.AdicionarTabla("tconcxpmigjudicdetalle", beneficiario, false);
            rqmantenimiento.AdicionarTabla("tconcomprobante", comprobante, false);
            rqmantenimiento.AdicionarTabla("tconcomprobantedetalle", lcomprobantedetalle, false);
            rqmantenimiento.Mdatos.Add("actualizarsaldosenlinea", true);
            rqmantenimiento.Response["mayorizado"] = "OK";

        }


        /// <summary>
        /// completar comprobante contable
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="cxp"></param>
        /// <returns></returns>
        public static tconcomprobante CompletarComprobante(RqMantenimiento rqmantenimiento, tconcuentaporpagarmigrada cxp) {
            string ccomprobante = Secuencia.GetProximovalor("COMPROBANTE").ToString();
            string numerocomprobantecesantia = SecuenciaComprobanteContable.GetProximoValor(rqmantenimiento, "DIAGEN");
            tconcomprobante comprobante = TconComprobanteDal.CrearComprobante(ccomprobante, rqmantenimiento.Fconatable, Constantes.GetParticion((int)rqmantenimiento.Fconatable),
                1, 0, "PR", cxp.cpersona, null, rqmantenimiento.Freal, rqmantenimiento.Fproceso, rqmantenimiento.Mdatos["comentario"].ToString() , true, true, false, false, false, false, false,
                null, 3, 1, 1, 33, 10, 1003, "DIAGEN", 1, 1, 0, numerocomprobantecesantia,
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
            tconcomprobante comprobante, decimal valorpagar, string cuentaafectacion) {
            decimal valorCampo = 0, sumatorioDebitos = 0, sumatorioCreditos = 0;
            List<tconcomprobantedetalle> comprobanteDetalle = new List<tconcomprobantedetalle>();

            tconparametros parametro_centrocostos_default = TconParametrosDal.FindXCodigo("CENTROCOSTOS_DEFAULT", 1);
            if (parametro_centrocostos_default == null) {
                throw new AtlasException("CONTA-010", "ERROR: PARAMETROS CONTABLE [{0}] NO DEFINIDO PARA MODULO CONTABILIDAD", "CENTROCOSTOS_DEFAULT");
            }


            tconcomprobantedetalle cd = TconComprobanteDetalleDal.CrearComprobanteDetalle(true, comprobante, 0, null, cuentaafectacion, true, null,
            "USD", "USD", 0, 0, null, null, 1002, parametro_centrocostos_default.texto, null, null);
            cd.cclase = TconCatalogoDal.Find(comprobante.ccompania, cd.ccuenta).cclase;
            cd.suma = TmonClaseDal.Suma(cd.cclase, cd.debito);
            valorCampo = valorpagar;
            cd.monto = valorCampo;
            cd.montooficial = valorCampo;
            comprobanteDetalle.Add(cd);
            sumatorioDebitos += cd.monto.Value;

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
