using contabilidad.helper;
using dal.contabilidad;
using dal.lote;
using dal.monetario;
using modelo;
using System;
using System.Collections.Generic;
using util;
using util.dto.interfaces.lote;
using util.dto.lote;

namespace contabilidad.lote.fin
{
    /// <summary>
    /// Clase que se encarga de actualizar la fecha de ultmima contabilizacion de los diferentes modulos.
    /// </summary>
    public class ContabilizacionModulos : ITareaFin {
        /// <summary>
        /// ejecuta la tarea fin de contabilización de modulos
        /// </summary>
        /// <param name="requestmodulo"></param>
        /// <param name="ctarea"></param>
        /// <param name="orden"></param>
        public void Ejecutar(RequestModulo requestmodulo, string ctarea, int? orden) {
            Boolean errores = TloteResultadoPrevioDal.ExisteErrores(requestmodulo.Fconatble, requestmodulo.Numeroejecucion, requestmodulo.Clote, null, null);

            if (errores) {
                return;
            }
            int fcontablehasta = (int)requestmodulo.GetDatos("fcontablehasta");
            TconControlDal.UpdateFultimacontabilizacion(fcontablehasta);
        }


    }
}
