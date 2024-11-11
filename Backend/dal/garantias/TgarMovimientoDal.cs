using modelo;
using System.Collections.Generic;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.garantias {

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TgarMovimiento.
    /// </summary>
    public class TgarMovimientoDal {


        /// <summary>
        /// Metodo que entrega una lista de movimientos de cartera a reversar.
        /// </summary>
        /// <param name="mensaje">Numero de mensaje a reversar.</param>
        /// <param name="coperacion">Numero de operacion asociado al numero de mensaje a reversar.</param>
        /// <param name="particion">Particion en la que se encuentra el registrod e movimiento a reversar.</param>
        /// <returns></returns>
        public static IList<tgarmovimiento> Find(string mensaje, string coperacion, int particion)
        {

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tgarmovimiento> lmovi = contexto.tgarmovimiento.Where(x => x.mensaje == mensaje && x.particion == particion && x.coperacion == coperacion).ToList();
            if (lmovi.Count == 0) {
                throw new AtlasException("BGAR-005", "NO EXSTE REGISTROS A REVERSAR EN: {0} MENSAJE: {1} COPERACION: {2}", "TCARMOVIMIENTODTONO EXSTE REGISTROS A REVERSAR EN: {0} MENSAJE: {1} COPERACION: {2}", mensaje, coperacion);
            }
            return lmovi;
        }

        /// <summary>
        /// Metodo que entrega una lista de movimientos de garantías.
        /// </summary>
        /// <param name="comprobante">Comprobante previo contable.</param>
        /// <returns>IList<tcarmovimiento></returns>
        public static IList<tgarmovimiento> FindMovimientos(tconcomprobanteprevio comprobante) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tgarmovimiento> lmovi = contexto.tgarmovimiento.Where(x => x.fcontable == comprobante.fcontable &&
                                                                             x.particion == comprobante.particion &&
                                                                             x.ccompania == comprobante.ccompania &&
                                                                             x.ccuenta == comprobante.ccuenta &&
                                                                             x.cagenciaorigen == comprobante.cagencia &&
                                                                             x.csucursalorigen == comprobante.csucursal &&
                                                                             //x.cmodulo == comprobante.cmoduloproducto &&
                                                                             //x.cproducto == comprobante.cproducto &&
                                                                             //x.ctipoproducto == comprobante.ctipoproducto &&
                                                                             x.debito == comprobante.debito &&
                                                                             x.cclase == comprobante.cclase &&
                                                                             x.cmoneda == comprobante.cmoneda &&
                                                                             x.ctransaccionorigen == comprobante.ctransaccion &&
                                                                             x.cmoduloorigen == comprobante.cmodulo &&
                                                                             x.cmonedalocal == comprobante.cmonedaoficial).ToList();
            //if (lmovi.Count == 0) {
            //    throw new AtlasException("BCAR-0050", "NO EXSTEN MOVIMIENTOS");
            //}
            return lmovi;
        }

    }
}
