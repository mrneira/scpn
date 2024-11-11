using modelo;
using modelo.helper;
using modelo.interfaces;
using modelo.servicios;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.servicios.ef;

namespace dal.generales {

    /// <summary>
    /// Clase que implementa dml's manuales contra la base de datos.
    /// </summary>
    public class TgentransaccionDal {


        /// <summary>
        /// Metodo que entrega la definicion de una transaccion. Si la transaccion maneja cache, busca los datos en cahce, si no encuentra los datos en cache busca en la base, 
        /// alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="modulo">Codigo de modulo al que pertenece la transaccion.</param>
        /// <param name="transaccion">Codigo de transaccion</param>
        /// <returns>tgentransaccion</returns>
        public static tgentransaccion Find(int modulo, int transaccion) {
            tgentransaccion obj = null;
            string key = "" + modulo + "^" + transaccion;
            CacheStore cs = CacheStore.Instance;

            obj = (tgentransaccion)cs.GetDatos("tgentransaccion", key);
            if (obj == null) {
                ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tgentransaccion");
                obj = FindInDataBase(modulo, transaccion);
                m[key] = obj;
                cs.PutDatos("tgentransaccion", m);
            }
            return obj;
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de una transaccion.
        /// </summary>
        /// <param name="cmodulo">Codigo de modulo al que pertenece la transaccion.</param>
        /// <param name="ctransaccion">Codigo de transaccion</param>
        /// <returns></returns>
        public static tgentransaccion FindInDataBase(int cmodulo, int ctransaccion) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tgentransaccion obj = null;

            obj = contexto.tgentransaccion.AsNoTracking().Where(x => x.cmodulo == cmodulo && x.ctransaccion == ctransaccion).SingleOrDefault();
            if (obj == null) {
                throw new AtlasException("BGEN-001", "TRANSACCION NO DEFINIDA MODULO: {0} TRANSACCION: {1} ", cmodulo, ctransaccion);
            }
            EntityHelper.SetActualizar(obj);
            return obj;
        }



        private static String SQL_RUTAS = "select tsgo.cmodulo, tsgo.ctransaccion, (select tgt.ruta from TgenTransaccion tgt"
                + " where tgt.ctransaccion = tsgo.ctransaccion and tgt.cmodulo = tsgo.cmodulo) as ruta"
                + " from TsegRolOpciones tsgo where tsgo.crol = @crol and tsgo.ccompania = @ccompania "
                + " and tsgo.activo = 1"
                + " order by tsgo.orden ";

        /// <summary>
        /// Entrega una lista de rutas por transaccion.
        /// </summary>
        /// <param name="crol">Codigo de rol.</param>
        /// <param name="ccompania">Codigo de compania.</param>
        /// <returns></returns>
        public static IList<Dictionary<string, object>> FindRutas(int crol, int ccompania) {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@crol"] = crol;
            parametros["@ccompania"] = ccompania;

            List<string> lcampos = new List<string>();
            lcampos.Add("ruta");
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, SQL_RUTAS);
            ch.registrosporpagina = 1000;
            IList<Dictionary<string, object>> listaRutas = ch.GetRegistrosDictionary();
            return listaRutas;
        }


    }
}
