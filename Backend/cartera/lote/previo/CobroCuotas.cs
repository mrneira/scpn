using dal.cartera;
using modelo;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.interfaces.lote;
using util.dto.lote;
using util.servicios.ef;

namespace cartera.lote.previo {

    /// <summary>
    /// Clase que se encarga de obtener operaciones de cartera que tengan cuotas pendientes de cobro y los inserta en la tabla tcaroperacionlote.
    /// </summary>
    public class CobroCuotas : ITareaPrevia {

        public void Ejecutar(RequestModulo requestmodulo, string ctarea, int? orden) {
            TcarOperacionLoteDal.Eliminar(requestmodulo, ctarea);
            Insertar(requestmodulo, ctarea, orden);
        }

        /// <summary>
        /// Metodo que se encarga de insertar operaciones de cartera a realizar cobros para la fecha contable, el viernes se cobra cuentas cuya  fecha de vencimiento es sabado o domingo.
        /// </summary>
        /// <param name="requestmodulo">Objeto que contiene fechas contables, y transaccion desde la cual se ejecuta el fin de dia.</param>
        /// <param name="ctarea">Codigo de accion con el que se almacena las acciones a ejecutar por cuenta.</param>
        /// <param name="orden">Orden de ejecucion.</param>
        private void Insertar(RequestModulo requestmodulo, string ctarea, int? orden) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(JPQL_INSERT, new SqlParameter("fproceso", requestmodulo.Fconatble), new SqlParameter("clote", requestmodulo.Clote)
                                                           , new SqlParameter("cmodulo", requestmodulo.Cmodulo), new SqlParameter("ctarea", ctarea)
                                                           , new SqlParameter("fconatbleproxima", requestmodulo.Fconatbleproxima), new SqlParameter("orden", orden)
                                                           , new SqlParameter("numeroejecucion", requestmodulo.Numeroejecucion));
        }

        /// <summary>
        /// Sentencia que se encarga de insertar operaciones de cartera a ejecutar cobros con debito a cuentas vista o cuenta por pagar a favor de la operacion.
        /// </summary>
        private static String JPQL_INSERT = "insert into TCAROPERACIONLOTE  ( COPERACION, FPROCESO, CLOTE, CMODULO, CTAREA, ORDEN, NUMEROEJECUCION ) "
            + "select distinct tcuota.coperacion, @fproceso, @clote, @cmodulo, @ctarea, @orden, @numeroejecucion from TCAROPERACIONCUOTA tcuota, TCAROPERACION toper  "
            + "where toper.coperacion = tcuota.coperacion and toper.cestatus not in ('NEG', 'CAN', 'APR') and tcuota.fvencimiento < @fconatbleproxima and tcuota.fpago is null "
            + "and exists ( select 1 from TCAROPERACIONCXP tcxp where tcxp.coperacion = tcuota.coperacion and tcxp.saldo > 0 ) "
			+ "and not exists ( select 1 from TCAROPERACIONLOTE tlos "
			+ "        where tlos.COPERACION = tcuota.COPERACION and tlos.FPROCESO = @fproceso and tlos.CLOTE = @clote "
			+ "        and tlos.CMODULO = @cmodulo and tlos.CTAREA = @ctarea and tlos.EJECUTADA = '1' )";
    }
}
