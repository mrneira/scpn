using modelo;
using modelo.servicios;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.contabilidad.flujocajahistorial
{
    /// <summary>
    /// Clase que implemeta, consultas manuales de la tabla TconFlujoEfectivo.
    /// </summary>
    public class TconFlujoCajaHistorialDal
    {
        public static List<tconflujoefectivo> Find(int aniofin, int anioinicio, string tipoplancdetalle)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tconflujoefectivo> lista = new List<tconflujoefectivo>();
            lista = contexto.tconflujoefectivo.AsNoTracking().Where(x => x.aniofin.Equals(aniofin) &&
                                                                    x.anioinicio.Equals(anioinicio) &&
                                                                    x.tipoplancdetalle == tipoplancdetalle).OrderBy(x => x.ccuenta).ToList();
            return lista;
        }

        //private static readonly string SQL_ELIMINAR = "delete from tconflujocajahistorial where fcontable = @fcontable and tipoflujocdetalle = @tipoflujocdetalle and tipoplancdetalle = @tipoplancdetalle";
        //CCA 20220627
        private static readonly string SQL_ELIMINAR = "delete from tconflujocajahistorial where fcontable = @fcontable and tipoflujocdetalle = @tipoflujocdetalle and tipoplancdetalle = @tipoplancdetalle and tipooperacioncdetalle = @tipooperacioncdetalle and descripcion = @descripcion";

        public static void Eliminar(int fcontable, string tipoplancdetalle, string tipoflujocdetalle, string tipooperacioncdetalle, string descripcion)
        {//CCA 20220627
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(SQL_ELIMINAR,
                new SqlParameter("fcontable", fcontable),
                new SqlParameter("tipoplancdetalle", tipoplancdetalle),
                new SqlParameter("tipoflujocdetalle", tipoflujocdetalle),
                new SqlParameter("tipooperacioncdetalle", tipooperacioncdetalle),//CCA 20220627
                new SqlParameter("descripcion", descripcion));//CCA 20220627
        }

        /// <summary>
        /// Entrega saldos contables al 31 de diciembre del anio de consulta y al 31 de diciembre del anio anterior.
        /// </summary>
        private static readonly string SPQL_SALDOS = "select c.tipoplancdetalle, c.tipoefectivo, cie.ccuenta, monto as montofin, "
            + " (select monto from tconsaldoscierre i where i.ccuenta = cie.ccuenta and i.fcierre = @fconsultainicio) as montoini "
            + " from tconsaldoscierre cie, tconcatalogo c "
            + " where cie.ccuenta = c.ccuenta and c.cnivel = 3 and cie.fcierre = @fconsultafin and c.tipoplancdetalle = @tipoplancdetalle "
            + " order by cie.ccuenta ";

        /// <summary>
        /// Metodo que entrega una lista de objetos con los valores del flujo de efectivo.
        /// </summary>
        public static IList<Dictionary<string, object>> getSaldosFlujo(int aniofin, string tipoplancdetalle)
        {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            Dictionary<string, object> parametros = new Dictionary<string, object>
            {
                ["@fconsultainicio"] = Int32.Parse((aniofin - 1) + "1231"),
                ["@fconsultafin"] = Int32.Parse(aniofin + "1231"),
                ["@tipoplancdetalle"] = tipoplancdetalle
            };

            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, SPQL_SALDOS);
            ch.registrosporpagina = 10000000;
            IList<Dictionary<string, object>> ldatos = ch.GetRegistrosDictionary();
            return ldatos;
        }

    }
}
