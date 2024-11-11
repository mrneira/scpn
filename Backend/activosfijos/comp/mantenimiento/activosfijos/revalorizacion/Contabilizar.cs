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

namespace activosfijos.comp.mantenimiento.activosfijos.revalorizacion {

    /// <summary>
    /// Clase que se encarga de completar información ded detalle de un comprobante contable de revalorización
    /// </summary>
    public class Contabilizar : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {

            if (!rqmantenimiento.Mdatos.ContainsKey("generarcomprobante")) {
                return;
            }

            if (!(bool)rqmantenimiento.Mdatos["generarcomprobante"]) {
                return;
            }

            tacfhistorialrevalorizacion historialrevalorizacion = new tacfhistorialrevalorizacion();
            if (rqmantenimiento.GetTabla("HISTORIAL").Lregistros.Count > 0) {
                historialrevalorizacion = (tacfhistorialrevalorizacion)rqmantenimiento.GetTabla("HISTORIAL").Lregistros[0];
            }
            RegistrarRevalorizacionProducto(rqmantenimiento, historialrevalorizacion);
            ContabilizarHistorial(rqmantenimiento, historialrevalorizacion);
        }

        public static void RegistrarRevalorizacionProducto(RqMantenimiento rqMantenimiento, tacfhistorialrevalorizacion historialrevalorizacion) {
            //tacfproducto producto = TacfProductoDal.Find(historialrevalorizacion.cproducto.Value);
            tacfproductocodificado producto = TacfProductoCodificadoDal.FindxCproducto(historialrevalorizacion.cproducto.Value, historialrevalorizacion.cbarras);
            producto.vunitario = historialrevalorizacion.valoravaluo;
            producto.cusuariomod = rqMantenimiento.Cusuario;
            producto.fmodificacion = rqMantenimiento.Freal;
            rqMantenimiento.AdicionarTabla("tacfproductocodificado", producto, false);
        }

        public static void ContabilizarHistorial(RqMantenimiento rqmantenimiento, tacfhistorialrevalorizacion historialrevalorizacion) {
            tconcomprobante comprobante = CompletarComprobante(rqmantenimiento, historialrevalorizacion);
            List<tconcomprobantedetalle> comprobanteDetalle = CompletarComprobanteDetalle(rqmantenimiento, historialrevalorizacion, comprobante);
            historialrevalorizacion.ccomprobante = comprobante.ccomprobante;
            rqmantenimiento.Response["ccomprobante"] = comprobante.ccomprobante;
            rqmantenimiento.Response["numerocomprobantecesantia"] = comprobante.numerocomprobantecesantia;
            rqmantenimiento.AdicionarTabla("tconcomprobante", comprobante, false);
            rqmantenimiento.AdicionarTabla("tconcomprobantedetalle", comprobanteDetalle, false);
        }

        public static tconcomprobante CompletarComprobante(RqMantenimiento rqmantenimiento, tacfhistorialrevalorizacion historialrevalorizacion) {
            tconcomprobante comprobante = new tconcomprobante();
            comprobante.anulado = false;
            comprobante.automatico = true;
            comprobante.cagencia = rqmantenimiento.Cagencia;
            comprobante.cagenciaingreso = rqmantenimiento.Cagencia;
            comprobante.csucursal = rqmantenimiento.Csucursal;
            comprobante.csucursalingreso = rqmantenimiento.Csucursal;
            comprobante.ccompania = rqmantenimiento.Ccompania;
            comprobante.ccomprobante = Secuencia.GetProximovalor("COMPROBANTE").ToString();
            comprobante.numerocomprobantecesantia = SecuenciaComprobanteContable.GetProximoValor(rqmantenimiento, "DIAGEN");
            comprobante.freal = rqmantenimiento.Freal;
            comprobante.fproceso = rqmantenimiento.Fproceso;
            comprobante.cmodulo = 16;
            comprobante.comentario = historialrevalorizacion.comentario;
            comprobante.cuadrado = false;
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
            return comprobante;
        }

        public static List<tconcomprobantedetalle> CompletarComprobanteDetalle(RqMantenimiento rqmantenimiento, tacfhistorialrevalorizacion historialrevalorizacion,
            tconcomprobante comprobante) {
            List<tconcomprobantedetalle> lcomprobanteDetalle = new List<tconcomprobantedetalle>();

            try
            {
                tconcomprobantedetalle cdDebito = new tconcomprobantedetalle();
                cdDebito.monto = historialrevalorizacion.valoravaluo;
                cdDebito.montooficial = historialrevalorizacion.valoravaluo;
                cdDebito.Esnuevo = true;
                cdDebito.ccomprobante = comprobante.ccomprobante;
                cdDebito.fcontable = comprobante.fcontable;
                cdDebito.particion = comprobante.particion;
                cdDebito.ccompania = comprobante.ccompania;
                cdDebito.optlock = 0;
                cdDebito.cagencia = comprobante.cagencia;
                cdDebito.csucursal = comprobante.csucursal;
                cdDebito.ccuenta = historialrevalorizacion.Mdatos["ccuenta"].ToString();
                cdDebito.debito = true;
                cdDebito.cclase = TconCatalogoDal.Find(comprobante.ccompania, cdDebito.ccuenta).cclase;
                cdDebito.cmoneda = rqmantenimiento.Cmoneda == null ? "USD" : rqmantenimiento.Cmoneda;
                cdDebito.cmonedaoficial = rqmantenimiento.Cmoneda == null ? "USD" : rqmantenimiento.Cmoneda;
                cdDebito.cusuario = comprobante.cusuarioing;
                cdDebito.cmonedaoficial = rqmantenimiento.Cmoneda;
                cdDebito.suma = TmonClaseDal.Suma(cdDebito.cclase, cdDebito.debito);
                cdDebito.centrocostoscdetalle = historialrevalorizacion.Mdatos["centrocostoscdetalle"].ToString();
                cdDebito.centrocostosccatalogo = 1002;
                lcomprobanteDetalle.Add(cdDebito);

                tconcomprobantedetalle cdCredito = new tconcomprobantedetalle();
                cdCredito.monto = historialrevalorizacion.valoravaluo;
                cdCredito.montooficial = historialrevalorizacion.valoravaluo;
                cdCredito.Esnuevo = true;
                cdCredito.ccomprobante = comprobante.ccomprobante;
                cdCredito.fcontable = comprobante.fcontable;
                cdCredito.particion = comprobante.particion;
                cdCredito.ccompania = comprobante.ccompania;
                cdCredito.optlock = 0;
                cdCredito.cagencia = comprobante.cagencia;
                cdCredito.csucursal = comprobante.csucursal;
                cdCredito.ccuenta = historialrevalorizacion.Mdatos["ccuentagasto"].ToString();
                cdCredito.debito = false;
                cdCredito.cclase = TconCatalogoDal.Find(comprobante.ccompania, cdCredito.ccuenta).cclase;
                cdCredito.cmoneda = rqmantenimiento.Cmoneda == null ? "USD" : rqmantenimiento.Cmoneda;
                cdCredito.cmonedaoficial = rqmantenimiento.Cmoneda == null ? "USD" : rqmantenimiento.Cmoneda;
                cdCredito.cusuario = comprobante.cusuarioing;
                cdCredito.cmonedaoficial = rqmantenimiento.Cmoneda;
                cdCredito.suma = TmonClaseDal.Suma(cdCredito.cclase, cdCredito.debito);
                cdCredito.centrocostoscdetalle = historialrevalorizacion.Mdatos["centrocostoscdetalle"].ToString();
                cdCredito.centrocostosccatalogo = 1002;
                lcomprobanteDetalle.Add(cdCredito);
            }
            catch (Exception ex)
            {
                throw new AtlasException("ACTFIJ-005", "ERROR: CUENTA CONTABLE DE GASTO NO DEFINIDA REVALORIZAR ACTIVOS");
            }

            return lcomprobanteDetalle;
        }

        
    }
}
