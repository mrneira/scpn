using modelo.helper;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Remoting;
using System.Text;
using System.Threading.Tasks;
using util;
using util.servicios.ef;

namespace util.dto.mantenimiento {

    /// <summary>
    /// Objeto que contiene registros asociados a una tabla a dar eliminar, insertar o actulializar en la base de datos.
    /// </summary>
    public class Tabla {
        /// <summary>
        /// Nombre de la tabla.
        /// </summary>
        private string nombre;
        /// <summary>
        /// true indica que los datos de la tabla se envian a un sp.
        /// </summary>
        private bool? enviarSP;
        /// <summary>
        /// Lista de objetos a eliminar de en la base de datos.
        /// </summary>
        private List<IBean> lregeliminar = new List<IBean>();
        /// <summary>
        /// Lista de objetos a insertar o actualizar en la base de datos.
        /// </summary>
        private List<IBean> lregistros = new List<IBean>();
        /// <summary>
        /// Objeto a insertar o actualizar en la base de datos.
        /// </summary>
        private object registro;

        public string Nombre { get => nombre; set => nombre = value; }
        public List<IBean> Lregeliminar { get => lregeliminar; set => lregeliminar = value; }
        public List<IBean> Lregistros { get => lregistros; set => lregistros = value; }
        public object Registro { get => registro; set => registro = value; }
        public bool? EnviarSP { get => enviarSP; set => enviarSP = value; }

        /// <summary>
        /// Crea una instancia de Tabla.
        /// </summary>
        /// <param name="nombre">Nombre de la tabla.</param>
        public Tabla(string nombre) {
            this.nombre = nombre;
        }


        /// <summary>
        /// Metodo que se encarga de almacenar en la base de datos los registros de insert, update o delete.
        /// </summary>
        public void Grabar() {
            this.Eliminar();
            this.Grabaregistros();
            if (this.registro != null && this.registro is AbstractDto) {
                if (((AbstractDto)this.registro).Actualizar) {
                    Sessionef.Actualizar((IBean)this.registro);
                } else {
                    Sessionef.Grabar((IBean)this.registro);
                }
            }

        }

        /// <summary>
        /// Metodo que envia la base de datos registros de insert o de update.
        /// </summary>
        private void Grabaregistros() {
            if (this.lregistros.Capacity <= 0) {
                if (registro != null) {
                    lregistros.Add((IBean)registro);
                }
            }

            if (this.lregistros.Capacity <= 0) {
                return;
            }

            int lsecuencial = 0;

            foreach (object obj in this.lregistros) {
                if (!(obj is AbstractDto)) {
                    continue;
                }
                AbstractDto bean = (AbstractDto)obj;
                if (((AbstractDto)obj).Actualizar) {
                    Sessionef.Actualizar((IBean)bean);
                } else {
                    // Manejo de secuencias automaticas.
                    ObjectHandle handle = Activator.CreateInstance("core", "core.util.SecuenciaImp");
                    object sec = handle.Unwrap();
                    ISecuencia s = (ISecuencia)sec;
                    s.SetSecuencia(bean, this.nombre, ref lsecuencial);
                    Sessionef.Grabar((IBean)bean);
                }
            }
        }

        /// <summary>
        /// Metodo que agrega la secuencia(TGENSECUENCIA) a todos los registros.
        /// </summary>
        public void AgregaTgenSecuenciaRegistros() {
            if (this.lregistros.Capacity <= 0) {
                return;
            }
            foreach (object obj in this.lregistros) {
                if (!(obj is AbstractDto)) {
                    continue;
                }
                AbstractDto IBean = (AbstractDto)obj;
                if (!((AbstractDto)obj).Actualizar) {
                    // Manejo de secuencias automaticas.
                    //Secuencia s = (Secuencia)Class.forName("com.flip.core.general.util.GeneraTgenSeuencia").newInstance();
                    //s.setSecuencia((AbstractDto)IBean, this.nombre);
                }
            }
        }

        /// <summary>
        /// Metodo que elimina registros de la base de datos. Elimina los registros en orden inverso al de llega, si es un maestro detalle sprimero llega el padre y luego el hijo, en estos hasy que elimianr el hijo y luego el padre.
        /// </summary>
        private void Eliminar() {
            if (this.lregeliminar.Count <= 0) {
                return;
            }

            int size = this.lregeliminar.Count;
            for (int i = size; i > 0; i--) {
                Object obj = this.lregeliminar[i - 1];
                if (!(obj is AbstractDto)) {
                    continue;
                }
                AbstractDto bean = (AbstractDto)obj;
                Sessionef.Eliminar((IBean)bean);
            }
        }

        /// <summary>
        /// Si es un form adiciona el objeto simple a a la variable registro.
        /// </summary>
        /// <param name="lDatos">Lista de datos a verificar si es un objeto simple.</param>
        /// <returns></returns>
        private bool Esform(List<IBean> lDatos) {
            if (lDatos.Capacity == 1 && lDatos[0] is AbstractDto) {
                this.registro = lDatos[0];
                if (((AbstractDto)this.registro).GetDatos("esform") == null ? false : (bool)((AbstractDto)this.registro).GetDatos("esform")) {
                    return true;
                }
                this.registro = null;
            }
            return false;
        }

        /// <summary>
        /// Metodo que adiciona registros a actualizar en la base.
        /// </summary>
        /// <param name="lDatos">Lista de datos a insertar.</param>
        public void AddInsertados(List<IBean> lDatos) {
            if (lDatos.Capacity <= 0) {
                return;
            }
            if (this.Esform(lDatos)) {
                return;
            }
            foreach (object obj in lDatos) {
                this.lregistros.Add((IBean)obj);
            }
        }

        /// <summary>
        /// Metodo que adiciona registros a actualizar en la base.
        /// </summary>
        /// <param name="lDatos">Lista de datos a actualizar en la base de datos.</param>
        public void AddModificados(List<IBean> lDatos) {
            if (lDatos.Capacity <= 0) {
                return;
            }
            if (this.Esform(lDatos)) {
                ((AbstractDto)this.registro).Actualizar = true;
                return;
            }
            foreach (Object obj in lDatos) {
                if (obj is AbstractDto) {

                    ((AbstractDto)obj).Actualizar = true;
                }
                this.lregistros.Add((IBean)obj);
            }
        }

        /// <summary>
        /// Metodo que adiciona registros a eliminar de la base.
        /// </summary>
        /// <param name="lDatos">Lista de datos a eliminar.</param>
        public void AddEliminados(List<IBean> lDatos) {
            if (lDatos.Capacity <= 0) {
                return;
            }
            foreach (Object obj in lDatos) {
                this.lregeliminar.Add((IBean)obj);
            }
        }

    }

}