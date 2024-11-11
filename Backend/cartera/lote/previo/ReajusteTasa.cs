using dal.cartera;
using modelo;
using System.Data.SqlClient;
using util.dto.interfaces.lote;
using util.dto.lote;
using util.servicios.ef;

namespace cartera.lote.previo
{
    /// <summary>
    /// Clase que se encarga de obtener operaciones de cartera que tengan reajuste de tasa.
    /// </summary>
    public class ReajusteTasa : ITareaPrevia {

        public void Ejecutar(RequestModulo requestmodulo, string ctarea, int? orden) {
            TcarOperacionLoteDal.Eliminar(requestmodulo, ctarea);
            Insertar(requestmodulo, ctarea, orden);
        }

        /// <summary>
        /// Metodo que se encarga de insertar operaciones de cartera a cerrar provisiones, el viernes se cobra cuentas cuya fecha de vencimiento es sabado o domingo.
        /// </summary>
        private void Insertar(RequestModulo requestmodulo, string ctarea, int? orden) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(JPQL_INSERT, new SqlParameter("fproceso", requestmodulo.Fconatble), new SqlParameter("clote", requestmodulo.Clote)
                                                           , new SqlParameter("cmodulo", requestmodulo.Cmodulo), new SqlParameter("ctarea", ctarea)
                                                           , new SqlParameter("orden", orden), new SqlParameter("numeroejecucion", requestmodulo.Numeroejecucion));
        }

        /// <summary>
        /// Sentencia que se encarga de insertar operaciones a la vista a capitalizar.
        /// </summary>
        private static string JPQL_INSERT = "insert into TCAROPERACIONLOTE  ( COPERACION, FPROCESO, CLOTE, CMODULO, CTAREA, ORDEN, NUMEROEJECUCION ) "
            + "select distinct tcuota.coperacion, @fproceso, @clote, @cmodulo, @ctarea, @orden, @numeroejecucion "
            + "from TCAROPERACIONCUOTA tcuota, TCAROPERACION o   "
            + "where tcuota.coperacion = o.coperacion and o.tasareajustable = 1 and (tcuota.numcuota % o.numerocuotasreajuste) = 0 "
            + "  and o.cestatus not in ('NEG', 'CAN', 'APR') and o.cproducto is not null "
            + "  and tcuota.fvencimiento = @fproceso and tcuota.fpago is null and not exists ( select 1 from TCAROPERACIONLOTE tlos "
            + "  where tlos.COPERACION = tcuota.COPERACION and tlos.FPROCESO = @fproceso and tlos.CLOTE = @clote "
            + "  and tlos.CMODULO = @cmodulo and tlos.CTAREA = @ctarea and tlos.EJECUTADA = '1' )";


    }


}
