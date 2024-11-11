using bce.util;
using cartera.datos;
using core.componente;
using dal.cartera;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.reverso {

    public class ReversoTransferenciasPendientes : ComponenteMantenimientoReverso {

        /// <summary>
        /// Reversa transferencias realizadas al spi y desembolso, por numero de mensaje.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void EjecutarReverso(RqMantenimiento rqmantenimiento) {
            tcaroperacion tcaroperacion = OperacionFachada.GetOperacion(rqmantenimiento).tcaroperacion;


            // Elimina registros SPI
            foreach (tcaroperaciondesembolso des in TcarOperacionDesembolsoDal.FindToTipo(tcaroperacion.coperacion, "T")) {
                // si no esta ejecutada la transferencia al spi no reversar.
                if (des.mensaje == null || des.mensaje != null && !des.mensaje.Equals(rqmantenimiento.Mensajereverso)) {
                    continue;
                }
                GenerarBce.EliminarPagoBce(rqmantenimiento, tcaroperacion.coperacion, des.secuencia);
            }
            // Reversa detalle de desembolso
            TcarOperacionDesembolsoDal.ReversarLiquidacionParcial(tcaroperacion.coperacion, rqmantenimiento.Mensajereverso);
        }

    }
}
