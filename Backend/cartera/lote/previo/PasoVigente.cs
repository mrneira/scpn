using dal.cartera;
using modelo;
using System.Data.SqlClient;
using util.dto.interfaces.lote;
using util.dto.lote;
using util.servicios.ef;

namespace cartera.lote.previo
{
    /// <summary>
    /// Clase que se encarga de obtener operaciones de cartera que tengan cuotas a pasar de vencido a vigente y los inserta en la tabla
    /// tcaroperacionlote.Las cuotas que vences sabado, domingo se pasa a vencido el lunes, en feriados se ejecuta el cambio de estado la
    /// proxima fecha contable.
    /// </summary>
    public class PasoVigente : ITareaPrevia {

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
            + "select distinct coperacion, @fproceso, @clote, @cmodulo, @ctarea, @orden, @numeroejecucion "
            + "from ( select distinct tcuota.coperacion as coperacion "
            + "from TCAROPERACIONCUOTA tcuota, TCAROPERACION toper, TGENTIPOCREDITO tc "
            + "where toper.coperacion = tcuota.coperacion and toper.cestatus not in ('NEG', 'CAN', 'APR', 'VIG') "
            + "and tcuota.numcuota = (select min(i.numcuota) from tcaroperacioncuota i where i.coperacion = tcuota.coperacion and i.fpago is null) "
            + "and tcuota.cestatus in('VIG','NDV','VEN') and tcuota.ctipocredito = tc.ctipocredito "
            + "and DATEDIFF(day, CONVERT(DATETIME,STR(tcuota.fvencimiento)), CONVERT(DATETIME,STR(@fproceso)) ) <= tc.diasgraciapasovencido union "
            + "select distinct c.coperacion from tcaroperacioncuota c, TCAROPERACION o where c.coperacion = o.coperacion and o.cestatus not in ('NEG', 'CAN', 'APR') and c.cestatus = 'NDV' and fpago is null "
            + "and c.coperacion not in (select distinct coperacion from tcaroperacioncuota where cestatus = 'VEN' and fpago is null )) t "
            + "where not exists ( select 1 from TCAROPERACIONLOTE tlos "
            + "where tlos.COPERACION = t.COPERACION and tlos.FPROCESO = @fproceso and tlos.CLOTE = @clote "
            + "and tlos.CMODULO = @cmodulo and tlos.CTAREA = @ctarea and tlos.EJECUTADA = '1' ) ";
    }


}
