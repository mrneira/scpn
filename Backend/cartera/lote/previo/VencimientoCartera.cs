using dal.cartera;
using dal.generales;
using modelo;
using System;
using util.dto.interfaces.lote;
using util.dto.lote;
using util.servicios.ef;

namespace cartera.lote.previo {
    /// <summary>
    /// Clase que se encarga de obtener y eliminar simulaciones generadas en el día
    /// </summary>
    public class VencimientoCartera : ITareaPrevia {
        public void Ejecutar(RequestModulo requestmodulo, string ctarea, int? orden)
        {
            TcarOperacionLoteDal.Eliminar(requestmodulo, ctarea);
            Insertar(requestmodulo, ctarea, orden);

        }

        /// <summary>
        /// Metodo que se encarga de insertar operaciones de cartera vencidas.
        /// </summary>
        private void Insertar(RequestModulo requestmodulo, string ctarea, int? orden)
        {
            decimal diasvencimiento = TcarParametrosDal.GetValorNumerico("DIAS-VENCIMIENTO-CARTERA", requestmodulo.Ccompania);
            decimal dias = Math.Truncate(diasvencimiento);
            int fcontable = TgenfechacontableDal.Find(requestmodulo.Ccompania).fcontable;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            string sql = string.Format("insert into TCAROPERACIONLOTE(COPERACION, FPROCESO, CLOTE, CMODULO, CTAREA, ORDEN, NUMEROEJECUCION ) " +
            "select distinct cuo.coperacion, {0},'{1}',{2},'{3}',{4}, {5} from tcaroperacioncuota cuo, tcaroperacion ope where " +
            "ope.coperacion = cuo.coperacion and ope.cestatus not in ('NEG', 'CAN', 'APR') and ope.cproducto is not null and " +
            "datediff(dd,convert(datetime,str(cuo.fvencimiento)), convert(datetime,str({6}))) > {7} and " +
            "not exists ( select 1 from tcobcobranza cob where cob.coperacion = ope.coperacion ) and " +
            "not exists ( select 1 from TCAROPERACIONLOTE tlos " +
            "where tlos.COPERACION = ope.COPERACION and tlos.FPROCESO = {0} and tlos.CLOTE = '{1}' and " +
            "tlos.CMODULO = {2} and tlos.CTAREA = '{3}' and tlos.EJECUTADA = '1' )",
            requestmodulo.Fconatble, requestmodulo.Clote, requestmodulo.Cmodulo, ctarea, orden, requestmodulo.Numeroejecucion, fcontable, dias);
            contexto.Database.ExecuteSqlCommand(sql);
        }
    }
}
