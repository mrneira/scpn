using dal.cartera;
using modelo;
using System.Data.SqlClient;
using util.dto.interfaces.lote;
using util.dto.lote;
using util.servicios.ef;

namespace cartera.lote.previo
{
    /// <summary>
    /// Clase que se encarga de obtener operaciones de cartera que tengan cuotas a pasar a vencido y los inserta en la tabla tcaroperacionlote.
    /// Las cuotas que vences sabado, domingo se pasa a vencido el lunes, en feriados se ejecuta el cambio de estado la proxima fecha contable.
    /// </summary>
    public class PasoVencido : ITareaPrevia {

        public void Ejecutar(RequestModulo requestmodulo, string ctarea, int? orden) {
            TcarOperacionLoteDal.Eliminar(requestmodulo, ctarea);

            Insertar(requestmodulo, JPQL_INSERT_VIG, ctarea, orden);
            Insertar(requestmodulo, JPQL_INSERT_NDV, ctarea, orden);
        }

        /// <summary>
        /// Metodo que se encarga de insertar operaciones de cartera a cerrar provisiones, el viernes se cobra cuentas cuya fecha de vencimiento es sabado o domingo.
        /// </summary>
        private void Insertar(RequestModulo requestmodulo, string sentencia,  string ctarea, int? orden) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            int num = contexto.Database.ExecuteSqlCommand(sentencia, new SqlParameter("fproceso", requestmodulo.Fconatble), new SqlParameter("clote", requestmodulo.Clote)
                                                           , new SqlParameter("cmodulo", requestmodulo.Cmodulo), new SqlParameter("ctarea", ctarea)
                                                           , new SqlParameter("orden", orden), new SqlParameter("numeroejecucion", requestmodulo.Numeroejecucion));
        }

        /// <summary>
        /// Sentencia que se encarga de insertar operaciones a la vista a capitalizar.
        /// </summary>
        private static string JPQL_INSERT_VIG = "insert into TCAROPERACIONLOTE  ( COPERACION, FPROCESO, CLOTE, CMODULO, CTAREA, ORDEN , NUMEROEJECUCION) "
            + "select distinct tcuota.coperacion, @fproceso, @clote, @cmodulo, @ctarea, @orden, @numeroejecucion "
            + "from TCAROPERACIONCUOTA tcuota, TCAROPERACION toper, TGENTIPOCREDITO tc   "
            + "where toper.coperacion = tcuota.coperacion and toper.cestatus not in ('NEG', 'CAN', 'APR') and tcuota.ctipocredito = tc.ctipocredito and tcuota.cestatus in('VIG') and tcuota.fpago is null "
            + "  and DATEDIFF(day, CONVERT(DATETIME,STR(tcuota.fvencimiento)), CONVERT(DATETIME,STR(@fproceso)) ) > tc.diasgraciapasovencido "
            + "and not exists ( select 1 from TCAROPERACIONLOTE tlos "
            + "        where tlos.COPERACION = tcuota.COPERACION and tlos.FPROCESO = @fproceso and tlos.CLOTE = @clote "
            + "        and tlos.CMODULO = @cmodulo and tlos.CTAREA = @ctarea and tlos.EJECUTADA = '1' )";

        /// <summary>
        /// Sentencia que se encarga de insertar operaciones a la vista a capitalizar.
        /// </summary>
        private static string JPQL_INSERT_NDV = "insert into TCAROPERACIONLOTE  ( COPERACION, FPROCESO, CLOTE, CMODULO, CTAREA, ORDEN, NUMEROEJECUCION ) "
            + "select distinct tcuota.coperacion, @fproceso, @clote, @cmodulo, @ctarea, @orden, @numeroejecucion "
            + "from TCAROPERACIONCUOTA tcuota, TCAROPERACION toper   "
            + "where toper.coperacion = tcuota.coperacion and toper.cestatus not in ('NEG', 'CAN', 'APR') and tcuota.cestatus in('NDV') and tcuota.fpago is null "
            + "  and DATEDIFF(day, CONVERT(DATETIME,STR(tcuota.fvencimiento)), CONVERT(DATETIME,STR(@fproceso)) ) >= 0 "
            + "and not exists ( select 1 from TCAROPERACIONLOTE tlos "
            + "        where tlos.COPERACION = tcuota.COPERACION and tlos.FPROCESO = @fproceso and tlos.CLOTE = @clote "
            + "        and tlos.CMODULO = @cmodulo and tlos.CTAREA = @ctarea and tlos.EJECUTADA = '1' )";


    }


}
