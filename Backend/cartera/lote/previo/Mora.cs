using dal.cartera;
using modelo;
using System;
using System.Data.SqlClient;
using util.dto.interfaces.lote;
using util.dto.lote;
using util.servicios.ef;

namespace cartera.lote.previo {
    /// <summary>
    /// Clase que obtien operaciones a calcular mora, se ejecuta el dia de vencimiento de la cuota ejemplo si la cuota vence viernes se calcula
    /// el día viernes, si la cuota vence sabado o domingo se ejecuta la proxima fecha contable, Dando oportinidad de pago al cliente la proxima
    /// fecha habil.La mora se calcula desde el día de vencimeinto de la cuota.Condiderar la fecha habil de la agencia..
    /// </summary>
    public class Mora : ITareaPrevia {

        public void Ejecutar(RequestModulo requestmodulo, string ctarea, int? orden)
        {
            TcarOperacionLoteDal.Eliminar(requestmodulo, ctarea);

            Insertar(requestmodulo, ctarea, orden);
        }

        /// <summary>
        /// Metodo que se encarga de insertar operaciones de cartera a cerrar provisiones, el viernes se cobra cuentas cuya fecha de vencimiento es sabado o domingo.
        /// </summary>
        private void Insertar(RequestModulo requestmodulo, string ctarea, int? orden)
        {
            // Parametro general para dias de gracia de mora
            decimal diasvencimiento = Math.Truncate(TcarParametrosDal.GetValorNumerico("DIASGRACIAMORA", requestmodulo.Ccompania));

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(JPQL_INSERT, new SqlParameter("fproceso", requestmodulo.Fconatble),
                                                             new SqlParameter("clote", requestmodulo.Clote),
                                                             new SqlParameter("cmodulo", requestmodulo.Cmodulo),
                                                             new SqlParameter("ctarea", ctarea),
                                                             new SqlParameter("fconatbleanterior", requestmodulo.Fconatbleanterior),
                                                             new SqlParameter("fconatble", requestmodulo.Fconatble),
                                                             new SqlParameter("orden", orden),
                                                             new SqlParameter("numeroejecucion", requestmodulo.Numeroejecucion),
                                                             new SqlParameter("diasvencimiento", diasvencimiento));
        }

        /// <summary>
        /// Sentencia que se encarga de insertar operaciones a la vista a capitalizar.
        /// </summary>
        private static string JPQL_INSERT = "insert into TCAROPERACIONLOTE  ( COPERACION, FPROCESO, CLOTE, CMODULO, CTAREA, ORDEN, NUMEROEJECUCION ) "
            + "select distinct tcuota.coperacion, @fproceso, @clote, @cmodulo, @ctarea, @orden, @numeroejecucion from TCAROPERACIONCUOTA tcuota, TCAROPERACION toper  "
            + "where toper.coperacion = tcuota.coperacion and toper.cestatus not in ('NEG', 'CAN', 'APR') and tcuota.fvencimiento <= @fconatble and tcuota.fpago is null "
            + "and toper.cproducto is not null "
            + "and datediff(dd,convert(datetime,str(tcuota.fvencimiento)), convert(datetime,str(@fproceso))) > @diasvencimiento "
            + "and not exists ( select 1 from TCAROPERACIONLOTE tlos "
            + "        where tlos.COPERACION = tcuota.COPERACION and tlos.FPROCESO = @fproceso and tlos.CLOTE = @clote "
            + "        and tlos.CMODULO = @cmodulo and tlos.CTAREA = @ctarea and tlos.EJECUTADA = '1' )";
    }


}
