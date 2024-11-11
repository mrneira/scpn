using dal.cartera;
using modelo;
using System.Data.SqlClient;
using util.dto.interfaces.lote;
using util.dto.lote;
using util.servicios.ef;

namespace cartera.lote.previo
{
    /// <summary>
    /// Clase que se encarga de obtener operaciones que tienen cuotas que vencen en la fecha de contable, actualiza a cero el valor del campo
    /// ACCRUAL, actualiza el saldo pendiente de pago de los rubros tipo accrual.Las cuotas que vencen antes de la proxima fecha contable el
    /// cierre se hace en el dia contable, ejemplo cuotas que vence el viernes se cierra el viernes, cuotas que vencen domingo se cierra el
    /// viernes el calculo se hace hasta un dia antes de la fecha de vencimiento.
    /// </summary>
    public class CierreAccrual : ITareaPrevia {

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
                                                           , new SqlParameter("fconatbleproxima", requestmodulo.Fconatbleproxima), new SqlParameter("orden", orden)
                                                           , new SqlParameter("numeroejecucion", requestmodulo.Numeroejecucion));
        }

        /// <summary>
        /// Sentencia que se encarga de insertar operaciones a la vista a capitalizar.
        /// </summary>
        private static string JPQL_INSERT = "insert into TCAROPERACIONLOTE  ( COPERACION, FPROCESO, CLOTE, CMODULO, CTAREA, ORDEN, NUMEROEJECUCION ) "
            + "select distinct tcuota.coperacion, @fproceso, @clote, @cmodulo, @ctarea, @orden, @numeroejecucion " 
            + "from TCAROPERACIONCUOTA tcuota, TCAROPERACION toper "
            + "where tcuota.coperacion = toper.coperacion and toper.cestatus not in ('NEG', 'CAN', 'APR') "
            + "and toper.cproducto is not null "
            + "and tcuota.fvencimiento = @fproceso and tcuota.fpago is null "
            + "and not exists ( select 1 from TCAROPERACIONLOTE tlos "
			+ "        where tlos.COPERACION = tcuota.COPERACION and tlos.FPROCESO = @fproceso and tlos.CLOTE = @clote "
            + "        and tlos.CMODULO = @cmodulo and tlos.CTAREA = @ctarea and tlos.EJECUTADA = '1' )";
        

    }


}
