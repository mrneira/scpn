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

namespace contabilidad.comp.mantenimiento.cuentasporcobrar {

    /// <summary>
    /// Clase que se encarga de completar información ded detalle de un comprobante contable.
    /// </summary>
    public class CobrarMigradas : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            
            if (rqmantenimiento.GetTabla("tconcuentaporcobrarmigrada").Lregistros.Count > 0) {
                List<IBean> lmantenimiento = rqmantenimiento.GetTabla("tconcuentaporcobrarmigrada").Lregistros;
                CompletarAutorizacion(rqmantenimiento, lmantenimiento);
                //rqmantenimiento.Mtablas["tconcuentaporpagarmigrada"] = null;
                
            }
        }

        /// <summary>
        /// completar autorización
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="ldetalle"></param>
        public static void CompletarAutorizacion(RqMantenimiento rqmantenimiento, List<IBean> lcxc) {
            //bool autoriza;
            tconcomprobante comprobante = new tconcomprobante();
            List<tconcomprobantedetalle> lcomprobantedetalle = new List<tconcomprobantedetalle>();
            List<tconcuentaporcobrarmigrada> lcuentasporcobrar = new List<tconcuentaporcobrarmigrada>();

            foreach (tconcuentaporcobrarmigrada item in lcxc) {
                lcuentasporcobrar.Add(item);
            }


            var ltotalporcuenta = lcuentasporcobrar                      // No flattening
            .GroupBy(x => x.ccuentaafectacion)                       // Group the items by the Code
            .ToDictionary(g => g.Key , g => g.Sum(v => v.valorcobrar.Value));



            foreach (tconcuentaporcobrarmigrada item in lcxc) {
                comprobante = CompletarComprobante(rqmantenimiento, item);
                lcomprobantedetalle = CompletarComprobanteDetalle(rqmantenimiento, comprobante, ltotalporcuenta );
                comprobante.actualizosaldo = true;
                item.Actualizar = true;
                item.Esnuevo = false;
                item.estadocxccdetalle = "COBRAD";
                item.cusuariocobro = rqmantenimiento.Cusuario;
                item.fcobro = rqmantenimiento.Freal;
                item.ccomprobante = comprobante.ccomprobante;
            }
            rqmantenimiento.AdicionarTabla("tconcomprobante", comprobante, false);
            rqmantenimiento.AdicionarTabla("tconcomprobantedetalle", lcomprobantedetalle, false);
            rqmantenimiento.Mdatos.Add("actualizarsaldosenlinea", true);

        }


        /// <summary>
        /// completar comprobante contable
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="cxp"></param>
        /// <returns></returns>
        public static tconcomprobante CompletarComprobante(RqMantenimiento rqmantenimiento, tconcuentaporcobrarmigrada cxc) {
            string ccomprobante = Secuencia.GetProximovalor("COMPROBANTE").ToString();
            string numerocomprobantecesantia = SecuenciaComprobanteContable.GetProximoValor(rqmantenimiento, "INGRES");
            tconcomprobante comprobante = TconComprobanteDal.CrearComprobante(ccomprobante, rqmantenimiento.Fconatable, Constantes.GetParticion((int)rqmantenimiento.Fconatable),
                1, 0, "PR",cxc.cpersona, null, rqmantenimiento.Freal, rqmantenimiento.Fproceso, cxc.comentario.Trim() , true, true, false, false, false, false, false,
                null, 3, 1, 1, 37, 10, 1003, "INGRES", 1, 1, 0, numerocomprobantecesantia,
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

            tconparametros cuenta_bancos_fondos = TconParametrosDal.FindXCodigo("CUENTABANCOS1", 1);
            if (cuenta_bancos_fondos == null) {
                throw new AtlasException("CONTA-010", "ERROR: PARAMETROS CONTABLE [{0}] NO DEFINIDO PARA MODULO CONTABILIDAD", "CUENTABANCOS1");
            }

            foreach (var item in ltotalxctaafectacion) {
                tconcomprobantedetalle cd = TconComprobanteDetalleDal.CrearComprobanteDetalle(true, comprobante, 0, null, item.Key, false, null,
                "USD", "USD", 0, 0, null, null, 1002, parametro_centrocostos_default.texto, null, null);
                cd.cclase = TconCatalogoDal.Find(comprobante.ccompania, cd.ccuenta).cclase;
                cd.suma = TmonClaseDal.Suma(cd.cclase, cd.debito);
                valorCampo = Convert.ToDecimal(item.Value);
                cd.monto = valorCampo;
                cd.montooficial = valorCampo;
                comprobanteDetalle.Add(cd);
                sumatorioDebitos += cd.monto.Value;
            }

            tconcomprobantedetalle cuentaBancos = TconComprobanteDetalleDal.CrearComprobanteDetalle(true, comprobante, 0, null, cuenta_bancos_fondos.texto, true, null,
                "USD", "USD", 0, 0, null, null, 1002, parametro_centrocostos_default.texto, null, null);
            cuentaBancos.cclase = TconCatalogoDal.Find(comprobante.ccompania, cuentaBancos.ccuenta).cclase;
            cuentaBancos.suma = TmonClaseDal.Suma(cuentaBancos.cclase, cuentaBancos.debito);
            valorCampo = sumatorioDebitos;
            cuentaBancos.monto = valorCampo;
            cuentaBancos.montooficial = valorCampo;
            comprobanteDetalle.Add(cuentaBancos);
            sumatorioCreditos += cuentaBancos.monto.Value;

            if (sumatorioCreditos  != sumatorioDebitos) {
                throw new AtlasException("CONTA-011", "ERROR: NO ES POSIBLE GENERAR COMPROBANTE CONTABLE, VALORES INGRESADOS NO CUADRAN DEBITOS Y CREDITOS");
            }
            comprobante.montocomprobante = sumatorioCreditos;
            return comprobanteDetalle;
        }

    }
}
