using modelo;
using System.Collections.Generic;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.cartera {

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TcarMovimiento.
    /// </summary>
    public class TcarMovimientoDal {


        /// <summary>
        /// Metodo que entrega una lista de movimientos de cartera a reversar.
        /// </summary>
        /// <param name="mensaje">Numero de mensaje a reversar.</param>
        /// <param name="coperacion">Numero de operacion asociado al numero de mensaje a reversar.</param>
        /// <param name="particion">Particion en la que se encuentra el registrod e movimiento a reversar.</param>
        /// <returns></returns>
        public static IList<tcarmovimiento> Find(string mensaje, string coperacion, int particion)
        {

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tcarmovimiento> lmovi = contexto.tcarmovimiento.Where(x => x.mensaje == mensaje && x.particion == particion && x.coperacion == coperacion).ToList();
            if (lmovi.Count == 0) {
                throw new AtlasException("BCAR-0012", "NO EXSTE REGISTROS A REVERSAR EN: {0} MENSAJE: {1} COPERACION: {2}", "TCARMOVIMIENTODTO", mensaje, coperacion);
            }
            return lmovi;

        }
        /// <summary>
        /// Metodo que entrega una lista de movimientos de cartera a reversar.
        /// </summary>
        /// <param name="mensaje">Numero de mensaje a reversar.</param>
        /// <param name="coperacion">Numero de operacion asociado al numero de mensaje a reversar.</param>
        /// <returns></returns>
        public static IList<tcarmovimiento> Find(string mensaje, string coperacion)
        {

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tcarmovimiento> lmovi = contexto.tcarmovimiento.Where(x => x.mensaje == mensaje && x.coperacion == coperacion).ToList();
            if (lmovi.Count == 0) {
                throw new AtlasException("BCAR-0012", "NO EXSTE REGISTROS A REVERSAR EN: {0} MENSAJE: {1} COPERACION: {2}", "TCARMOVIMIENTODTO", mensaje, coperacion);
            }
            return lmovi;

        }


        /// <summary>
        /// Metodo que entrega una lista de movimientos de cartera a reversar.
        /// </summary>
        /// <param name="mensaje">Numero de mensaje a reversar.</param>
        /// <param name="coperacion">Numero de operacion asociado al numero de mensaje a reversar.</param>
        /// <param name="particion">Particion en la que se encuentra el registrod e movimiento a reversar.</param>
        /// <returns></returns>
        public static IList<tcarmovimiento> Find(string mensaje, int particion)
        {

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tcarmovimiento> lmovi = contexto.tcarmovimiento.Where(x => x.mensaje == mensaje && x.particion == particion).ToList();
            if (lmovi.Count == 0) {
                throw new AtlasException("BCAR-0012", "NO EXSTE REGISTROS A REVERSAR EN: {0} MENSAJE: {1} COPERACION: {2}", "TCARMOVIMIENTODTO", mensaje);
            }
            return lmovi;

        }

        /// <summary>
        /// Metodo que entrega una lista de movimientos de cartera a reversar.
        /// </summary>
        /// <param name="mensaje">Numeor de mensaje a reversar.</param>
        /// <param name="coperacion">Numero de operacion asociado al numero de mensaje a reversar.</param>
        /// <param name="particion">Particion en la que se encuentra el registrod e movimiento a reversar.</param>
        /// <returns>IList<tcarmovimiento></returns>
        public static IList<tcarmovimiento> FindMovimientos(string mensaje, string coperacion, int particion)
        {
            IList<tcarmovimiento> lmovi = new List<tcarmovimiento>();
            try {
                lmovi = TcarMovimientoDal.Find(mensaje, coperacion, particion);
            }
            catch (AtlasException e) {
                if (!e.Codigo.Equals("BCAR-0012")) {
                    throw e;
                }
            }
            return lmovi;
        }

        /// <summary>
        /// Metodo que entrega una lista de movimientos de cartera a reversar.
        /// </summary>
        /// <param name="mensaje">Numeor de mensaje a reversar.</param>
        /// <param name="coperacion">Numero de operacion asociado al numero de mensaje a reversar.</param>
        /// <param name="particion">Particion en la que se encuentra el registrod e movimiento a reversar.</param>
        /// <returns>IList<tcarmovimiento></returns>
        public static IList<tcarmovimiento> FindMovimientos(string mensaje, int particion)
        {
            IList<tcarmovimiento> lmovi = new List<tcarmovimiento>();
            try {
                lmovi = TcarMovimientoDal.Find(mensaje, particion);
            }
            catch (AtlasException e) {
                if (!e.Codigo.Equals("BCAR-0012")) {
                    throw e;
                }
            }
            return lmovi;
        }

        /// <summary>
        /// Metodo que entrega una lista de movimientos de cartera.
        /// </summary>
        /// <param name="comprobante">Comprobante previo contable.</param>
        /// <returns>IList<tcarmovimiento></returns>
        public static IList<tcarmovimiento> FindMovimientos(tconcomprobanteprevio comprobante)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tcarmovimiento> lmovi = contexto.tcarmovimiento.Where(x => x.fcontable == comprobante.fcontable &&
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
