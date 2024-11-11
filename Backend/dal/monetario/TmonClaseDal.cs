using modelo;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;
using util.thread;

namespace dal.monetario {

    public class TmonClaseDal {


        /// <summary>
        /// Metodo que entrega la definicion de una transaccion. Si la transaccion maneja cache, busca los datos en cahce, si no encuentra los datos en cache busca en la base, 
        /// alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="cclase">Codigo de tipo de saldo.</param>
        /// <returns>TmonClaseDto</returns>
        public static tmonclase Find(string cclase) {
            tmonclase obj = null; 
            string key = "" + cclase;
            CacheStore cs = CacheStore.Instance;

            obj = (tmonclase)cs.GetDatos("tmonclase", key);
            if (obj == null) {
                ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tmonclase");
                obj = FindInDataBase(cclase);
                m.TryAdd(key, obj);
                cs.PutDatos("tmonclase", m);
            }
            return obj;
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de una clase.
        /// </summary>
        /// <param name="cclase">Clase asociada a la categoria, Activo, Pasivo, Patrimonio.. etc.</param>
        /// <returns>TmonClaseDto</returns>
        public static tmonclase FindInDataBase(String cclase) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tmonclase obj = null;
            try {
                obj = contexto.tmonclase.Where(x => x.cclase.Equals(cclase)).Single();
            } catch (System.InvalidOperationException) {
                throw new AtlasException("BMON-004", "CLASE NO DEFINIDA EN TMONCLASE  CLASE:{0}", cclase);
            }
            return obj;
        }

        /// <summary>
        /// Metodo que indica si el movimiento suma o resta el saldo de una operacion.
        /// </summary>
        /// <param name="cclase">Codigo de clase, 1 Actiov, 2 Pasivo, 3 Patrimonio etc.</param>
        /// <param name="debito">D Indica que se hace el movimiento es de debito.</param>
        /// <returns></returns>
        public static bool Suma(String cclase, Boolean? debito) {
            bool suma = true;
            String obj = TmonClaseDal.Find(cclase).suma;
            if (!(Boolean)debito && (obj.CompareTo("D") == 0)) {
                return false;
            }
            if ((Boolean)debito && (obj.CompareTo("C") == 0)) {
                return false;
            }
            return suma;
        }

    }

}
