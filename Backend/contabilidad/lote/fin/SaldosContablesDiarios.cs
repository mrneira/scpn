using contabilidad.saldo;
using dal.contabilidad;
using dal.lote;
using dal.lote.contabilidad;
using modelo;
using System;
using System.Data.SqlClient;
using util;
using util.dto.interfaces.lote;
using util.dto.lote;
using util.servicios.ef;

namespace contabilidad.lote.fin
{
    /// <summary>
    /// Clase que se encarga de obtener registros de contabilidad a generar comprobantes y los inserta en TconRegistroLote.
    /// </summary>
    public class SaldosContablesDiarios : ITareaFin
    {
        public void Ejecutar(RequestModulo requestmodulo, string ctarea, int? orden)
        {
            tconperiodocontable periodocontable = TconPeriodoContableDal.Find(requestmodulo.Fconatble);
            if (periodocontable.periodocerrado) {
                throw new AtlasException("CONTA-014", "EL PERIODO {0} SE ENCUENTRA CERRADO", requestmodulo.Fconatble);
            }
            SaldoCierreHelper sch = new SaldoCierreHelper();
            sch.Rollup(requestmodulo.Ccompania, requestmodulo.Fconatble);
        }
    }
}