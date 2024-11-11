using dal.cartera;
using modelo;
using util.dto.interfaces.lote;
using util.dto.lote;
using util.servicios.ef;
using System.Collections.Generic;
using dal.inversiones.contabilizacion;
using util.dto.mantenimiento;
using util;
using dal.lote;
using System;
namespace inversiones.lote.previo
{
    public class PrecioCierreVariacion : ITareaPrevia
    {
        private RqMantenimiento rqmantenimiento = null;

        public void Ejecutar(RequestModulo requestmodulo, string ctarea, int? orden)
        {
            rqmantenimiento = (RqMantenimiento)requestmodulo.GetDatos("RQMANTENIMIENTO");

            //IList<Dictionary<string, object>> tablatmp = new List<Dictionary<string, object>>();

            //tablatmp = 

            try
            {
                TinvContabilizacionDal.VariacionPrecioCierre(
                rqmantenimiento.Cusuario
                , rqmantenimiento.Fconatable);

            }
            catch
            { }

        }

    }
}
