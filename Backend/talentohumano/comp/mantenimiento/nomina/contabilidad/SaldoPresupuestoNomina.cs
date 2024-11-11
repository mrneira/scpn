using core.servicios;
using dal.presupuesto;
using dal.talentohumano;
using modelo;
using modelo.interfaces;
using System.Collections.Generic;
using util;
using util.dto.mantenimiento;

namespace talentohumano.comp.mantenimiento.nomina.contabilidad {

    /// <summary>
    /// Clase que se encarga de actualziar saldos de las cuentas de presupuesto.
    /// </summary>
    public class SaldoPresupuestoNomina {

        /// <summary>
        /// Actualiza saldos presupuestarios del movimiento de nómina
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        public static void ActualizarSaldoPresupuesto(RqMantenimiento rqmantenimiento, tconcomprobante comprobante, List<IBean> ldetalle, tnomnomina nomina) {

            List<tpptcompromisodetalle> lcompromisodetalle = new List<tpptcompromisodetalle>();
            List<tpptcompromiso> lcompromiso = new List<tpptcompromiso>();
            List<tpptpartidagasto> lpartidagasto = new List<tpptpartidagasto>();
            List<tppthistorialpartidagasto> lhistorialpg = new List<tppthistorialpartidagasto>();
            tpptpartidagasto partidagasto;
           

           if (nomina.ccompromiso == null) {
                throw new AtlasException("TTH-004", "NO SE HA DEFINIDO EL PARAMETRO {0} ", "CCOMPROMISO EN LA NÓMINA");
            }

            tpptcompromiso compromiso = TpptCompromisoDal.FindCompromiso(nomina.ccompromiso);
            if (compromiso == null) {
                throw new AtlasException("PPTO-002", "ERROR: COMPROMISO {0} NO EXISTE O SE ENCUENTRA EN ESTADO DEVENGADO, LIBERADO O PAGADO", nomina.ccompromiso);
            }

            compromiso.estadoccatalogo = 1601;
            compromiso.estadocdetalle = "PAGADO";
            lcompromiso.Add(compromiso);

            foreach (tnomrol detalle in ldetalle) {
                tthcontratodetalle contratodetalle = TthContratoDal.FindContratoFuncionario(detalle.cfuncionario.Value);
                partidagasto = TpptPartidaGastoDal.Find(contratodetalle.partidapresupuesto, Fecha.GetAnio(rqmantenimiento.Fconatable));
                if (partidagasto == null) {
                    throw new AtlasException("PPTO-001", "ERROR: PARTIDA PRESUPUESTARIA {0} NO EXISTE", contratodetalle.partidapresupuesto);
                }
                ActualizarPartidaGasto(rqmantenimiento, detalle, partidagasto, lcompromisodetalle, lcompromiso, lpartidagasto, 
                                    lhistorialpg, nomina.ccompromiso, comprobante.ccomprobante);
            }

            if (lcompromiso.Count > 0) {
                rqmantenimiento.AdicionarTablaExistente("tpptcompromiso", lcompromiso, false);
                rqmantenimiento.AdicionarTablaExistente("tpptcompromisodetalle", lcompromisodetalle, false);
                rqmantenimiento.AdicionarTablaExistente("tppthistorialpartidagasto", lhistorialpg, false);
                rqmantenimiento.AdicionarTablaExistente("tpptpartidagasto", lpartidagasto, false);
            }

        }


        /// <summary>
        /// Actualiza datos de partida de gasto
        /// </summary>
        /// <param name="rqMantenimiento"></param>
        /// <param name="detalle"></param>
        /// <param name="partidagasto"></param>
        /// <param name="lcompromisodetalle"></param>
        /// <param name="lcompromiso"></param>
        /// <param name="lpartidagasto"></param>
        private static void ActualizarPartidaGasto(RqMantenimiento rqMantenimiento, tnomrol detalle, tpptpartidagasto partidagasto,
                                    List<tpptcompromisodetalle> lcompromisodetalle,List<tpptcompromiso> lcompromiso,
                                    List<tpptpartidagasto> lpartidagasto, List<tppthistorialpartidagasto> lhistorialpg,
                                    string ccompromiso, string ccomprobante) {

            tpptcompromisodetalle detcompromiso = TpptCompromisoDetalleDal.Find(ccompromiso, partidagasto.cpartidagasto);
            if (detcompromiso == null) {
                throw new AtlasException("PPTO-002", "ERROR: COMPROMISO {0} NO EXISTE O SE ENCUENTRA EN ESTADO DEVENGADO, LIBERADO O PAGADO", ccompromiso);
            }
            detcompromiso.valorpagado += detalle.sueldobase;
            lcompromisodetalle.Add(detcompromiso);
            
            partidagasto.vdevengado += detalle.sueldobase;
            partidagasto.vpagado += detalle.sueldobase;
            partidagasto.vsaldoporpagar = partidagasto.vcomprometido - partidagasto.vpagado;
            partidagasto.vsaldopordevengar = partidagasto.vcomprometido - partidagasto.vdevengado;

            string cafectacionpresupuestaria = Secuencia.GetProximovalor("PPTAFECTACI").ToString();

            tppthistorialpartidagasto hpg = TpptHistorialPartidaGastoDal.Crear(partidagasto, ccompromiso, cafectacionpresupuestaria,null,null, 
                ccomprobante, ConstantesPresupuesto.CONCEPTO_AFECTACION_PRESUPUESTARIA, "PAGO DE NOMINA", rqMantenimiento,0,detalle.sueldobase); 
            lhistorialpg.Add(hpg);
            lpartidagasto.Add(partidagasto);
        }
    }

}
