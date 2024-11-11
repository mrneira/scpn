using bce.util;
using cartera.datos;
using core.componente;
using dal.cartera;
using modelo;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.reverso {

    /// <summary>
    /// Clase que se encarga de reversar datos de tabla de pagos de cartera dado un numero del desembolso.
    /// </summary>
    public class ReversoTablaDesembolso : ComponenteMantenimientoReverso {

        /// <summary>
        /// Encera el codigo contable del desembolso.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void EjecutarReverso(RqMantenimiento rqmantenimiento)
        {
            tcaroperacion tcaroperacion = OperacionFachada.GetOperacion(rqmantenimiento).tcaroperacion;
            // Encera codigo cobtable.
            TcarOperacionRubroDal.ReversaCodigoContable(rqmantenimiento.Mensajereverso, tcaroperacion.coperacion);

            // Elimina registros SPI
            foreach (tcaroperaciondesembolso des in TcarOperacionDesembolsoDal.FindToTipo(tcaroperacion.coperacion, "T")) {
                if(!des.csaldo.Equals("SPI") && des.pagado.Value) {
                    throw new AtlasException("CAR-0087", "REVERSO DE DESEMBOLSO NO PERMITIDO EXISTEN TRANSFERENCIAS REALIZADAS VIA SPI" );
                }
                // si no esta ejecutada la transferencia al spi no reversar.
                if(des.mensaje == null || des.mensaje != null && !des.mensaje.Equals(rqmantenimiento.Mensajereverso)) {
                    continue;
                }
                GenerarBce.EliminarPagoBce(rqmantenimiento, tcaroperacion.coperacion, des.secuencia);
            }
            // Reversa detalle de desembolso
            TcarOperacionDesembolsoDal.Reversar(tcaroperacion.coperacion, rqmantenimiento.Mensajereverso);
        }

    }
}
