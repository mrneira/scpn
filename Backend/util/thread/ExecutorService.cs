using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using util.dto.interfaces.lote;

namespace util.thread {

    /// <summary>
    /// Clase que maneja la ejeucion de hilos, n a la vez
    /// </summary>
    public class ExecutorService {
        Queue<IPoolHiloItem> pendientes = new Queue<IPoolHiloItem>();

        List<Task> encurso = new List<Task>();

        private int? nummaximohilos = 10;

        private Boolean estacerrado = false;

        public ExecutorService(int? numerohilos) {
            this.nummaximohilos = numerohilos;
        }

        public void AgregarCola(IPoolHiloItem item) {
            pendientes.Enqueue(item);
        }

        public void Consumir() {
            //if (!estacerrado || (pendientes.Count + encurso.Count) != 0) {
                if (pendientes.Count != 0 && encurso.Count < nummaximohilos)  // Control ejcutar el maximo de tareas paralelas
                {
                    IPoolHiloItem item = pendientes.Dequeue(); // obtener de la cola
                    if (item != null) {
                        encurso.Add(Task.Run(() => { item.Ejecutar(); })); // eejcutar tarea
                    }
                } else {
                    Task.WaitAny(encurso.ToArray());
                    encurso.RemoveAll(x => x.IsCompleted); // remover las tareas terminadas
                }
            //}
        }

        public void CerrarPool() {
            if (estacerrado) {
                return;
            }
            estacerrado = true;
        }

        public Boolean EstaTerminado() {
            if (estacerrado && (pendientes.Count + encurso.Count)<=0) {
                return true;
            }
            return false;
        }

        public Boolean ExisteDisponibilidad() {
            if (pendientes.Count < nummaximohilos) {
                return true;
            }
            return false;
        }


    }
}
