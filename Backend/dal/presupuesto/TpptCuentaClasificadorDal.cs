using modelo;
using modelo.helper;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.presupuesto {

    /// <summary>
    /// Clase que implemeta, consultas manuales de la tabla TconCatalogo.
    /// </summary>
    public class TpptCuentaClasificadorDal
    {

        /// <summary>
        /// Metodo que entrega la definicion de una cuentacontable y de presupuesto. 
        /// Si la transaccion maneja cache, busca los datos en cahce, si no encuentra los datos en cache busca en la base, 
        /// alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="ccompania">Codigo de compania.</param>
        /// <param name="ccuenta">Codigo de cuenta.</param>
        /// <param name="comodulo">Codigo de modulo.</param> 
        /// <returns></returns>
        public static tpptcuentaclasificador Find(int ccompania, string ccuenta, int cmodulo)
        {
            tpptcuentaclasificador obj = null;
            String key = "" + ccompania + "^" + ccuenta + "^" + cmodulo;
            CacheStore cs = CacheStore.Instance;
            obj = (tpptcuentaclasificador)cs.GetDatos("tpptcuentaclasificador", key);
            if (obj == null)
            {
                ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tpptcuentaclasificador");
                obj = FindInDatabase(ccompania, ccuenta, cmodulo);
                m[key] = obj;
                cs.PutDatos("tpptcuentaclasificador", m);
            }
            return obj;
        }


        /// <summary>
        /// Entrega definicion de una cuenta contable y de presupuesto.
        /// </summary>
        /// <param name="ccompania">Codigo de compania.</param>
        /// <param name="ccuenta">Codigo de cuenta contable.</param>
        /// <param name="cclasificador">Codigo de clasificador.</param>
        /// <returns>tpptcuentaclasificador</returns>
        public static tpptcuentaclasificador FindInDatabase(int ccompania, string ccuenta, int cmodulo)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tpptcuentaclasificador obj = null;
            obj = contexto.tpptcuentaclasificador.Where(x => x.ccompania == ccompania
                                        && x.ccuenta.Equals(ccuenta)
                                        && x.cmodulo == cmodulo).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

        /// <summary>
        /// Entrega el listado de cuentas y partida por módulo
        /// </summary>
        /// <param name="cmodulo">código de módulo en el que se está trabajando</param>
        public static List<tpptcuentaclasificador> GetCuentasPartidasPresupuestariasPorModulo(int cmodulo)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tpptcuentaclasificador> lcuentapartidapresupuestaria = new List<tpptcuentaclasificador>();
            lcuentapartidapresupuestaria = contexto.tpptcuentaclasificador.AsNoTracking().Where(x => x.cmodulo == cmodulo).ToList();
            return lcuentapartidapresupuestaria;
        }
    }
}
