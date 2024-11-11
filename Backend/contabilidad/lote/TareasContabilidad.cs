using dal.cartera;
using dal.lote.contabilidad;
using modulo;
using System.Collections.Generic;
using util;
using util.dto.lote;
using util.dto.mantenimiento;
using util.thread;

namespace contabilidad.lote
{
    /// <summary>
    /// Clase que se encarga de generar comprobantes contables por sucursal oficina. La ejecucion de tareas se realiza en un hilo por cada
    /// sucursal oficina, y maneja una transaccion de base de datos independiente.
    /// </summary>
    public class TareasContabilidad : TareasModulo {

        public override void Procesar(RqMantenimiento rqmantenimiento, RequestModulo rqmodulo, int? numerohilos) {
		    try {
                this.rqmantenimiento = rqmantenimiento;
                this.rqmodulo = rqmodulo;
                rSet = TconRegistroLoteDal.LlenaResultset(rqmodulo.Fconatble, rqmodulo.Clote, rqmodulo.Cmodulo, rqmodulo.Ctareahorizontal);

                Inicializaejecucion();
                // ejecuta tareas por operacion.
                Ejecutar(numerohilos);
            } finally {
               
            }
        }
        /// <summary>
        /// Ejecuta el lote por operacion, cada operacion se ejecuta en un hilo independiente.
        /// </summary>
        /// <param name="pool"></param>
        /// <param name="idunico"></param>
        /// <param name="secuencia"></param>
        protected override void EjecutaOperacion(ExecutorService pool, Dictionary<string, object> idunico, int secuencia) {
            string key = null;
            foreach (var item in idunico) {
                key = item.Value.ToString();
            }

            RequestOperacion rqoperacion = rqmodulo.ToRequestOperacion();
            
            rqoperacion.Cregistro = key;
		    rqoperacion.Secuencia = secuencia;
            // asocia el nuemro de hilo para verificacion de numeor de hilos levantados.
            LoteRegistroHilo hiloitem = new LoteRegistroHilo(rqmantenimiento, rqoperacion);

            pool.AgregarCola(hiloitem);
	    }

    }

}
