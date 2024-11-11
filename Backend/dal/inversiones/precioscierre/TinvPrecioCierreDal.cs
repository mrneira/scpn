using modelo;
using util.servicios.ef;
using System.Data.SqlClient;
using System.Collections.Generic;
using System.Linq;
using System;
using util;
using dal.generales;

namespace dal.inversiones.precioscierre
{
    /// <summary>
    /// Clase que encapsula los procedimientos funcionales para los precios de cierre.
    /// </summary>
    public class TinvPrecioCierreDal
    {

        private static string DELE = "delete from tinvprecioscierre";

        /// <summary>
        /// Elimina la tabla de precios de cierre.
        /// </summary>
        /// <returns></returns>
        public static void DeleteAll()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(
                DELE);
        }

        private static string DELEANIO = "delete from tinvprecioscierre where fultimocierre between @fechaini and @fechafin ";

        /// <summary>
        /// Elimina los registros de los precios de cierre, por año.
        /// </summary>
        /// <returns></returns>
        public static void DeleteAnio(int ianio)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();

            string lstrAnioini = ianio.ToString().Trim() + "0000";
            string lstrAniofin = ianio.ToString().Trim() + "9999";

            contexto.Database.ExecuteSqlCommand(
                DELEANIO,
                new SqlParameter("fechaini", int.Parse(lstrAnioini)),
                new SqlParameter("fechafin", int.Parse(lstrAniofin)));
        }


        public static void Update(long cinvprecioscierre, decimal valornominal, decimal preciocierre, string cusuarioIng)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();

            contexto.Database.ExecuteSqlCommand(
                "UPDATE[dbo].[tinvprecioscierre] SET[valornominal] = " + 
                    valornominal.ToString().Replace(",",".") + ",[preciocierre] = " +
                    preciocierre.ToString().Replace(",", ".") + ",cusuarioing = '" +
                    cusuarioIng + 
                    "' WHERE cinvprecioscierre = " + 
                    cinvprecioscierre.ToString());
        }
        public int   primerfechaPrecio(int finicio,int ffin, string emisor) {
            int fechaini = 0;
            int fechafin = 0;

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            int.TryParse(contexto.tinvprecioscierre.Where(x => x.emisorcdetalle.Equals(emisor)).Select(x=> x.fultimocierre).Min(x=> x.Value).ToString(),out fechaini);
            int.TryParse(contexto.tinvprecioscierre.Where(x => x.emisorcdetalle.Equals(emisor)).Select(x => x.fultimocierre).Max(x => x.Value).ToString(), out fechafin);
            if (finicio == 0 || ffin == 0) {
                tgencatalogodetalle em = TgenCatalogoDetalleDal.Find(1213, emisor);

                throw new AtlasException("INV-004", "NO SE HAN ENCONTRADO PRECIOS DE CIERRE PARA EMISOR: {0} EN LAS FECHAS CONTABLES : {1} y {2} ", em.nombre,finicio,ffin);

            }

            if (finicio > ffin)
                return finicio;
            else return ffin;
        }
        public decimal primerprecio(int fprecio, string emisor) {

            decimal precio = 0;

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                precio = contexto.tinvprecioscierre.Where(x => x.fultimocierre == fprecio && x.emisorcdetalle.Equals(emisor)).Select(x => x.preciocierre).Max();

            }
            catch (Exception)
            {
                precio = 0;

            }
            return precio;
        }
        public static tinvprecioscierre UltimoprecioEmisor(string emisorcdetalle) {
            long cinvprecioscierre = 0;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tinvprecioscierre dto=null;
             cinvprecioscierre = maxIdPrecioCierre(emisorcdetalle);
            if (cinvprecioscierre == 0)
                return null;
            else
                dto = contexto.tinvprecioscierre.AsNoTracking().Where(x => x.cinvprecioscierre== cinvprecioscierre).SingleOrDefault();
            //return lista;
            return dto;

        }
        public static tinvprecioscierre UltimoprecioEmisor(string emisorcdetalle, int fvaloracion )
        {
            long cinvprecioscierre = 0;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tinvprecioscierre dto = null;
            cinvprecioscierre = contexto.tinvprecioscierre.AsNoTracking().Where(x => x.emisorcdetalle.Equals(emisorcdetalle) && x.fvaloracion<=fvaloracion ).ToList().Max(x => x.cinvprecioscierre);

            if (cinvprecioscierre == 0)
                return null;
            else
                dto = contexto.tinvprecioscierre.AsNoTracking().Where(x => x.cinvprecioscierre == cinvprecioscierre).SingleOrDefault();
            //return lista;
            return dto;

        }
        public static long maxIdPrecioCierre(string emisorcdetalle) {
            long cinvprecioscierre = 0;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tinvprecioscierre> lista = null;
            try {
                cinvprecioscierre = contexto.tinvprecioscierre.AsNoTracking().Where(x => x.emisorcdetalle.Equals(emisorcdetalle)).ToList().Max(x => x.cinvprecioscierre);

            }
            catch (Exception ex) {
                lista = null;
            }
            //return lista;
            return cinvprecioscierre;
        }

        public static void InsertSql(long cinversion, int fvaloracion,int fultimocierre, decimal valornominal, decimal preciocierre, string cusuarioIng)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();

            contexto.Database.ExecuteSqlCommand(
                "INSERT INTO tinvprecioscierre ([cinvprecioscierre],[fvaloracion],[fultimocierre],[emisorccatalogo],[emisorcdetalle],[valornominal],[preciocierre],[fingreso],[cusuarioing]) VALUES ((select max(cinvprecioscierre + 1) from tinvprecioscierre), " +
                fvaloracion.ToString() + "," +
                fultimocierre.ToString() + "," +
                "(select emisorccatalogo from tinvinversion where cinversion = " + cinversion.ToString() + "), " +
                "(select emisorcdetalle from tinvinversion where cinversion = + " + cinversion.ToString() + "), " +
                valornominal.ToString().Replace(",", ".") + "," +
                preciocierre.ToString().Replace(",", ".") + "," + 
                "getdate()," + 
                "'" + cusuarioIng + "')");
        }


        public static void EjecutarSql(string istrSql)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();

            contexto.Database.ExecuteSqlCommand(
                istrSql);
        }


    }
}
