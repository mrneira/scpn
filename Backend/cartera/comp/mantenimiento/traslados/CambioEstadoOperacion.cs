using cartera.datos;
using cartera.enums;
using cartera.traslados;
using core.componente;
using dal.cartera;
using modelo;
using System;
using util.dto.mantenimiento;
namespace cartera.comp.mantenimiento.traslados {

    /// <summary>
    /// Clase que se encarga de ejecutar cambio de estado de cartera de cartera.
    /// </summary
    public class CambioEstadoOperacion : ComponenteMantenimiento {
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            Traslado t = new Traslado(rqmantenimiento, "T", rqmantenimiento.Fconatable);
            Boolean ejecuto = false;
            String cestatus = "";
            string pasovencido = rqmantenimiento.GetString("pasovencido");
            if (pasovencido.Equals("1")) {
                if (!t.EjecutarPasoVencido()) {
                    return;
                }
                // traslado de cuotas vencidas.
                ejecuto = t.ProcesarVencidas(EnumEstatus.VENCIDA.Cestatus);
                cestatus = EnumEstatus.VENCIDA.Cestatus;
                // traslado de cuotas por vencer.
                t.ProcesarPorVencer(EnumEstatus.NO_DEVENGA.Cestatus);
            } else if (t.EjecutarRetornoVigente()) {
                // traslado de cuotas vigente si no tiene cuotas vencidas.
                t.ProcesarVencidas(EnumEstatus.VIGENTE.Cestatus);
                // traslado de cuotas por vencer.
                t.ProcesarPorVencer(EnumEstatus.VIGENTE.Cestatus);
                ejecuto = true;
                cestatus = EnumEstatus.VIGENTE.Cestatus;
            }

            if (ejecuto) {
                this.CambiarEstadoOperacion(rqmantenimiento, cestatus);
            }

            // Ejecuta contabilizacion del traslado de cartera.
            // COMENTADO: No se ejecuta monetario de taslado de cartera por plan de cuentas.
            //t.EjecutarMonetario();
        }

        /// <summary>
        /// Si ejecuto cambio de estado, actualiza el nuevo estado en la operacion de cartera.
        /// </summary
        private void CambiarEstadoOperacion(RqMantenimiento rqmantenimiento, String cestadodestino)
        {
            tcaroperacion tcarOperacion = OperacionFachada.GetOperacion(rqmantenimiento).tcaroperacion;
            TcarOperacionHistoriaDal.CreaHistoria(tcarOperacion, rqmantenimiento.Mensaje, rqmantenimiento.Fconatable);
            tcarOperacion.cestatus = cestadodestino;
        }



    }
}
