using cartera.enums;
using dal.cartera;
using dal.generales;
using dal.persona;
using modelo;
using System;
using System.Collections.Generic;
using util;
using util.dto.interfaces.lote;
using util.dto.lote;
using util.servicios.ef;

namespace cartera.lote.previo {
    /// <summary>
    /// Clase que se encarga de obtener y eliminar simulaciones generadas en el día
    /// </summary>
    public class EnvioOcp : ITareaPrevia {
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
            int particion = Constantes.GetParticion((int)requestmodulo.Ftrabajo);
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            string sql = string.Format("insert into TCAROPERACIONLOTE(COPERACION, FPROCESO, CLOTE, CMODULO, CTAREA, ORDEN, NUMEROEJECUCION ) " +
            "select des.coperacion, {0},'{1}',{2},'{3}',{4}, {5} from tcardescuentosdetalle des where " +
            "des.particion = {6} and des.archivoinstituciondetalle = '{7}' and " +
            "not exists (select 1 from TCAROPERACIONLOTE tlos " +
            "where tlos.COPERACION = des.COPERACION and tlos.FPROCESO = {0} and tlos.CLOTE = '{1}' and " +
            "tlos.CMODULO = {2} and tlos.CTAREA = '{3}' and tlos.EJECUTADA = '1' )",
            requestmodulo.Fconatble, requestmodulo.Clote, requestmodulo.Cmodulo, ctarea, orden, requestmodulo.Numeroejecucion, particion, EnumDescuentos.BANCOS.Cinstitucion);
            contexto.Database.ExecuteSqlCommand(sql);
        }
    }
}
