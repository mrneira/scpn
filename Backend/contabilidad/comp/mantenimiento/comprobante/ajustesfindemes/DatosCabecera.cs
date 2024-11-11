using core.componente;
using core.servicios;
using dal.contabilidad;
using modelo;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace contabilidad.comp.mantenimiento.comprobante.ajustesfindemes{

    public class DatosCabecera : ComponenteMantenimiento {

        /// <summary>
        /// Clase que se encarga de completar información de la cabecera de un comprobante contable.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            if (rqmantenimiento.GetTabla("CABECERA") == null || rqmantenimiento.GetTabla("CABECERA").Lregistros.Count() < 0) {
                return;
            }

            tconcomprobante cabecera = (tconcomprobante)rqmantenimiento.GetTabla("CABECERA").Lregistros.ElementAt(0);
            //int fcontable = cabecera.fcontable;
            tconperiodocontable periodofin = TconPeriodoContableDal.GetPeriodoXfperiodofin(cabecera.fcontable);
            if (periodofin == null) {
                throw new AtlasException("CONTA-014", "ERROR: PERIODO CERRADO PARA AREA CONTABLE Y/O FECHA CONTABLE NO SE ENCUENTRA DEFINIDA PARA EL PERIODO DE AJUSTE");
            }
            if (periodofin.periodocerrado) {
                throw new AtlasException("CONTA-014", "ERROR: PERIODO CERRADO PARA AREA CONTABLE Y/O FECHA CONTABLE NO SE ENCUENTRA DEFINIDA PARA EL PERIODO DE AJUSTE");
            }

            string ccomprobante = cabecera.ccomprobante;
            if (ccomprobante == null) {
                rqmantenimiento.Fconatable = cabecera.fcontable;
                ccomprobante = Secuencia.GetProximovalor("COMPROBANTE").ToString();
                cabecera.numerocomprobantecesantia = SecuenciaComprobanteContable.GetProximoValor(rqmantenimiento, cabecera.tipodocumentocdetalle);
            }

            //pregunta por el valor del key eliminar dentro del request para actualizar el campo eliminado del comprobante seleccionado
            if (rqmantenimiento.Mdatos.Keys.Contains("eliminar")) {
                TconComprobanteDal.Eliminar(rqmantenimiento, cabecera);
                rqmantenimiento.Response["numerocomprobantecesantia"] = cabecera.numerocomprobantecesantia;
                rqmantenimiento.Mdatos["ccomprobante"] = ccomprobante;
                rqmantenimiento.Mdatos["fcontable"] = cabecera.fcontable;
                return;
            }
            TconComprobanteDal.Completar(rqmantenimiento, cabecera, ccomprobante);
            // fija el numero de comprobante para utilizarlo en clases adicionales del mantenimiento.
            rqmantenimiento.Response["numerocomprobantecesantia"] = cabecera.numerocomprobantecesantia;
            rqmantenimiento.Mdatos["ccomprobante"] = ccomprobante;
            rqmantenimiento.Mdatos["fcontable"] = cabecera.fcontable;
        }
    }
}
