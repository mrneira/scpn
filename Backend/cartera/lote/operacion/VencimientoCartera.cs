using dal.cartera;
using dal.cobranzas;
using modelo;
using System.Collections.Generic;
using util;
using util.dto.interfaces.lote;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace cartera.lote.operacion {
    /// <summary>
    /// Clase que se encarga de ejecutar las cobranzas en base a las fechas de vencimiento de las operaciones de cartera.
    /// </summary>
    public class VencimientoCartera : ITareaOperacion {

        public void Ejecutar(RqMantenimiento rqmantenimiento, RequestOperacion requestoperacion)
        {
            List<tcobcobranza> lcobranza = new List<tcobcobranza>();
            if (!ExisteCobranza(rqmantenimiento)) {
                tcobcobranza cob = new tcobcobranza();
                tcaroperacion operacion = TcarOperacionDal.FindSinBloqueo(rqmantenimiento.Coperacion);
                cob.coperacion = operacion.coperacion;
                cob.ccompania = operacion.ccompania;
                cob.cpersona = operacion.cpersona;
                cob.cagencia = operacion.cagencia;
                cob.csucursal = operacion.csucursal;
                cob.cusuariocartera = operacion.cusuarioapertura;
                cob.fingreso = rqmantenimiento.Fconatable;
                cob.cestatus = "ING";
                cob.Actualizar = false;
                cob.Esnuevo = true;

                // Graba registro de cobranza
                Sessionef.Grabar(cob);
            }

        }

        /// <summary>
        /// Consulta su existe una cobranza ingresada
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento</param>
        public bool ExisteCobranza(RqMantenimiento rqmantenimiento)
        {
            return (TcobCobranzaDal.FindCobranzaByCodigo(rqmantenimiento.Coperacion) == null) ? false : true;
        }

    }
}


