using dal.cartera;
using modelo;
using System.Data.SqlClient;
using util;
using util.dto.interfaces.lote;
using util.dto.lote;
using util.servicios.ef;
using util.dto.mantenimiento;
using System.Collections.Generic;
using dal.inversiones.contabilizacion;

namespace inversiones.lote.previo
{
    public class PrecioCierreContabiliza : ITareaPrevia
    {

        private RqMantenimiento rqmantenimiento = null;

        /// <summary>
        /// Elimina e inserta la operación de la contabilización del accrual diario.
        /// </summary>
        /// <param name="requestmodulo">Request del  módulo con el que se ejecuta la transaccion.</param>
        /// <param name="ctarea">Identificador de la tarea a ejectuar.</param>
        /// <param name="orden">Orden con el cual se ejecuta la tarea.</param>
        /// <returns></returns>
        public void Ejecutar(RequestModulo requestmodulo, string ctarea, int? orden)
        {

            rqmantenimiento = (RqMantenimiento)requestmodulo.GetDatos("RQMANTENIMIENTO");

            //IList<Dictionary<string, object>> tablatmp = new List<Dictionary<string, object>>();

            //DateTime finicio = DateTime.Now;

            //tablatmp = 

            try
            {
                TinvContabilizacionDal.VariacionPrecioContabiliza(
                rqmantenimiento.Cusuario
                , rqmantenimiento.Cagencia
                , rqmantenimiento.Csucursal);
            }
            catch
            { }


            //if ((string)tablatmp[0]["Mensaje"] != "OK")
            //{

            //    string lError = "";

            //    string ltextoresultado = (string)tablatmp[0]["Mensaje"];

            //    switch (long.Parse(tablatmp[0]["Error"].ToString()))
            //    {
            //        case 2627:
            //            lError = "INV-0026";
            //            break;
            //        case 1:
            //            lError = "INV-0027";
            //            break;
            //        case 2:
            //            lError = "INV-0028";
            //            break;
            //        default:
            //            lError = "INV-0010";
            //            break;
            //    }

            //    throw new AtlasException(lError, ltextoresultado);
            //}

        }

    }
}
