using dal.garantias;
using modulo;
using System.Collections.Generic;
using util;
using util.dto.lote;
using util.dto.mantenimiento;
using util.thread;

namespace garantias.lote {
    /// <summary>
    /// Clase que se encarga de ejecutar tareas de operaciones de garantias. La ejecucion de tareas se realiza en un hilo por cada operacion, y
    /// maneja una transaccion de base de datos independiente.
    /// </summary>
    public class TareasGarantia : TareasModulo {

        readonly log4net.ILog logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        public override void Procesar(RqMantenimiento rqmantenimiento, RequestModulo rqmodulo, int? numerohilos)
        {
            try {
                this.rqmantenimiento = rqmantenimiento;
                this.rqmodulo = rqmodulo;
                rSet = TgarOperacionLoteDal.LlenaResultset(rqmodulo.Fconatble, rqmodulo.Clote, rqmodulo.Cmodulo, rqmodulo.Ctareahorizontal);

                Inicializaejecucion();
                // ejecuta tareas por operacion.
                Ejecutar(numerohilos);
            }
            finally {

            }
        }

        protected override void EjecutaOperacion(ExecutorService pool, Dictionary<string, object> idunico, int secuencia)
        {
            string key = null;
            foreach (var item in idunico) {
                key = item.Value.ToString();
            }

            logger.Info("procesando fin de dia cuenta =====> " + key);
            RequestOperacion rqoperacion = rqmodulo.ToRequestOperacion();

            rqoperacion.Coperacion = key;
            rqoperacion.Secuencia = secuencia;
            // asocia el nuemro de hilo para verificacion de numeor de hilos levantados.
            LoteOperacionHilo hiloitem = new LoteOperacionHilo(rqmantenimiento, rqoperacion);

            pool.AgregarCola(hiloitem);
        }

    }

}
