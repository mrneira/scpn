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

    public class TacfKardexProdCodiDal {

        /// <summary>
        /// Metodo que entrega un registro de kardex de producto codificado. Si la transaccion maneja cache, busca los datos en cahce, si no encuentra los datos en cache busca en la base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="ckardex">Codigo kardex.</param>
        /// <returns></returns>
        public static tacfkardexprodcodi Find(int ckardexpc){
            tacfkardexprodcodi obj = null;
            String key = "" + ckardexpc;
            CacheStore cs = CacheStore.Instance;
            obj = (tacfkardexprodcodi)cs.GetDatos("tacfkardexprodcodi", key);
            if (obj == null){
                ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tacfkardexprodcodi");
                obj = FindInDatabase(ckardexpc);
                m[key] = obj;
                cs.PutDatos("tacfkardexprodcodi", m);
            }
            return obj;
        }

        /// <summary>
        /// Entrega un objeto kardex desde la bdd
        /// </summary>
        /// <param name="ckardexpc">Codigo de KARDEX.</param>
        /// <returns>TACFKARDEX</returns>
        public static tacfkardexprodcodi FindInDatabase(int ckardexpc){
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tacfkardexprodcodi obj = null;
            obj = contexto.tacfkardexprodcodi.Where(x => x.ckardexprodcodi == ckardexpc).SingleOrDefault();
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
        public static List<tacfkardexprodcodi> FindXcproducto(int cproducto){
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tacfkardexprodcodi> lista = new List<tacfkardexprodcodi>();
            lista = contexto.tacfkardexprodcodi.AsNoTracking().Where(x => x.cproducto == cproducto).OrderBy(x=> x.ckardexprodcodi).ToList();
            return lista;
        }


        /// <summary>
        /// Entrega una lista de kardex por el codigo movimiento
        /// </summary>
        /// <param name="ckardex">Codigo de KARDEX.</param>
        /// <returns>TACFKARDEX</returns>
        public static List<tacfkardexprodcodi> FindXcmovimiento(int cmovimiento, int cproducto)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tacfkardexprodcodi> lista = new List<tacfkardexprodcodi>();
            lista = contexto.tacfkardexprodcodi.AsNoTracking().Where(x => x.cmovimiento == cmovimiento && x.cproducto == cproducto).OrderBy(x => x.cmovimiento).ToList();
            return lista;
        }



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
        /// crea un objeto kardex de producto codificado
        /// </summary>
        /// <param name="rqmantenimiento">rq de mantenimiento</param>
        /// <param name="cmovimiento">codigo de movimiento</param>
        /// <returns>TACFKARDEX</returns>
        public static tacfkardexprodcodi Crear(RqMantenimiento rqmantenimiento, int cmovimiento, int cproducto, bool esingreso,
                            string cbarras, string serial, string cusuarioasignado,
                            string tipomovimiento, decimal cantidad, decimal vunitario, decimal costopromedio, string infoadicional,
                            int ubicacionccatalogo, string ubicacioncdetalle
                            ){
            tacfkardexprodcodi obj = new tacfkardexprodcodi();
            obj.cmovimiento = cmovimiento;
            obj.cproducto = cproducto;
            obj.esingreso = esingreso;
            obj.tipomovimiento = tipomovimiento;
            obj.cantidad = cantidad;
            obj.vunitario = vunitario;
            obj.costopromedio = costopromedio;
            obj.cantidad =  cantidad;
            obj.serial = serial;
            obj.cbarras = cbarras;
            obj.cusuarioing = rqmantenimiento.Cusuario;
            obj.cusuarioasignado = cusuarioasignado;
            obj.fingreso = rqmantenimiento.Freal;
            obj.infoadicional = infoadicional;
            obj.ubicacionccatalogo = ubicacionccatalogo;
            obj.ubicacioncdetalle = ubicacioncdetalle;
          
            return obj;
        }

        /// <summary>
        /// crea un objeto kardex de producto codificado
        /// </summary>
        /// <param name="rqmantenimiento">rq de mantenimiento</param>
        /// <param name="cmovimiento">codigo de movimiento</param>
        /// <returns>TACFKARDEX</returns>
        public static tacfkardexprodcodi CrearDevolucion(RqMantenimiento rqmantenimiento, int cmovimiento, int cproducto, bool esingreso,
                            string cbarras, string serial, string cusuarioasignado,
                            string tipomovimiento, decimal cantidad, decimal vunitario, decimal costopromedio, decimal stock, string infoadicional,
                            int ubicacionccatalogo, string ubicacioncdetalle
                            )
        {
            tacfkardexprodcodi obj = new tacfkardexprodcodi();
            obj.cmovimiento = cmovimiento;
            obj.cproducto = cproducto;
            obj.esingreso = esingreso;
            obj.tipomovimiento = tipomovimiento;
            obj.cantidad = cantidad;
            obj.vunitario = vunitario;
            obj.costopromedio = costopromedio;
            obj.cantidad = cantidad;
            obj.serial = serial;
            obj.cbarras = cbarras;
            obj.cusuarioing = rqmantenimiento.Cusuario;
            obj.cusuarioasignado = cusuarioasignado;
            obj.fingreso = (rqmantenimiento.Freal).AddMinutes(5);
            obj.infoadicional = infoadicional;
            obj.ubicacionccatalogo = ubicacionccatalogo;
            obj.ubicacioncdetalle = ubicacioncdetalle;
            return obj;
        }


        public static List<tacfkardexprodcodi> Find(int cproducto, string cbarras, string serial)
        {         
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tacfkardexprodcodi> lista = new List<tacfkardexprodcodi>();
            lista = contexto.tacfkardexprodcodi.AsNoTracking().Where(x => x.cproducto == cproducto && x.cbarras.Equals(cbarras) && x.serial.Equals(serial)).ToList();
            return lista;
        }       

    }

}
