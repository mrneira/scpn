using core.componente;
using core.servicios;
using dal.contabilidad;
using dal.contabilidad.cuentasporpagar;
using dal.monetario;
using modelo;
using modelo.interfaces;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace contabilidad.comp.mantenimiento.cuentasporpagar.notascreditocompras {

    /// <summary>
    /// Clase que se encarga de completar información ded detalle de notas de crédito que afectan a una cuenta por pagar
    /// </summary>
    public class Contabilizar : ComponenteMantenimiento {

        /// <summary>
        /// ejecuta la clase contabilizar del comprobante contable
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            if (rqmantenimiento.GetTabla("NOTASCREDITOCOMPRAS") == null || rqmantenimiento.GetTabla("NOTASCREDITOCOMPRAS").Lregistros.Count() < 0) {
                return;
            }

            tconparametros parametro_centrocostos_default = TconParametrosDal.FindXCodigo("CENTROCOSTOS_DEFAULT", rqmantenimiento.Ccompania);
            if (parametro_centrocostos_default == null) {
                throw new AtlasException("CONTA-010", "ERROR: PARAMETROS CONTABLE [{0}] NO DEFINIDO PARA MODULO CONTABILIDAD", "CENTROCOSTOS_DEFAULT");
            }


            List<IBean> lmantenimiento = new List<IBean>();
            int cplantilla = (int)TconParametrosDal.FindXCodigo("PLANTILLA_CONTABLE_NOTAS_CREDITO_CXP", rqmantenimiento.Ccompania).numero;
            if (cplantilla == 0) {
                throw new AtlasException("CONTA-010", "ERROR: PARAMETROS CONTABLE [{0}] NO DEFINIDO PARA MODULO CONTABILIDAD", "PLANTILLA_CONTABLE_NOTAS_CREDITO_CXP");
            }

            List<tconplantilladetalle> lplantilladetalle = TconPlantillaDetalleDal.Find(cplantilla, rqmantenimiento.Ccompania);

            if (rqmantenimiento.GetTabla("NOTASCREDITOCOMPRAS") != null) {
                if (rqmantenimiento.GetTabla("NOTASCREDITOCOMPRAS").Lregistros.Count > 0) {
                    lmantenimiento = rqmantenimiento.GetTabla("NOTASCREDITOCOMPRAS").Lregistros;
                    foreach(tconnotacreditocompras obj in lmantenimiento) {
                        if (obj.ccomprobante == null) {
                            CrearComprobante(rqmantenimiento, obj, lplantilladetalle, parametro_centrocostos_default.texto);
                        } 
                    }
                }
            }
        }


        /// <summary>
        /// crear el comprobante
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="notacredito"></param>
        /// <param name="lplantilladetalle"></param>
        /// <param name="centrocostos_default"></param>
        public static void CrearComprobante(RqMantenimiento rqmantenimiento, tconnotacreditocompras notacredito, List<tconplantilladetalle> lplantilladetalle,
            string centrocostos_default) {
            decimal valorCampo = 0, sumatorioDebitos = 0, sumatorioCreditos = 0;
            string ccomprobante = Secuencia.GetProximovalor("COMPROBANTE").ToString();
            string numerocomprobantecesantia = SecuenciaComprobanteContable.GetProximoValor(rqmantenimiento, "DIAGEN");

            tconcomprobante comprobante = TconComprobanteDal.CrearComprobante(ccomprobante, rqmantenimiento.Fconatable, Constantes.GetParticion((int)rqmantenimiento.Fconatable),
                rqmantenimiento.Ccompania, 0, null, null, null, rqmantenimiento.Freal, rqmantenimiento.Fproceso, notacredito.comentario, true, true, false, false, false,false
                , false, lplantilladetalle[0].cplantilla, null, 1, 1, 25, 10, 1003, "DIAGEN", 1, 
                1, 0, numerocomprobantecesantia,null, null, null, null, null, null, rqmantenimiento.Cusuario, rqmantenimiento.Freal, null, null);
            comprobante.Esnuevo = true;
            notacredito.ccomprobante = comprobante.ccomprobante;
            notacredito.fcontable = comprobante.fcontable;
            notacredito.particion = comprobante.particion;
            notacredito.cusuarioing = comprobante.cusuarioing;
            notacredito.fingreso = comprobante.fingreso;

            List<tconcomprobantedetalle> lcomprobantedetalle = new List<tconcomprobantedetalle>();
            foreach (tconplantilladetalle det in lplantilladetalle) {
                valorCampo = -1;
                tconcomprobantedetalle cd = TconComprobanteDetalleDal.CrearComprobanteDetalle(true, comprobante, 0, null, det.ccuenta, det.debito.Value, null,
                    "USD", "USD", 0, 0,null, null,1002, centrocostos_default, null, det.cpartida);
                cd.cclase = TconCatalogoDal.Find(comprobante.ccompania, cd.ccuenta).cclase;
                cd.suma = TmonClaseDal.Suma(cd.cclase, cd.debito);
                cd.Esnuevo = true;

                if (det.campotablacdetalle.Equals("C3") && det.ccuenta.Equals(notacredito.ccuentaafectacion)) { //BASE IMPONIBLE
                    valorCampo = notacredito.subtotal.Value;
                } else if (det.campotablacdetalle.Equals("C2")) { //total
                    valorCampo = notacredito.total.Value;
                } else if (det.campotablacdetalle.Equals("C4")) //iva
                    valorCampo = notacredito.valoriva.Value;

                if (valorCampo == -1) continue;

                cd.monto = valorCampo;
                cd.montooficial = valorCampo;
                lcomprobantedetalle.Add(cd);
                if (cd.debito.Value) sumatorioDebitos += cd.monto.Value;
                else sumatorioCreditos += cd.monto.Value;
            }

            if (sumatorioCreditos != sumatorioDebitos) {
                throw new AtlasException("CONTA-011", "ERROR: NO ES POSIBLE GENERAR COMPROBANTE CONTABLE, VALORES INGRESADOS NO CUADRAN DEBITOS Y CREDITOS");
            }
            comprobante.montocomprobante = sumatorioCreditos;

            rqmantenimiento.AdicionarTabla("tconcomprobante", comprobante, false);
            rqmantenimiento.AdicionarTabla("tconcomprobantedetalle", lcomprobantedetalle, false);
        }
    }
}
