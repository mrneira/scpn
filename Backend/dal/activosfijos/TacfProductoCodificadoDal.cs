using modelo;
using modelo.helper;
using modelo.interfaces;
using modelo.servicios;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace dal.activosfijos {

    public class TacfProductoCodificadoDal
    {

        /// <summary>
        /// Metodo que entrega un registro de tacfproductocodificado. Si la transaccion maneja cache, busca los datos en cahce, si no encuentra los datos en cache busca en la base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="ckardex">Codigo kardex.</param>
        /// <returns></returns>
        public static tacfproductocodificado Find(int cproducto, string cbarras, string serial){
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tacfproductocodificado obj = null;
            obj = contexto.tacfproductocodificado.Where(x => x.cproducto == cproducto && x.cbarras.Equals(cbarras) && x.serial.Equals(serial)).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

        /// <summary>
        /// Metodo que entrega un registro de tacfproducto. Si la transaccion maneja cache, busca los datos en cahce, si no encuentra los datos en cache busca en la base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="ckardex">Codigo kardex.</param>
        /// <returns></returns>
        public static tacfproductocodificado FindxCproducto(int cproducto, string cbarras)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tacfproductocodificado obj = null;
            obj = contexto.tacfproductocodificado.Where(x => x.cproducto == cproducto && x.cbarras.Equals(cbarras)).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }
        /// <summary>
        /// Metodo que entrega un registro de tacfproducto. por tipo de producto codificado
        /// </summary>
        /// <param name="ckardex">Codigo de producto.</param>
        /// <returns></returns>
        public static int FindxCproducto(string cbarras)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List <tacfproductocodificado> obj = null;

            //AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros.Add("@cbarras", cbarras);

            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, "SELECT isnull(max(CAST(dbo.fn_StripCharacters(cbarras,'^0-9') AS int)),0) as total FROM tacfproductocodificado WHERE cbarras LIKE @cbarras+'%' AND LEN(cbarras) < 10");

            ch.registrosporpagina = 900000000;

            IList<Dictionary<string, object>> ldatos = ch.GetRegistrosDictionary();
            int cont = 0;
            Dictionary<string, object> dictionary = new Dictionary<string, object>();
            dictionary = ldatos[0];
            foreach (var key in dictionary.Keys)
            {
                if (!(dictionary[key] is Newtonsoft.Json.Linq.JObject))
                {
                    object s  = dictionary[key];
                    int.TryParse(s.ToString(), out cont);
                    
                }
            }

            

            return cont;
        }
        /// <summary>
        /// Metodo que entrega un registro de tacfproducto. Si la transaccion maneja cache, busca los datos en cahce, si no encuentra los datos en cache busca en la base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="ckardex">Codigo kardex.</param>
        /// <returns></returns>
        public static IList<tacfproductocodificado> FindxCIngreso(int cingreso)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tacfproductocodificado> obj = null;
            obj = contexto.tacfproductocodificado.Where(x => x.cingreso == cingreso).ToList();
            

            return obj;
        }
    }

}
