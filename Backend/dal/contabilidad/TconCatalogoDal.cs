using modelo;
using modelo.helper;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.contabilidad {

    /// <summary>
    /// Clase que implemeta, consultas manuales de la tabla TconCatalogo.
    /// </summary>
    public class TconCatalogoDal {

        /// <summary>
        /// Metodo que entrega la definicion de una cuentacontable. Si la transaccion maneja cache, busca los datos en cahce, si no encuentra los datos en cache busca en la base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="ccompania">Codigo de compania.</param>
        /// <param name="ccuenta">Codigo de cuenta.</param>
        /// <returns></returns>
        public static tconcatalogo Find(int ccompania, string ccuenta) {
            tconcatalogo obj = null;
            String key = "" + ccompania + "^" + ccuenta;
            CacheStore cs = CacheStore.Instance;
            obj = (tconcatalogo)cs.GetDatos("tconcatalogo", key);
            if (obj == null) {
                ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tconcatalogo");
                obj = FindInDatabase(ccompania, ccuenta);
                m[key] = obj;
                cs.PutDatos("tconcatalogo", m);
            }
            return obj;
        }


        /// <summary>
        /// Entrega definicion de una cuenta contable.
        /// </summary>
        /// <param name="ccompania">Codigo de compania.</param>
        /// <param name="ccuenta">Codigo de cuenta contable.</param>
        /// <returns>TconCatalogoDto</returns>
        public static tconcatalogo FindInDatabase(int ccompania, string ccuenta) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tconcatalogo obj = null;
            obj = contexto.tconcatalogo.Where(x => x.ccompania == ccompania && x.ccuenta.Equals(ccuenta)).SingleOrDefault();
            if (obj != null) {
                EntityHelper.SetActualizar(obj);
            } 
            return obj;
        }

        /// <summary>
        /// Entrega el numero cuenta minimo del catalog.
        /// </summary>
        /// <param name="ccompania">Codigo de compania.</param>
        /// <returns>string</returns>
        public static string FindCuentaMinima(int ccompania) {
            string cuenta = "";
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try {
                cuenta = contexto.tconcatalogo.Where(x => x.ccompania == ccompania).Min(x => x.ccuenta).ToString();
            }catch (NullReferenceException) {
                return "";
            }
            return cuenta;
        }

        /// <summary>
        /// Entrega el numero de cuenta maximo del catalog.
        /// </summary>
        /// <param name="ccompania">Codigo de compania.</param>
        /// <returns>string</returns>
        public static string FindCuentaMaxima(int ccompania) {
            string cuenta = "";
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try {
                cuenta = contexto.tconcatalogo.Where(x => x.ccompania == ccompania).Max(x => x.ccuenta).ToString();
            } catch (NullReferenceException) {
                return "";
            }
            return cuenta;
        }


        /// <summary>
        /// Entrega el valor maximo de nivel usado para un plan de cuenta
        /// </summary>
        public static int MaximoNivelUsado(string tipoplancdetalle) {
            int maxNivel = 0;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try {
                maxNivel = contexto.tconcatalogo.Where(x => x.tipoplancdetalle.Equals(tipoplancdetalle)).Max(x => x.cnivel.Value);
            } catch (NullReferenceException) {
                return maxNivel;
            }
            return maxNivel;
        }

        /// <summary>
        /// Entrega el maximo valor de fcierre para tconsaldoscierre
        /// </summary>
        public static int MaximoValorFcierre() {
            int maxFcierre = 0;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try {
                maxFcierre = contexto.tconsaldoscierre.OrderByDescending(x=> x.fcierre).FirstOrDefault().fcierre;
            } catch (NullReferenceException) {
                return maxFcierre;
            }
            return maxFcierre;
        }

        public static List<tconcatalogo> GetCuentasMovimiento() {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tconcatalogo> lcuentas = new List<tconcatalogo>();
            return lcuentas = contexto.tconcatalogo.Where(x => x.movimiento.Value == true).ToList();
        }

    }
}
