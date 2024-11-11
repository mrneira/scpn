using dal.contabilidad;
using modelo;
using System;
using util;
using util.dto.interfaces.lote;
using util.dto.lote;
using util.servicios.ef;

namespace contabilidad.lote.fin
{
    /// <summary>
    /// Clase que se encarga de obtener registros de contabilidad a generar comprobantes y los inserta en TconRegistroLote.
    /// </summary>
    public class InactivarPeriodo : ITareaFin
    {
        public void Ejecutar(RequestModulo requestmodulo, string ctarea, int? orden)
        {
            DateTime date = Fecha.ToDate(requestmodulo.Fconatble);
            int ultimodia = Fecha.UltimoDiaMes(date);
            if (ultimodia== date.Day)
            {
                TconPeriodoContableDal.InactivarPeriodo(requestmodulo.Fconatble);
            }
            
        }
    }
}