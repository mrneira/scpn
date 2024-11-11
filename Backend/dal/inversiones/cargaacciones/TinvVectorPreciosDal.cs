using System.Collections.Generic;
using System.Linq;
using util;
using util.servicios.ef;
using modelo;
using modelo.servicios;

namespace dal.inversiones.cargaacciones
{
    /// <summary>
    /// Clase que encapsula los procedimientos para ejecutar las operaciones con el vestor de precios de los instrumentos financieros.
    /// </summary>
    public class TinvVectorPreciosDal
    {

        /// <summary>
        /// Obtener el máximo identificador de la tabla del vector de precios, más uno.
        /// </summary>
        public static long GetccInvVectorPrecios()
        {

            tinvvectorprecios fc = new tinvvectorprecios();
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            List<string> lcampos = new List<string>();
            lcampos.Add("cInvVectorPrecios");
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                ConsultaHelper ch = new ConsultaHelper(contexto, parametros, "select ISNULL(max(cinvvectorprecios),0) + 1 cInvVectorPrecios from tinvvectorprecios");
                fc = (tinvvectorprecios)ch.GetRegistro("tinvvectorprecios", lcampos);
            }
            catch (System.InvalidOperationException)
            {
                throw new AtlasException("INV-0006", "ERROR AL GENERAR CINVVECTORPRECIOS");
            }

            return long.Parse(fc.Mdatos.Values.ElementAt(0).ToString());

        }

        /// <summary>
        /// Determinar si existe registros en la tabla de precios de cierre, dado una fecha de valoración.
        /// </summary>
        /// <param name="fvaloracion">Fecha de valoración.</param>
        /// <returns>string</returns>
        public static string GetExisteFecha(long fvaloracion)
        {

            string lstrResultado = "";
            string lSql = "select isnull(fvaloracion,0) fvaloracion, cusuarioing, fingreso from tinvvectorprecios where fvaloracion = " + fvaloracion.ToString().Trim();

            tinvvectorprecios fc = new tinvvectorprecios();
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            List<string> lcampos = new List<string>();
            lcampos.Add("fvaloracion");
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                ConsultaHelper ch = new ConsultaHelper(contexto, parametros, lSql);
                fc = (tinvvectorprecios)ch.GetRegistro("tinvvectorprecios", lcampos);
            }
            catch (System.InvalidOperationException)
            {
                throw new AtlasException("INV-0005", "ERROR EN EL PROCEDIMIENTO [GETEXISTEFECHA]. POR FAVOR CONTÁCTESE CON EL ADMINISTRADOR DEL SISTEMA");
            }

            if (fc != null && int.Parse(fc.Mdatos.Values.ElementAt(0).ToString()) != 0)
            {

                lstrResultado = "EL VECTOR DE PRECIOS CON FECHA " +
                    fvaloracion.ToString().Trim() + " YA HA SIDO GENERADO POR " +
                    fc.cusuarioing + " EL " +
                    fc.fingreso;

            }
            return lstrResultado;

        }

        /// <summary>
        /// Obtiene el identificador de una inversión, dado un código de título.
        /// </summary>
        /// <param name="codigotitulo">Código de título.</param>
        /// <returns>long</returns>
        public static long GetcInvInversionPorCodigoTitulo(string codigotitulo)
        {

            string lSql = "select isnull(cinversion,0) cinversion from tinvinversion where codigotitulo = '" + codigotitulo.Trim() + "'"; 

            tinvvectorprecios fc = new tinvvectorprecios();
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            List<string> lcampos = new List<string>();
            lcampos.Add("cinversion");
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                ConsultaHelper ch = new ConsultaHelper(contexto, parametros, lSql);
                fc = (tinvvectorprecios)ch.GetRegistro("tinvvectorprecios", lcampos);
            }
            catch (System.InvalidOperationException)
            {
                throw new AtlasException("INV-0007", "ERROR EN EL PROCEDIMIENTO [GETCINVINVERSIONPORCODIGOTITULO]. POR FAVOR CONTÁCTESE CON EL ADMINISTRADOR DEL SISTEMA");
            }

            if (fc != null)
            {
                return  long.Parse(fc.Mdatos.Values.ElementAt(0).ToString());

            }
            return 0;
        }
    }
}
