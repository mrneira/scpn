using modelo;
using System.Collections.Generic;
using System.Linq;
using util.servicios.ef;

namespace dal.cartera {
    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TcarSolicitudCargosTablaDto.
    /// </summary>
    public class TcarSolicitudCargosTablaDal {

        /**
         * Sentencia que devuelve una lista de cargos a incluir en la tabla de amortizacion.
         */
        /// <summary>
        /// Consulta en la base de datos cargos a incluir en la tabla de amortizacion.
        /// </summary>
        /// <param name="csolicitud">Numero de solicitud.</param>
        /// <returns>List TcarSolicitudCargosTablaDto </returns>
        public static List<tcarsolicitudcargostabla> Find(long csolicitud) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcarsolicitudcargostabla.AsNoTracking().Where(x => x.csolicitud == csolicitud).ToList();
        }

        /// <summary>
        /// Crea cargos asociados al deudor principal de la solicitud de cartera.
        /// </summary>
        /// <param name="tcarSolicitud">Objeto que contiene informacion de una solicitud de cartera.</param>
        /// <returns>List TcarSolicitudCargosTablaDto</returns>
        public static List<tcarsolicitudcargostabla> CrearDeudor(tcarsolicitud tcarSolicitud) {
            List<tcarsolicitudcargostabla> lcargossoli = new List<tcarsolicitudcargostabla>();
            List<tcarproductocargostabla> lcargosprod = TcarProductoCargosTablaDal.Find((int)tcarSolicitud.cmodulo,
                    (int)tcarSolicitud.cproducto, (int)tcarSolicitud.ctipoproducto);
            foreach (tcarproductocargostabla cargoprod in lcargosprod) {
                tcarsolicitudcargostabla cargossol = TcarSolicitudCargosTablaDal.Crear(cargoprod, (long)tcarSolicitud.cpersona,
                        tcarSolicitud.csolicitud, (int)tcarSolicitud.ccompania);
                lcargossoli.Add(cargossol);
            }

            return lcargossoli;
        }
        /// <summary>
        /// Crea un objeto de cargos a asociar a la tabla de amortizacion.
        /// </summary>
        /// <param name="tcarProductoCargosTabla">Defincion de cargos a asociar a una tabla de amortizacion.</param>
        /// <param name="cpersona">Codigo de persona asociada al cargo tabla.</param>
        /// <param name="csolicitud">Numero de solicitud.</param>
        /// <param name="ccompania">Codigo de compania a la pertenece la persona.</param>
        /// <returns>TcarSolicitudCargosTablaDto</returns>
        public static tcarsolicitudcargostabla Crear(tcarproductocargostabla tcarProductoCargosTabla, long cpersona, long csolicitud,
                int ccompania) {
            tcarsolicitudcargostabla obj = new tcarsolicitudcargostabla();
            obj.cpersona = cpersona;
            obj.csolicitud = csolicitud;
            obj.csaldo = tcarProductoCargosTabla.csaldo;
            obj.ccompania = (ccompania);
            obj.monto = (tcarProductoCargosTabla.monto);
            obj.modificable = (false);
            return obj;
        }

        /// <summary>
        /// Metodo que transforma cargos de tabla asociados a una solicitud de credito <br>
        /// una lista de cargos asociadas a una operacion de cartera.
        /// </summary>
        /// <param name="lTcarSolicitudGastosLiquida">Lista de cargos de liquidacion.</param>
        /// <param name="coperacion">Numero de operacion de cartera.</param>
        /// <returns>List TcarOperacionGastosLiquida </returns>
        public static List<tcaroperacioncargostabla> ToTcarOperacionCargosTabla(List<tcarsolicitudcargostabla> lTcarSolicitudCargosTabla,
                string coperacion) {
            List<tcaroperacioncargostabla> lcargos = new List<tcaroperacioncargostabla>();

            foreach (tcarsolicitudcargostabla sol in lTcarSolicitudCargosTabla) {
                tcaroperacioncargostabla t = new tcaroperacioncargostabla();
                t.coperacion = (coperacion);
                t.csaldo = (sol.csaldo);
                t.cpersona = (sol.cpersona);
                t.ccompania = (sol.ccompania.Value);
                t.monto = (sol.monto);
                lcargos.Add(t);
            }
            return lcargos;
        }
    }
}
