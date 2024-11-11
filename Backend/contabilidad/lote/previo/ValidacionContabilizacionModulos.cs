using dal.contabilidad;
using dal.lote;
using dal.lote.contabilidad;
using modelo;
using System;
using System.Data.SqlClient;
using util.dto.interfaces.lote;
using util.dto.lote;
using util.servicios.ef;

namespace contabilidad.lote.previo
{
    /// <summary>
    /// Clase que se encarga de obtener registros de contabilidad a generar comprobantes y los inserta en TconRegistroLote.
    /// </summary>
    public class ValidacionContabilizacionModulos : ITareaPrevia {

        public void Ejecutar(RequestModulo requestmodulo, string ctarea, int? orden) {
            tconcontrol control = TconControlDal.Find();
            int? fdesde = control.fcontailizacionmodulos;
            int fhasta = requestmodulo.Fconatble;
            if(fdesde == null || fdesde == 0) {
                fdesde = requestmodulo.Fconatbleanterior;
            }
            requestmodulo.AddDatos("fcontabledesde", fdesde);
            requestmodulo.AddDatos("fcontablehasta", fhasta);
            // Elimina registros previos mayores a la fecha de ultima contabilizacion, si se contabiliza sin errores se actualiza la fecha de
            // ultima contabilizacion en la clase ContablizacionModulos
            TconComprobantePrevioDal.Eliminar( (int)fdesde );
        }

    }

}
