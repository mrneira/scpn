using dal.cartera;
using modelo;
using util.dto.interfaces.lote;
using util.dto.lote;
using util.servicios.ef;

namespace cartera.lote.previo {
    /// <summary>
    /// Clase que se encarga de obtener las operaciones de descuentos
    /// </summary>
    public class DescuentosPago : ITareaPrevia {
        public void Ejecutar(RequestModulo requestmodulo, string ctarea, int? orden)
        {
            tcardescuentos descuento = TcarDescuentosDal.FindNoPagada();
            if (descuento == null) {
                return;
            }

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
            "select distinct d.coperacion, {0},'{1}',{2},'{3}',{4}, {5} " +
            "from tcardescuentosdetalle d, tcardescuentos c " +
            "where d.particion = c.particion and c.pagoaplicado = 0 and d.frespuesta is not null and d.fpago is null and d.fdevolucion is null " +
            "and not exists(select 1 from TCAROPERACIONLOTE tlos " +
            "where tlos.COPERACION = d.coperacion and tlos.FPROCESO = {0} and tlos.CLOTE = '{1}' " +
            "and tlos.CMODULO = {2} and tlos.CTAREA = '{3}' and tlos.EJECUTADA = '1')", requestmodulo.Fconatble, requestmodulo.Clote,
            requestmodulo.Cmodulo, ctarea, orden, requestmodulo.Numeroejecucion);
            contexto.Database.ExecuteSqlCommand(sql);
        }
    }
}
