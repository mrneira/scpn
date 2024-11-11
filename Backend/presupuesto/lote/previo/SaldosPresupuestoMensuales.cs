using presupuesto.saldo;
using System;
using util;
using util.dto.interfaces.lote;
using util.dto.lote;


namespace presupuesto.lote.previo
{
    /// <summary>
    /// Clase que se encarga de obtener registros de contabilidad a generar comprobantes y los inserta en TconRegistroLote.
    /// </summary>
    public class SaldosPresupuestoMensuales : ITareaPrevia
    {
        public void Ejecutar(RequestModulo requestmodulo, string ctarea, int? orden)
        {
            DateTime date = Fecha.ToDate(requestmodulo.Fconatble);
            int ultimodia = Fecha.UltimoDiaMes(date);
            if (ultimodia== date.Day)
            {
                SaldoCierrePresupuestoHelper scph = new SaldoCierrePresupuestoHelper();
                scph.Ejecutar(requestmodulo.Ccompania, requestmodulo.Fconatble);
            }
            
        }
    }
}