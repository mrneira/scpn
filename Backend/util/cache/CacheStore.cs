using modelo.interfaces;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace util {

    /// <summary>
    /// Clase utilitaria, que se encarga de almacenar cache de datos asociados a tablas del modelo fisico.
    /// </summary>
    public class CacheStore {

        /// <summary>
        /// Objeto que almacena una instancia de cahce.
        /// </summary>
        private static volatile CacheStore instance;
        /// <summary>
        /// Objeto utilizado para hacer thread safe la obtension de una instancia de CacheStore.
        /// </summary>
        private static object syncRoot = new Object();
        /// <summary>
        /// Objeto que almacena datos dto.
        /// </summary>
        public ConcurrentDictionary<string, object> mstore = new ConcurrentDictionary<string, object>();

        /// <summary>
        /// Crea una instancia de CahceStore.
        /// </summary>
        private CacheStore() { }

        /// <summary>
        /// Entrega una instancia de CacheStore.
        /// </summary>
        public static CacheStore Instance {
            get {
                if (instance == null) {
                    lock (syncRoot) {
                        if (instance == null)
                            instance = new CacheStore();
                    }
                }
                return instance;
            }
        }

        /// <summary>
        /// Encera datos de cache cuando esta almacenada una lista de objetos.
        /// </summary>
        /// <param name="mDatos"></param>
        private void EncerarObjeto(ConcurrentDictionary<string, object> mDatos) {
            if (mDatos == null) {
                return;
            }
            foreach (var key in mDatos.Keys) {
                object obj = mDatos[key];
                if (obj is List<object>) {
                    ((List<object>)obj).Clear();
                }
            }
            mDatos.Clear();
        }

        /// <summary>
        /// Elimina de cache un dto.
        /// </summary>
        /// <param name="beanName"></param>
        public void Encerar(String beanName) {
            String key = beanName;

            if (beanName.IndexOf('.') > 0) {
                String[] st = ((string)beanName).Split('.');
                foreach (string obj in st) {
                    key = obj;
                }
            }
            if (!mstore.ContainsKey(key)) {
                return;
            }
            ConcurrentDictionary<string, object> mdata = (ConcurrentDictionary<string, object>)mstore[key];
            this.EncerarObjeto(mdata);

            Object val;
            mstore.TryRemove(key, out val);
        }

        /// <summary>
        /// Encera todo el cache de la palicacion.
        /// </summary>
        public void EncerarTodo() {
            foreach (var key in mstore.Keys) {
                object obj = mstore[key];
                this.EncerarObjeto((ConcurrentDictionary<string, object>)obj);
            }
        }

        /// <summary>
        /// Metodo que entrega datos dado el bean y el key de los datos.
        /// </summary>
        /// <param name="beanName">Nombre del bean.</param>
        /// <param name="key">Key de datos</param>
        /// <returns></returns>
        public Object GetDatos(String beanName, String key) {
            if (!mstore.ContainsKey(beanName)) {
                return null;
            }
            ConcurrentDictionary<string, object> mdata = (ConcurrentDictionary<string, object>)mstore[beanName];
            if (mdata.ContainsKey(key)) {
                return mdata[key];
            }
            return null;
        }

        /// <summary>
        /// Metodo que entrega la defincion de un map, si existe en cache, sino existe crea un Map.
        /// </summary>
        /// <param name="beanName">Nombre del bean.</param>
        /// <returns>ConcurrentDictionary<string, object></returns>
        public ConcurrentDictionary<string, object> GetMapDefinicion(String beanName) {
            ConcurrentDictionary<string, object> mdata = null;
            if (!mstore.ContainsKey(beanName)) {
                mdata = new ConcurrentDictionary<string, object>();
                return mdata;
            }
            mdata = (ConcurrentDictionary<string, object>)mstore[beanName];
            return mdata;
        }

        /// <summary>
        /// Metodo que adiciona datos de una tabla al cache.
        /// </summary>
        /// <param name="beanName">Nombre del bean.</param>
        /// <param name="datos">Datos a adicionar al cache.</param>
        public void PutDatos(String beanName, Object datos) {
            if (datos is List<IBean>) {
                if (((List<IBean>)datos).Count <= 0) {
                    return;
                }
            }
            mstore[beanName] = datos;
        }

    }

}


