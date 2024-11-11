using cartera.datos;
using cartera.helper;
using core.servicios.mantenimiento;
using dal.cartera;
using modelo;
using System;
using System.Collections.Generic;
using util;
using util.dto.interfaces.lote;
using util.dto.mantenimiento;

namespace cartera.lote.operacion
{
    /// <summary>
    /// Clase que se encarga de ejecutar paso a vigente de cartera en lotes.
    /// </summary>
    public class ReajusteTasa : ITareaOperacion {

        public void Ejecutar(RqMantenimiento rqmantenimiento, RequestOperacion requestoperacion) {
            Operacion operacion = OperacionFachada.GetOperacion(rqmantenimiento);
            tcaroperacion tcarOperacion = operacion.Tcaroperacion;
            TasasOperacion to = new TasasOperacion(tcarOperacion.coperacion);
            to.CambiarTasa(tcarOperacion.cfrecuecia??0);
            if (to.IsCambioTasa()) {
                // ejecutar cambio de tasa.
                rqmantenimiento.Monto = Decimal.Zero;
                this.EjecutarCambioTasa(rqmantenimiento);
            }
        }

        /// <summary>
        /// Ejeucta el reajuste de tasa de la operacion de cartera.
        /// </summary>
        private void EjecutarCambioTasa(RqMantenimiento rqmantenimiento) {
            rqmantenimiento.EncerarTablas();
            rqmantenimiento.AddDatos("ejecutoreajustetasa", "0");
		    tcarevento evento = TcarEventoDal.Find("REAJUSTE-TASA"); // 7-507
            rqmantenimiento.Cmodulotranoriginal = (int)evento.cmodulo;
            rqmantenimiento.Ctranoriginal = (int)evento.ctransaccion;
            Mantenimiento.ProcesarAnidado(rqmantenimiento, evento.cmodulo??0, evento.ctransaccion??0);
		    // Para grabar la nueva tabla de pagos.
		    rqmantenimiento.Grabar();
            // Encera las tablas que ya grabo.
            rqmantenimiento.EncerarTablas();
        }

    }
}
