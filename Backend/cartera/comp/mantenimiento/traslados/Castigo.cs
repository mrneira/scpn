using cartera.datos;
using cartera.enums;
using cartera.monetario;
using cartera.traslados;
using core.componente;
using dal.cartera;
using modelo;
using monetario.util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.traslados {

    /// <summary>
    /// Clase que se encarga de ejecutar castigos de cartera.
    /// </summary>
    public class Castigo : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            Boolean ejecuto = false;
            Traslado t = new Traslado(rqmantenimiento, "C", rqmantenimiento.Fconatable);
            tcaroperacion tcarOperacion = t.GetTcarOperacion();
            if (!tcarOperacion.cestatus.Equals(EnumEstatus.VENCIDA.Cestatus)) {
                throw new AtlasException("CAR-0071", "PARA EJECUTAR CASTIGO LA OPERACIÓN TIENE QUE ESTAR VENCIDA");
            }
            rqmantenimiento.Monto = 1; // para poder reversar se registra un dolar.
            rqmantenimiento.Csucursal = (int)tcarOperacion.csucursal;
            rqmantenimiento.Cagencia = (int)tcarOperacion.cagencia;            

            // traslado de cuotas vencidas.
            ejecuto = t.ProcesarVencidas(EnumEstatus.CASTIGADA.Cestatus);
            // traslado de cuotas por vencer.
            t.ProcesarPorVencer(EnumEstatus.CASTIGADA.Cestatus);

            if (ejecuto) {
                this.CambiarEstadoOperacion(rqmantenimiento, EnumEstatus.CASTIGADA.Cestatus);
            }

            // Ejecuta contabilizacion del traslado de cartera.
            t.EjecutarMonetarioCastigo();

            // Realiza contabilizacion de un dólar de creditos castigados.
            this.RegistroDolar(rqmantenimiento, t.codigoContableDolar);
        }

        /// <summary>
        /// Si ejecuto cambio de estado, actualiza el nuevo estado en la operacion de cartera.
        /// </summary
        private void CambiarEstadoOperacion(RqMantenimiento rqmantenimiento, String cestadodestino) {
            tcaroperacion tcarOperacion = OperacionFachada.GetOperacion(rqmantenimiento).tcaroperacion;
            TcarOperacionHistoriaDal.CreaHistoria(tcarOperacion, rqmantenimiento.Mensaje, rqmantenimiento.Fconatable);
            tcarOperacion.cestatus = cestadodestino;
        }

        /// <summary>
        /// Registro de un dolar en creditos castigaos.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="codigocontable"></param>
        private void RegistroDolar(RqMantenimiento rqmantenimiento, String codigocontable) {
            RqMantenimiento rq = (RqMantenimiento)rqmantenimiento.Clone();
            tcarevento evento = MonetarioHelper.FijaTransaccion(rq, EnumEventos.REGISTRODOLARCASTIGO.Cevento);
            rq.Cambiartransaccion((int)evento.cmodulo, (int)evento.ctransaccion);
            tcaroperacion tcarOperacion = OperacionFachada.GetOperacion(rqmantenimiento).tcaroperacion;
            // EnumEventos
            RubroHelper.AdicionarRubro(rq, 1, codigocontable, 1, tcarOperacion.coperacion, tcarOperacion.cmoneda, tcarOperacion.cestatus);
            RubroHelper.AdicionarRubro(rq, 2, null, 1, tcarOperacion.coperacion, tcarOperacion.cmoneda, tcarOperacion.cestatus);

            new ComprobanteMonetario(rq);
        }
    }
}
