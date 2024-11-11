using bce.util;
using cartera.datos;
using core.componente;
using modelo;
using modelo.interfaces;
using monetario.util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.desembolso {

    /// <summary>
    /// Clase que se encarga de ejecutar transferencias pendientes de un prestamo, debita la cuenta por pagar y la envia a SPI.
    /// </summary>
    public class TransferenciasPendientes : ComponenteMantenimiento {

        private tcaroperacion tcaroperacion;
        private decimal montotransferencia = 0;

        /// <summary>
        /// Ejecuta transferencias pendientes.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            this.tcaroperacion = OperacionFachada.GetOperacion(rqmantenimiento).tcaroperacion;
            List<IBean> ltranmod = null;
            if (rqmantenimiento.GetTabla("TRANSFERENCIA") != null && rqmantenimiento.GetTabla("TRANSFERENCIA").Lregistros.Count() > 0) {
                ltranmod = rqmantenimiento.GetTabla("TRANSFERENCIA").Lregistros;
            }
            if (ltranmod == null) {
                return;
            }
            rqmantenimiento.EncerarRubros();
            foreach (tcaroperaciondesembolso des in ltranmod) {
                if (des.transferencia.Value && !des.pagado.Value) {
                    this.ProcesarTransferencia(rqmantenimiento, des);
                }                    
            }

            // ejecuta el monetario
            if (rqmantenimiento.Rubros != null && !(rqmantenimiento.Rubros.Count < 1)) {
                rqmantenimiento.Monto = montotransferencia;
                new ComprobanteMonetario(rqmantenimiento);
            }
        }

        /// <summary>
        /// Ejecuta transferencia, al spi y da de baja de cuentas por pagar y envia al SPI.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="desembolso"></param>
        private void ProcesarTransferencia(RqMantenimiento rqmantenimiento, tcaroperaciondesembolso desembolso) {
            // Registro SPI si es transferencia y no esta enviada o pagada.
            montotransferencia = montotransferencia + (decimal)desembolso.valor;
            desembolso.mensaje = rqmantenimiento.Mensaje;
            desembolso.pagado = true;
            desembolso.fpago = rqmantenimiento.Fconatable;
            GenerarBce.InsertarPagoBce(rqmantenimiento, desembolso.identificacionbeneficiario,
                                    desembolso.nombrebeneficiario, desembolso.numerocuentabancaria,
                                    (int)rqmantenimiento.Cpersona, (int)desembolso.tipocuentaccatalogo, desembolso.tipocuentacdetalle, (int)desembolso.tipoinstitucionccatalogo,
                                    desembolso.tipoinstitucioncdetalle, (decimal)desembolso.valor, desembolso.coperacion, desembolso.secuencia, null);

            // adiciona rubros monetarios por cada transferencia a ejecutar.
            RqRubro rqrubro = new RqRubro(1, (decimal)desembolso.valor, this.tcaroperacion.cmoneda) {
                Coperacion = desembolso.coperacion,
                Multiple = true
            };
            rqmantenimiento.AdicionarRubro(rqrubro);
        }

    }
}