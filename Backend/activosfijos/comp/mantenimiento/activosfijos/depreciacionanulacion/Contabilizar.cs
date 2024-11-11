using core.componente;
using core.servicios;
using dal.activosfijos;
using dal.contabilidad;
using dal.contabilidad.cuentasporpagar;
using dal.generales;
using dal.monetario;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace activosfijos.comp.mantenimiento.activosfijos.depreciacionanulacion {

    /// <summary>
    /// Clase que se encarga de completar información del detalle de un comprobante contable.
    /// </summary>
    public class Contabilizar : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {

            if (!rqmantenimiento.Mdatos.ContainsKey("generarcomprobante")){
                return;
            }
            if (!(bool)rqmantenimiento.Mdatos["generarcomprobante"]) {
                return;
            }

            tacfdepreciacion depreciacion = new tacfdepreciacion();
            if (rqmantenimiento.GetTabla("CABECERA").Lregistros.Count > 0) {
                depreciacion = (tacfdepreciacion)rqmantenimiento.GetTabla("CABECERA").Lregistros[0];
            }
            ContabilizarDepreciacion(rqmantenimiento, depreciacion);

        }

        public static void ContabilizarDepreciacion(RqMantenimiento rqmantenimiento, tacfdepreciacion depreciacion) {
            tconcomprobante comprobante = CompletarComprobante(rqmantenimiento,depreciacion);
            List<tconcomprobantedetalle> comprobanteDetalle = CompletarComprobanteDetalle(rqmantenimiento, depreciacion, comprobante);
            depreciacion.ccomprobante = comprobante.ccomprobante;
            rqmantenimiento.Response["ccomprobante"] = comprobante.ccomprobante;
            rqmantenimiento.Response["numerocomprobantecesantia"] = comprobante.numerocomprobantecesantia;
            rqmantenimiento.AdicionarTabla("tconcomprobante", comprobante, false);
            rqmantenimiento.AdicionarTabla("tconcomprobantedetalle", comprobanteDetalle, false);
        }

        public static tconcomprobante CompletarComprobante(RqMantenimiento rqmantenimiento, tacfdepreciacion depreciacion) {
            string ccomprobante =  Secuencia.GetProximovalor("COMPROBANTE").ToString();
            string numerocomprobantecesantia = SecuenciaComprobanteContable.GetProximoValor(rqmantenimiento, "DIAGEN");
            tconcomprobante comprobante = TconComprobanteDal.CrearComprobante(ccomprobante,rqmantenimiento.Fconatable,Constantes.GetParticion((int)rqmantenimiento.Fconatable),
                rqmantenimiento.Ccompania, 0, null, null, null, rqmantenimiento.Freal, rqmantenimiento.Fproceso, depreciacion.comentario, false, true, false, false, false, false, false,
                null, 3, rqmantenimiento.Cagencia,rqmantenimiento.Csucursal, 33,13, 1003, "DIAGEN", rqmantenimiento.Cagencia, rqmantenimiento.Csucursal, 0, numerocomprobantecesantia,
                null, null, null, null, null, null, rqmantenimiento.Cusuario, rqmantenimiento.Freal, null, null);
            comprobante.Esnuevo = true;
            return comprobante;
        }

        public static List<tconcomprobantedetalle> CompletarComprobanteDetalle(RqMantenimiento rqmantenimiento, tacfdepreciacion depreciacion,
            tconcomprobante comprobante) {
            List<tacfhistorialdepreciacion> lista = TacfDepreciacionDetalleDal.FindXCdepreciacion(depreciacion.cdepreciacion);
            List<tacfhistorialdepreciacion> lhistorialdepreciacion = new List<tacfhistorialdepreciacion>();
            List<IBean> lbase = lista.ToList<IBean>();
            List<IBean> lmantenimiento = new List<IBean>();
            List<IBean> leliminar = new List<IBean>();
            List<IBean> ldetalle = new List<IBean>();
            if (rqmantenimiento.GetTabla("DETALLE") != null) {
                if (rqmantenimiento.GetTabla("DETALLE").Lregistros.Count > 0) {
                    lmantenimiento = rqmantenimiento.GetTabla("DETALLE").Lregistros;
                }
                if (rqmantenimiento.GetTabla("DETALLE").Lregeliminar.Count > 0) {
                    leliminar = rqmantenimiento.GetTabla("DETALLE").Lregeliminar;
                }

            }
            TacfDepreciacionDetalleDal.Completar(rqmantenimiento, lmantenimiento);
            ldetalle = DtoUtil.GetMergedList(lbase, lmantenimiento, leliminar);
            foreach (tacfhistorialdepreciacion obj in ldetalle) {
                lhistorialdepreciacion.Add(obj);
            }

            List<tconcomprobantedetalle> comprobanteDetalle = new List<tconcomprobantedetalle>();
            var listaDebe = lhistorialdepreciacion.GroupBy(x => new { x.centrocostoscdetalle, x.ccuentadepreciacion })
                    .Select(y => new tconcomprobantedetalle() {
                        centrocostoscdetalle = y.Key.centrocostoscdetalle,
                        ccuenta = y.Key.ccuentadepreciacion,
                        debito = true,
                        Esnuevo = true,
                        centrocostosccatalogo = 1002,
                        monto = y.Sum(s => s.valdepperiodo),
                        montooficial = y.Sum(s => s.valdepperiodo)
                    }
            );

            foreach (tconcomprobantedetalle cd in listaDebe) {
                cd.ccomprobante = comprobante.ccomprobante;
                cd.fcontable = comprobante.fcontable;
                cd.particion = comprobante.particion;
                cd.ccompania = comprobante.ccompania;
                cd.optlock = 0;
                cd.cagencia = comprobante.cagencia;
                cd.csucursal = comprobante.csucursal;
                cd.cclase = TconCatalogoDal.Find(comprobante.ccompania, cd.ccuenta).cclase;
                cd.suma = TmonClaseDal.Suma(cd.cclase, cd.debito);
                cd.cmoneda = "USD";
                cd.cmonedaoficial = "USD";
                comprobanteDetalle.Add(cd);
            }

            var listaHaber = lhistorialdepreciacion.GroupBy(x => new { x.centrocostoscdetalle, x.ccuentadepreciacionacum })
                    .Select(y => new tconcomprobantedetalle() {
                        centrocostoscdetalle = y.Key.centrocostoscdetalle,
                        ccuenta = y.Key.ccuentadepreciacionacum,
                        debito = false,
                        Esnuevo = true,
                        centrocostosccatalogo = 1002,
                        monto = y.Sum(s => s.valdepperiodo),
                        montooficial = y.Sum(s => s.valdepperiodo)
                    }
            );


            foreach (tconcomprobantedetalle cd in listaHaber) {
                cd.ccomprobante = comprobante.ccomprobante;
                cd.fcontable = comprobante.fcontable;
                cd.particion = comprobante.particion;
                cd.ccompania = comprobante.ccompania;
                cd.optlock = 0;
                cd.cagencia = comprobante.cagencia;
                cd.csucursal = comprobante.csucursal;
                cd.cclase = TconCatalogoDal.Find(comprobante.ccompania, cd.ccuenta).cclase;
                cd.suma = TmonClaseDal.Suma(cd.cclase, cd.debito);
                cd.cmoneda = "USD";
                cd.cmonedaoficial = "USD";
                comprobanteDetalle.Add(cd);
            }
            return comprobanteDetalle;
        }
    }
}
