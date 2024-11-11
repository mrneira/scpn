using core.componente;
using core.servicios;
using dal.contabilidad;
using dal.presupuesto;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace presupuesto.comp.mantenimiento.ingresocompromiso
{

    public class Aprobar : ComponenteMantenimiento {

        /// <summary>
        /// Clase que se encarga de registrar las partidas presupuestarias 
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
                      

            if (rqmantenimiento.GetTabla("DETALLE") == null || rqmantenimiento.GetTabla("DETALLE").Lregistros.Count() < 0) {
                return;
            }
            List<IBean> ldetalle = rqmantenimiento.GetTabla("DETALLE").Lregistros.ToList();
            string ccomprobante = rqmantenimiento.Mdatos["ccomprobante"].ToString();
            int fcontable = int.Parse( rqmantenimiento.Mdatos["fcontable"].ToString());
            int ccompania = int.Parse(rqmantenimiento.Mdatos["ccompania"].ToString());

            List<tpptcompromiso> lcompromiso = new List<tpptcompromiso>();
            List<tpptpartidagasto> lpartidagasto = new List<tpptpartidagasto>();
            List<tppthistorialpartidagasto> lhistorialpg = new List<tppthistorialpartidagasto>();
            tconcomprobante comprobante = TconComprobanteDal.FindComprobante(ccomprobante, fcontable, ccompania);
            comprobante.aprobadopresupuesto = true;
            ActualizarEstadoDevengadoCompromisoPartida(rqmantenimiento, ldetalle, lcompromiso, lpartidagasto, lhistorialpg, comprobante, rqmantenimiento);
            rqmantenimiento.AdicionarTabla("tconcomprobante", comprobante, false);
            rqmantenimiento.AdicionarTabla("tpptcompromiso", lcompromiso, false);
            rqmantenimiento.AdicionarTabla("tpptpartidagasto", lpartidagasto, false);
            rqmantenimiento.AdicionarTabla("tppthistorialpartidagasto", lhistorialpg, false);
        }


        public static void ActualizarEstadoDevengadoCompromisoPartida(RqMantenimiento rqmantenimiento, List<IBean> ldetalle, List<tpptcompromiso> lcompromiso, 
            List<tpptpartidagasto> lpartidagasto, List<tppthistorialpartidagasto> lhistorialpg, tconcomprobante comprobante, RqMantenimiento rqMantenimiento) {

            foreach (tconcomprobantedetalle detalle in ldetalle) {
                if (string.IsNullOrEmpty(detalle.ccompromiso) || string.IsNullOrEmpty(detalle.cpartida)) continue;
                if (detalle.ccompromiso.Trim().Equals("") || detalle.cpartida.Trim().Equals("")) continue;

                tpptcompromiso compromiso = TpptCompromisoDal.FindCompromiso(detalle.ccompromiso);
                if (compromiso == null) {
                    throw new AtlasException("PPTO-004", "ERROR: COMPROMISO {0} NO EXISTE", detalle.ccompromiso);
                }

                if (compromiso.estadocdetalle.Equals("INGRES")) {
                    throw new AtlasException("PPTO-002", "ERROR: COMPROMISO {0} SE ENCUENTRA EN ESTADO INGRESADO, PAGADO O LIBERADO", detalle.ccompromiso);
                }

                compromiso.estadoccatalogo = 1601;
                compromiso.estadocdetalle = "DEVENG";
                lcompromiso.Add(compromiso);

                tpptcompromisodetalle compromisodetalle = TpptCompromisoDetalleDal.Find(detalle.ccompromiso, detalle.cpartida);
                if (compromisodetalle == null) {
                    throw new AtlasException("PPTO-003", "ERROR: COMPROMISO {0} Y PARTIDA {1} NO SE ENCUENTRAN REGISTRADOS", detalle.ccompromiso, detalle.cpartida);
                }

                /*if ((Math.Abs(compromisodetalle.valor - detalle.monto.Value) > Convert.ToDecimal("0.01")) && compromiso.afectacionparcial == false) {
                    throw new AtlasException("PPTO-005", "ERROR: VALOR COMPROMETIDO {0} ES DIFERENTE DE VALOR REGISTRADO EN DETALLE {1}",
                        compromisodetalle.valor, detalle.monto);
                }*/

                tpptpartidagasto partidagasto = TpptPartidaGastoDal.Find(detalle.cpartida, Fecha.GetAnio(rqMantenimiento.Fconatable));
                if (partidagasto == null) {
                    throw new AtlasException("PPTO-001", "ERROR: PARTIDA PRESUPUESTARIA {0} NO EXISTE", detalle.cpartida);
                }
                TpptPartidaGastoHistoriaDal.CreaHistoria(partidagasto, rqmantenimiento.Fconatable);
                partidagasto.vdevengado += detalle.monto;
                partidagasto.vsaldoporpagar = partidagasto.vdevengado - partidagasto.vpagado;
                //partidagasto.vsaldoporpagar = partidagasto.vcomprometido - partidagasto.vpagado;
                //partidagasto.vsaldopordevengar = partidagasto.vcomprometido - partidagasto.vdevengado;
                lpartidagasto.Add(partidagasto);
                string cafectacion = Secuencia.GetProximovalor("PPTAFECTACI").ToString();

                tppthistorialpartidagasto hpg = TpptHistorialPartidaGastoDal.Crear(partidagasto, compromisodetalle.ccompromiso, cafectacion,null,null, detalle.ccomprobante, 
                    ConstantesPresupuesto.CONCEPTO_AFECTACION_PRESUPUESTARIA, comprobante.comentario, rqMantenimiento,0,detalle.monto.Value);
                lhistorialpg.Add(hpg);
            }
        }
    }
}
