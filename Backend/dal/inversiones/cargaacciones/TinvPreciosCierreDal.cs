using System.Collections.Generic;
using System.Linq;
using util;
using util.servicios.ef;
using modelo;
using modelo.helper;
using modelo.servicios;

namespace dal.inversiones.cargaacciones
{
    /// <summary>
    /// Clase que encapsula los procedimientos para ejecutar las operaciones con los precios de cierre de las acciones.
    /// </summary>
    public class TinvPreciosCierreDal
    {

        /// <summary>
        /// Obtener el máximo identificador de la tabla de los precios de cierre más uno.
        /// </summary>
        /// <returns>long</returns>
        public static long GetcInvPreciosCierreMax()
        {

            tinvprecioscierre fc = new tinvprecioscierre();
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            // campos adiciones para la consulta.
            List<string> lcampos = new List<string>();
            lcampos.Add("cInvPreciosCierre");
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                ConsultaHelper ch = new ConsultaHelper(contexto, parametros, "select ISNULL(max(cinvprecioscierre),0) + 1 cInvPreciosCierre from tinvprecioscierre");
                fc = (tinvprecioscierre)ch.GetRegistro("tinvprecioscierre", lcampos);
            }
            catch (System.InvalidOperationException)
            {
                throw new AtlasException("INV-0008", "ERROR AL GENERAR CINVPRECIOSCIERRE");
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
            string lSql = "select isnull(fvaloracion,0) fvaloracion, cusuarioing, fingreso from tinvprecioscierre where fvaloracion = " + fvaloracion.ToString().Trim();

            tinvprecioscierre fc = new tinvprecioscierre();
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            List<string> lcampos = new List<string>();
            lcampos.Add("fvaloracion");
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                ConsultaHelper ch = new ConsultaHelper(contexto, parametros, lSql);
                fc = (tinvprecioscierre)ch.GetRegistro("tinvprecioscierre", lcampos);
            }
            catch (System.InvalidOperationException)
            {
                throw new AtlasException("INV-0005", "ERROR EN EL PROCEDIMIENTO [GETEXISTEFECHA]. POR FAVOR CONTÁCTESE CON EL ADMINISTRADOR DEL SISTEMA");
            }

            if (fc != null && int.Parse(fc.Mdatos.Values.ElementAt(0).ToString()) != 0)
            {

                lstrResultado = "LOS PRECIOS DE CIERRE CON FECHA " +
                    fvaloracion.ToString().Trim() + " YA HA SIDO GENERADO POR " +
                    fc.cusuarioing + " EL " +
                    fc.fingreso;

            }
            return lstrResultado;

        }

        /// <summary>
        /// Obtener un registro de la tabla tgencatalogodetalle, dado un código legal.
        /// </summary>
        /// <param name="clegal">Código legal.</param>
        /// <returns>tgencatalogodetalle</returns>
        public static IList<tgencatalogodetalle>  Find(string clegal)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();

            IList<tgencatalogodetalle> ldatos = contexto.tgencatalogodetalle.Where(x => x.ccatalogo == 1213 && x.clegal.Equals(clegal)).ToList();

            return ldatos;

        }

        public static List<tinvprecioscierre> GetXEmisorFecha(int iintEmisorCatalogo, string istrEmisorDetalle, int iintFecha)
        {


            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tinvprecioscierre> lista = new List<tinvprecioscierre>();
            lista = contexto.tinvprecioscierre.AsNoTracking().Where(x => x.emisorccatalogo == iintEmisorCatalogo &&
                x.emisorcdetalle.Equals(istrEmisorDetalle.Trim()) && x.fultimocierre == iintFecha).ToList();
            return lista;

        }
        public static List<tinvprecioscierre> GetXEmisorFechaValoracion(int iintEmisorCatalogo, string istrEmisorDetalle, int iintFecha)
        {


            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tinvprecioscierre> lista = new List<tinvprecioscierre>();
            lista = contexto.tinvprecioscierre.AsNoTracking().Where(x => x.emisorccatalogo == iintEmisorCatalogo &&
                x.emisorcdetalle.Equals(istrEmisorDetalle.Trim()) && x.fvaloracion == iintFecha).ToList();
            return lista;

        }
        string SQL_MAXPRECIOCIERREEMISOR = "SELECT isnull(preciocierre,0) AS preciocierre  FROM tinvprecioscierre WHERE cinvprecioscierre = (SELECT max(cinvprecioscierre) FROM tinvprecioscierre WHERE emisorcdetalle=@emisorcdetalle)";

      
        /// <summary>
        ///  Obtiene el ultimo precio de cierre por emisor
        /// </summary>
        public static List<tinvprecioscierre> getMaxfvaloracion(int iintEmisorCatalogo, string istrEmisorDetalle, int iintFecha)
        {


            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tinvprecioscierre> lista = new List<tinvprecioscierre>();
            lista = contexto.tinvprecioscierre.AsNoTracking().Where(x => x.emisorccatalogo == iintEmisorCatalogo &&
                x.emisorcdetalle.Equals(istrEmisorDetalle.Trim())).ToList();

            decimal precio = lista.Max(x => x.preciocierre);

            return lista;

        }




    }
}
