using modelo;
using modelo.helper;
using modelo.servicios;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace dal.activosfijos {

    public class TacfKardexDal
    {

        /// <summary>
        /// Metodo que entrega un registro de kardex. Si la transaccion maneja cache, busca los datos en cahce, si no encuentra los datos en cache busca en la base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="ckardex">Codigo kardex.</param>
        /// <returns></returns>
        public static tacfkardex Find(int ckardex){
            tacfkardex obj = null;
            String key = "" + ckardex;
            CacheStore cs = CacheStore.Instance;
            obj = (tacfkardex)cs.GetDatos("tacfkardex", key);
            if (obj == null){
                ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tacfkardex");
                obj = FindInDatabase(ckardex);
                m[key] = obj;
                cs.PutDatos("tacfkardex", m);
            }
            return obj;
        }

        /// <summary>
        /// Entrega un objeto kardex desde la bdd
        /// </summary>
        /// <param name="ckardex">Codigo de KARDEX.</param>
        /// <returns>TACFKARDEX</returns>
        public static tacfkardex FindInDatabase(int ckardex){
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tacfkardex obj = null;
            obj = contexto.tacfkardex.Where(x => x.ckardex == ckardex).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

        /// <summary>
        /// Entrega una lista de kardex por el codigo producto
        /// </summary>
        /// <param name="ckardex">Codigo de KARDEX.</param>
        /// <returns>TACFKARDEX</returns>
        public static List<tacfkardex> FindXcproducto(int cproducto){
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tacfkardex> lista = new List<tacfkardex>();
            lista = contexto.tacfkardex.AsNoTracking().Where(x => x.cproducto == cproducto).OrderBy(x=> x.ckardex).ToList();
            return lista;
        }


        private static string SQL_Kardex = "SELECT k.ckardex, k.cproducto, k.cmovimiento, k.esingreso, " +
                                    " k.tipomovimiento, k.cantidad, k.vunitario, k.costopromedio, " +
		                            " k.stock, k.cusuario, k.fingreso, p.nombre " +
                                    " FROM tacfkardex k, tacfproducto p " +
                                    " WHERE k.cproducto = p.cproducto " +
                                    " AND k.cproducto = @cproducto " +
                                    " AND k.fingreso >= @finicio " +
                                    " AND k.fingreso <= @ffin order by ckardex ";

        private static string SQL_Kardex_Codificado = "SELECT  k.ckardexprodcodi, k.cproducto, k.cmovimiento, k.esingreso, " +
                                                       " k.tipomovimiento, k.cantidad, k.vunitario, k.costopromedio, " +
	                                                   " k.cusuarioasignado, k.fingreso, p.nombre " +
                                                       " FROM tacfkardexprodcodi k, tacfproducto p " +
                                                       " WHERE k.cproducto = p.cproducto " +
                                                       " AND k.serial = @serial " +
                                                       " OR k.cbarras = @cbarras " +
                                                       " AND k.fingreso >= @finicio " +
                                                       " AND k.fingreso <= @ffin " +
                                                       " ORDER BY k.ckardexprodcodi ";
        /// <summary>
        /// Entrega una lista de kardex por el codigo producto y rangos de fechas
        /// </summary>
        /// <param name="ckardex">Codigo de KARDEX.</param>
        /// <returns>TACFKARDEX</returns>
        public static IList<Dictionary<string, object>> FindXcproductoXfechas(int cproducto, DateTime finicio, DateTime ffin)
        {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@cproducto"] = cproducto;
            parametros["@finicio"] = finicio;
            parametros["@ffin"] = ffin;
            List<string> lcampos = new List<string>();
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, SQL_Kardex);
            IList<Dictionary<string, object>> ldatos = ch.GetRegistrosDictionary();
            return ldatos;

        }

        /// <summary>
        /// Entrega una lista de tacfkardexprodcodi por el serial y codigo de barras
        /// </summary>
        /// <param name="ckardexprodcodi">Codigo de KARDEX.</param>
        /// <returns>TACFKARDEX</returns>
        public static IList<Dictionary<string, object>> FindKardexCodificado(string serial, string cbarras, DateTime finicio, DateTime ffin)
        {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@serial"] = serial;
            parametros["@cbarras"] = cbarras;
            parametros["@finicio"] = finicio;
            parametros["@ffin"] = ffin;
            List<string> lcampos = new List<string>();
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, SQL_Kardex_Codificado);
            IList<Dictionary<string, object>> ldatos = ch.GetRegistrosDictionary();
            return ldatos;

        }

        /// <summary>
        /// crea un objeto kardex con fecha de registro de usuario
        /// </summary>
        /// <param name="rqmantenimiento">rq de mantenimiento</param>
        /// <param name="cmovimiento">codigo de movimiento</param>
        /// <returns>TACFKARDEX</returns>
        public static tacfkardex Crear(RqMantenimiento rqmantenimiento, int cmovimiento, int cproducto, bool esingreso,
                            string tipomovimiento, decimal cantidad, decimal vunitario, decimal costopromedio, decimal stock,
                            DateTime fingreso
                            ){
            tacfkardex obj = new tacfkardex();
            obj.cmovimiento = cmovimiento;
            obj.cproducto = cproducto;
            obj.esingreso = esingreso;
            obj.tipomovimiento = tipomovimiento;
            obj.cantidad = cantidad;
            obj.vunitario = vunitario;
            obj.costopromedio = costopromedio;
            obj.stock = stock;
            obj.cusuario = rqmantenimiento.Cusuario;
            obj.fingreso = fingreso;

            return obj;
        }

        /// <summary>
        /// crea un objeto kardex con fecha de sistema
        /// </summary>
        /// <param name="rqmantenimiento">rq de mantenimiento</param>
        /// <param name="cmovimiento">codigo de movimiento</param>
        /// <returns>TACFKARDEX</returns>
        public static tacfkardex CrearKardex(RqMantenimiento rqmantenimiento, int cmovimiento, int cproducto, bool esingreso,
                            string tipomovimiento, decimal cantidad, decimal vunitario, decimal costopromedio, decimal stock
                            )
        {
            tacfkardex obj = new tacfkardex();
            obj.cmovimiento = cmovimiento;
            obj.cproducto = cproducto;
            obj.esingreso = esingreso;
            obj.tipomovimiento = tipomovimiento;
            obj.cantidad = cantidad;
            obj.vunitario = vunitario;
            obj.costopromedio = costopromedio;
            obj.stock = stock;
            obj.cusuario = rqmantenimiento.Cusuario;
            obj.fingreso = rqmantenimiento.Freal;

            return obj;
        }



        public static tacfkardex CrearDevolucion(RqMantenimiento rqmantenimiento, int cmovimiento, int cproducto, bool esingreso,
                           string tipomovimiento, decimal cantidad, decimal vunitario, decimal costopromedio, decimal stock
                           )
        {
            tacfkardex obj = new tacfkardex();
            obj.cmovimiento = cmovimiento;
            obj.cproducto = cproducto;
            obj.esingreso = esingreso;
            obj.tipomovimiento = tipomovimiento;
            obj.cantidad = cantidad;
            obj.vunitario = vunitario;
            obj.costopromedio = costopromedio;
            obj.stock = stock;
            obj.cusuario = rqmantenimiento.Cusuario;
            obj.fingreso = (rqmantenimiento.Freal).AddMinutes(5);

            return obj;
        }       

    }

}
