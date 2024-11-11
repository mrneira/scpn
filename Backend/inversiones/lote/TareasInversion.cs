using dal.cartera;
using dal.lote.contabilidad;
using modulo;
using System.Collections.Generic;
using util;
using util.dto.lote;
using util.dto.mantenimiento;
using util.thread;

namespace inversiones.lote
{
    /// <summary>
    /// Clase que se encarga de generar las operaciones del accrual diario de inversiones. La ejecucion de tareas se realiza en un hilo.
    /// </summary>
    public class TareasInversion : TareasModulo
    {

        /// <summary>
        /// Elimina e inserta la operación para la generación del accrual diario.
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento con el que se ejecuta la transaccion.</param>
        /// <param name="rqmodulo">Request de módulo con el que se ejecuta la transaccion.</param>
        /// <param name="numerohilos">Número de hilos.</param>
        /// <returns></returns>
        public override void Procesar(RqMantenimiento rqmantenimiento, RequestModulo rqmodulo, int? numerohilos)
        {
            try
            {
                this.rqmantenimiento = rqmantenimiento;
                this.rqmodulo = rqmodulo;
                //rSet = TinvInversionLoteDal.LlenaResultset(rqmodulo.Fconatble, rqmodulo.Clote, rqmodulo.Cmodulo, rqmodulo.Ctareahorizontal);

                Inicializaejecucion();
                Ejecutar(numerohilos);
            }
            finally
            {

            }
        }
        /// <summary>
        /// Ejecuta el lote por operacion, cada operacion se ejecuta en un hilo independiente.
        /// </summary>
        /// <param name="pool">Ejecutor del servicio.</param>
        /// <param name="idunico">Identificador único del proceso.</param>
        /// <param name="secuencia">SEcuencia con la cual se ejecuta la operación.</param>
        protected override void EjecutaOperacion(ExecutorService pool, Dictionary<string, object> idunico, int secuencia)
        {
            long key = 0;
            foreach (var item in idunico)
            {
                key = long.Parse(item.Value.ToString());
            }

            //logger.Error("procesando fin de dia cuenta =====> " + key);
            RequestOperacion rqoperacion = rqmodulo.ToRequestOperacion();

            rqoperacion.Cregistronumero = key;
            rqoperacion.Secuencia = secuencia;
            // asocia el nuemro de hilo para verificacion de numeor de hilos levantados.
            LoteInversionHilo hiloitem = new LoteInversionHilo(rqmantenimiento, rqoperacion);

            pool.AgregarCola(hiloitem);
        }
    }
}
