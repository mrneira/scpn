using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using modelo;
using modelo.helper;
using util;
using util.servicios.ef;
namespace dal.inversiones.var
{
    public class varDal
    {
        /// <summary>
        /// Entrega el valor nóminal de un tipo de inversion por emisor.
        /// </summary>
        /// <param name="emisorcdetalle">Código del emisor.</param>
        /// <param name="tasaclasificacion">Código del tipo de inversión</param>
        /// <returns>tinvinversion</returns>
        public static decimal ValorNominal(string emisorcdetalle, string tasaclasificacion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            decimal total = 0;
            total = contexto.tinvinversion.Where(x => x.emisorcdetalle.Equals(emisorcdetalle) && x.tasaclasificacioncdetalle.Equals(tasaclasificacion)).Sum(x => x.valornominal.Value);

            return total;
        }
        /// <summary>
        /// Entrega el listado de precios de cierre para renta variable entre una fecha de inicio y fin.
        /// </summary>
        /// <param name="emisorcdetalle">Código del emisor.</param>
        /// <param name="finicio">Fecha de inicio</param>
        /// <param name="ffin">Fecha de fin</param>
        /// <returns>IList<tinvprecioscierre></returns>
        public static IList<tinvprecioscierre> precioCierreVar(string emisorcdetalle, int finicio, int ffin)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tinvprecioscierre> pr = new List<tinvprecioscierre>();
            pr = contexto.tinvprecioscierre.Where(x => x.emisorcdetalle.Equals(emisorcdetalle) && (x.fvaloracion >= finicio && x.fvaloracion <= ffin)).ToList();
            return pr;
        }

        /// <summary>
        /// Entrega el listado de precios de cierre para renta variable entre una fecha de inicio y fin.
        /// </summary>
        /// <param name="emisorcdetalle">Código del emisor.</param>
        /// <param name="finicio">Fecha de inicio</param>
        /// <param name="ffin">Fecha de fin</param>
        /// <returns>IList<tinvprecioscierre></returns>
        public static double precioCierreVarValoracion(string emisorcdetalle, int fvaloracion)
        {
            double preciocierre;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tinvprecioscierre pr = null;
            pr = contexto.tinvprecioscierre.Where(x => x.emisorcdetalle.Equals(emisorcdetalle) && x.fvaloracion == fvaloracion).FirstOrDefault();
            if (pr == null)
            {
                pr = contexto.tinvprecioscierre.Where(x => x.emisorcdetalle.Equals(emisorcdetalle) && x.fvaloracion < fvaloracion).OrderByDescending(x => x.fvaloracion).First();
                if (pr == null)
                {
                    preciocierre = 0;
                }
                else {
                    preciocierre = (double)pr.preciocierre;
                }
            }
            else {
                preciocierre = (double)pr.preciocierre;
            }
            return preciocierre;
        }
        /// <summary>
        /// Entrega el listado de precios de cierre para renta fija entre una fecha de inicio y fin.
        /// </summary>
        /// <param name="emisorcdetalle">Código del emisor.</param>
        /// <param name="finicio">Fecha de inicio</param>
        /// <param name="ffin">Fecha de fin</param>
        /// <returns>IList<tinvprecioscierre></returns>
        public static double precioCierreFijaValoracion(string emisorcdetalle, int fvaloracion)
        {
            double preciocierre;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tinvvectorprecios pr = null;
            pr = contexto.tinvvectorprecios.Include("tinvinversion").Where(x => x.tinvinversion.emisorcdetalle.Equals(emisorcdetalle) && x.fvaloracion == fvaloracion).FirstOrDefault();
            if (pr == null)
            {
                //pr = contexto.tinvvectorprecios.Include("tinvinversion").Where(x => x.tinvinversion.emisorcdetalle.Equals(emisorcdetalle) && x.fvaloracion < fvaloracion).OrderByDescending(x => x.fvaloracion).First();
                if (pr == null)
                {
                    preciocierre = 0;
                }
                else
                {
                    preciocierre = (double)pr.porcentajeprecio;
                }
            }
            else
            {
                preciocierre = (double)pr.porcentajeprecio;
            }
            return preciocierre;
        }
        /// <summary>
        /// Entrega el listado de precios de cierre para renta fija entre una fecha de inicio y fin.
        /// </summary>
        /// <param name="emisorcdetalle">Código del emisor.</param>
        /// <param name="finicio">Fecha de inicio</param>
        /// <param name="ffin">Fecha de fin</param>
        /// <returns>IList<tinvprecioscierre></returns>
        public static IList<tinvvectorprecios> precioCierreFija(string emisorcdetalle, int finicio, int ffin)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tinvvectorprecios> pr = new List<tinvvectorprecios>();
            pr = contexto.tinvvectorprecios.Include("tinvinversion").Where(x => x.tinvinversion.emisorcdetalle.Equals(emisorcdetalle) && (x.fvaloracion >= finicio && x.fvaloracion <= ffin)).ToList();
            return pr;
        }

        



    }
}
