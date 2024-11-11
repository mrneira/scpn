using dal.cartera;
using modelo;
using System.Data.SqlClient;
using util.dto.interfaces.lote;
using util.dto.lote;
using util.servicios.ef;

namespace cartera.lote.previo {
    /// <summary>
    /// Clase que se encarga de obtener operaciones de cartera que tengan cuotas a madurar y los inserta en la tabla tcaroperacionlote.<br>
    /// Las cuotas que vences sabado, domingo se maduran el lunes.En feriados se ejecuta el cambio de estado la proxima fecha contable.
    /// </summary>
    public class Maduracion : ITareaPrevia {

        public void Ejecutar(RequestModulo requestmodulo, string ctarea, int? orden)
        {
            TcarOperacionLoteDal.Eliminar(requestmodulo, ctarea);

            Insertar(requestmodulo, ctarea, orden);
        }

        /// <summary>
        /// Metodo que se encarga de insertar operaciones de cartera a realizar maduracion.
        /// </summary>
        private void Insertar(RequestModulo requestmodulo, string ctarea, int? orden)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(JPQL_INSERT, new SqlParameter("fproceso", requestmodulo.Fconatble), new SqlParameter("clote", requestmodulo.Clote)
                                                           , new SqlParameter("cmodulo", requestmodulo.Cmodulo), new SqlParameter("ctarea", ctarea)
                                                           , new SqlParameter("orden", orden), new SqlParameter("numeroejecucion", requestmodulo.Numeroejecucion));
        }

        /// <summary>
        /// Sentencia que se encarga de insertar operaciones de cartera a calcular calificacion y calculo de provision.
        /// </summary>
        private static string JPQL_INSERT = "insert into TCAROPERACIONLOTE  ( COPERACION, FPROCESO, CLOTE, CMODULO, CTAREA, ORDEN, NUMEROEJECUCION ) "
            + "select distinct tcuota.coperacion, @fproceso, @clote, @cmodulo, @ctarea, @orden, @numeroejecucion from TCAROPERACIONCUOTA tcuota, TCAROPERACION toper  "
            + "where toper.coperacion = tcuota.coperacion and toper.cestatus not in ('NEG', 'CAN', 'APR') and tcuota.cestatus in('VIG','VEN','NDV') "
            + "  and tcuota.fpago is null and tcuota.fvencimiento <= @fproceso and toper.cproducto is not null "
            + "  and isnull(tcuota.cbanda,0) != (select tb.cbanda from tcarperfilebanda tb where tb.cestatus = tcuota.cestatus "
            + "  and tb.cestadooperacion = tcuota.cestadooperacion and tb.csegmento = tcuota.csegmento "
            + "  and datediff(dd, CONVERT(DATETIME,STR(tcuota.fvencimiento)), CONVERT(DATETIME,STR(@fproceso))) between tb.diasdesde and tb.diashasta "
            + "  and toper.cmodulo = tb.cmodulo and toper.cproducto = tb.cproducto and toper.ctipoproducto = tb.ctipoproducto) "
            + "  and not exists ( select 1 from TCAROPERACIONLOTE tlos "
            + "                   where tlos.COPERACION = tcuota.COPERACION and tlos.FPROCESO = @fproceso and tlos.CLOTE = @clote "
            + "                   and tlos.CMODULO = @cmodulo and tlos.CTAREA = @ctarea and tlos.EJECUTADA = '1' )";
    }


}
