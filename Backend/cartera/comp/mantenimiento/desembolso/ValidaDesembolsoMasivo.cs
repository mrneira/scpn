using cartera.saldo;
using core.componente;
using core.servicios;
using core.servicios.mantenimiento;
using modelo;
using Newtonsoft.Json;
using System.Collections.Generic;
using util;
using util.dto.mantenimiento;
using util.thread;

namespace cartera.comp.mantenimiento.desembolso {

    /// <summary>
    /// Clase que se encarga de validar los datos de operaciones para desembolso masivo.
    /// </summary>
    public class ValidaDesembolsoMasivo : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            if (rqmantenimiento.GetDatos("OPERACIONESDESEMBOLSOMASIVO") == null) {
                return;
            }

            ValidaDesembolso(rqmantenimiento);
        }

        /// <summary>
        /// Valida informacion de desembolso con transferencia SPI.
        /// </summary>
        /// <param name="rqmantenimiento">Datos del requet con los que se ejecuta la transaccion.</param>
        private void ValidaDesembolso(RqMantenimiento rqmantenimiento)
        {
            List<tcaroperacion> loperaciones = JsonConvert.DeserializeObject<List<tcaroperacion>>(rqmantenimiento.Mdatos["OPERACIONESDESEMBOLSOMASIVO"].ToString());

            foreach (tcaroperacion ope in loperaciones) {
                //Saldos desembolso
                SaldoDesembolso saldo = new SaldoDesembolso(ope, rqmantenimiento.Fconatable);

                // Ejecuta desembolso
                RqMantenimiento rq = (RqMantenimiento)rqmantenimiento.Clone();
                rq.Mensaje = Servicio.GetMensaje(rq.Cusuario);
                ThreadNegocio.GetDatos().Secuenciamonetario = Constantes.UNO;
                rq.EncerarRubros();
                rq.Coperacion = ope.coperacion;
                rq.Monto = saldo.MontoDesembolsar;
                if (saldo.Absorcion > Constantes.CERO) {
                    rq.AddDatos("montoabsorcion", saldo.Absorcion);
                }
                Mantenimiento.ProcesarAnidado(rq, 7, 129);
            }

        }
    }
}
