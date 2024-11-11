using dal.cartera;
using modelo;
using util.dto.interfaces.lote;
using util.dto.lote;
using util.servicios.ef;

namespace cartera.lote.previo {
    /// <summary>
    /// Clase que se encarga de obtener y eliminar simulaciones generadas en el día
    /// </summary>
    public class RecaudacionPago : ITareaPrevia {
        public void Ejecutar(RequestModulo requestmodulo, string ctarea, int? orden)
        {
            TcarOperacionLoteDal.Eliminar(requestmodulo, ctarea);
            Insertar(requestmodulo, ctarea, orden);
        }

        /// <summary>
        /// Metodo que se encarga de insertar operaciones de cartera para el pago de cash.
        /// </summary>
        private void Insertar(RequestModulo requestmodulo, string ctarea, int? orden)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            string sql = string.Format("insert into TCAROPERACIONLOTE(COPERACION, FPROCESO, CLOTE, CMODULO, CTAREA, ORDEN, NUMEROEJECUCION ) " +
            "select o.coperacion, {0},'{1}',{2},'{3}',{4}, {5} "+
            "from ttesrecaudaciondetalle r, tcaroperacion o "+
            "where r.coperacion = o.coperacion and o.cestatus not in ('NEG', 'APR') " +
            "and r.fcontable = {0} and r.cestado = 5 and r.cmodulo = o.cmodulo and r.ctransaccion = 70 " +
            "and not exists(select 1 from TCAROPERACIONLOTE tlos " +
            "where tlos.COPERACION = o.coperacion and tlos.FPROCESO = {0} and tlos.CLOTE = '{1}' " +
            "and tlos.CMODULO = {2} and tlos.CTAREA = '{3}' and tlos.EJECUTADA = '1')", requestmodulo.Fconatble, requestmodulo.Clote,
            requestmodulo.Cmodulo, ctarea, orden, requestmodulo.Numeroejecucion);
            contexto.Database.ExecuteSqlCommand(sql);
        }
    }
}
