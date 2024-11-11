using dal.cartera;
using dal.tesoreria;
using modelo;
using tesoreria.enums;
using util.dto.interfaces.lote;
using util.dto.lote;
using util.servicios.ef;

namespace cartera.lote.previo {
    /// <summary>
    /// Clase que se encarga de obtener y eliminar simulaciones generadas en el día
    /// </summary>
    public class Recaudacion : ITareaPrevia {
        public void Ejecutar(RequestModulo requestmodulo, string ctarea, int? orden)
        {
            TcarOperacionLoteDal.Eliminar(requestmodulo, ctarea);
            TtesRecaudacionDetalleDal.CashNoCobrado(requestmodulo.Fconatble, ((int)EnumTesoreria.EstadoRecaudacionCash.Generado).ToString());
            
            Insertar(requestmodulo, ctarea, orden);
        }

        /// <summary>
        /// Metodo que se encarga de insertar operaciones de cartera para el pago de cash.
        /// </summary>
        private void Insertar(RequestModulo requestmodulo, string ctarea, int? orden)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            string sql = string.Format("insert into TCAROPERACIONLOTE(COPERACION, FPROCESO, CLOTE, CMODULO, CTAREA, ORDEN, NUMEROEJECUCION ) " +
            "select op.coperacion, {0},'{1}',{2},'{3}',{4}, {5} from tcaroperacion op where " +
            "op.cestatus not in ('NEG', 'CAN', 'APR') and op.cproducto is not null " +
            "and not exists(select 1 from TCAROPERACIONLOTE tlos " +
            "where tlos.COPERACION = op.COPERACION and tlos.FPROCESO = {0} and tlos.CLOTE = '{1}' " +
            "and tlos.CMODULO = {2} and tlos.CTAREA = '{3}' and tlos.EJECUTADA = '1')", requestmodulo.Fconatble, requestmodulo.Clote,
            requestmodulo.Cmodulo, ctarea, orden, requestmodulo.Numeroejecucion);
            contexto.Database.ExecuteSqlCommand(sql);
        }
    }
}
