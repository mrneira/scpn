using dal.cartera;
using modelo;
using System.Data.SqlClient;
using util.dto.interfaces.lote;
using util.dto.lote;
using util.servicios.ef;

namespace cartera.lote.migracion {

    /// <summary>
    /// Clase que se encarga de seleccionar las operaciones de cartera migradas.
    /// </summary>
    class CompletarDatosPrevio : ITareaPrevia {

        public void Ejecutar(RequestModulo requestmodulo, string ctarea, int? orden)
        {
            TcarOperacionLoteDal.Eliminar(requestmodulo, ctarea);
            Insertar(requestmodulo, ctarea, orden);
        }

        /// <summary>
        /// Metodo que se encarga de insertar operaciones de cartera activas para descuentos.
        /// </summary>
        private void Insertar(RequestModulo requestmodulo, string ctarea, int? orden)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(JPQL_INSERT, new SqlParameter("fproceso", requestmodulo.Fconatble)
                                                           , new SqlParameter("clote", requestmodulo.Clote)
                                                           , new SqlParameter("cmodulo", requestmodulo.Cmodulo)
                                                           , new SqlParameter("ctarea", ctarea)
                                                           , new SqlParameter("orden", orden)
                                                           , new SqlParameter("numeroejecucion", requestmodulo.Numeroejecucion));
        }

        /// <summary>
        /// Sentencia que se encarga de insertar operaciones de cartera para descuentos.
        /// </summary>
        private static string JPQL_INSERT = "insert into TCAROPERACIONLOTE(COPERACION, FPROCESO, CLOTE, CMODULO, CTAREA, ORDEN, NUMEROEJECUCION ) "
                              + "select op.coperacion, @fproceso, @clote, @cmodulo, @ctarea, @orden, @numeroejecucion from tcaroperacion op "
                              + "where coperacionmigrada is not null "
                              + "and not exists(select 1 from TCAROPERACIONLOTE tlos "
                              + "where tlos.COPERACION = op.COPERACION and tlos.FPROCESO = @fproceso and tlos.CLOTE = @clote "
                              + "and tlos.CMODULO = @cmodulo and tlos.CTAREA = @ctarea and tlos.EJECUTADA = '1')";
    }
}
