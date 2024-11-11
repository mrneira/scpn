
using System.Collections.Generic;
using System.Linq;
using System;
using util;
using util.servicios.ef;
using modelo;
using modelo.servicios;
using util.dto.consulta;
using modelo.helper;
using dal.inversiones.contabilizacion;
using System.Data;
using System.Data.SqlClient;

namespace dal.inversiones.emisorvalornominal
{
    public class TinvEmisorValorNominalDal
    {
        private static string SqlMaxInvTabHis = "select ISNULL(max(cinvemisorvalornominal),0) + 1 cinvemisorvalornominal from tinvemisorvalornominal";

        /// <summary>
        /// Obtener el máximo identificador del histórico de la tabla de amortización, más uno.
        /// </summary>
        /// <returns>long</returns>
        public static long GetcinvEmisorValorNominal()
        {


            tinvemisorvalornominal fc = new tinvemisorvalornominal();
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            List<string> lcampos = new List<string>();
            lcampos.Add("cinvemisorvalornominal");
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                ConsultaHelper ch = new ConsultaHelper(contexto, parametros, SqlMaxInvTabHis);
                fc = (tinvemisorvalornominal)ch.GetRegistro("tinvemisorvalornominal", lcampos);
            }
            catch (System.InvalidOperationException)
            {
                return 1;

                //throw new AtlasException("INV-0020", "ERROR AL GENERAR CINVTABLAAMORTIZACIONHIS");
            }

            return long.Parse(fc.Mdatos.Values.ElementAt(0).ToString());

        }


    }
}
