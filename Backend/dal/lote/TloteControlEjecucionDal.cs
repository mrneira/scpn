using modelo;
using modelo.servicios;
using System.Collections.Generic;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.lote
{
    public class TloteControlEjecucionDal {

        /// <summary>
        ///     Busca en la base y entrega un registro de TloteControlEjecucion.
        /// </summary>
        /// <param name="fproceso">Fecha de proceso.</param>
        /// <param name="clote">Codigo de lote.</param>
        /// <param name="numeroejecucion">Numero de ejecucion del lote.</param>
        /// <returns>TloteControlEjecucion</returns>
        public static tlotecontrolejecucion Find(int fproceso, string clote, int numeroejecucion) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tlotecontrolejecucion obj = contexto.tlotecontrolejecucion.AsNoTracking().Where(x => x.fproceso == fproceso && x.clote == clote && x.numeroejecucion == numeroejecucion).SingleOrDefault();

            return obj;
        }

        /// <summary>
        ///     Valida que el lote no se encuentre en ejecucion.
        /// </summary>
        /// <param name="fproceso">Fecha de proceso.</param>
        /// <param name="clote">Codigo de lote.</param>
        /// <returns></returns>
        public static void ValidaenEjecucion(int fproceso, string clote) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();

            tlotecontrolejecucion control = contexto.tlotecontrolejecucion.AsNoTracking().Where(x => x.fproceso == fproceso && x.clote == clote && x.estatus == "P").SingleOrDefault();
            if (control != null) {
                throw new AtlasException("BLOTE-0004", "LOTE: {0} SE ENCUENTRA EN EJECUCIÓN ESPERE SU FINALIZACIÓN", clote);
            }
        }
        public static void LotesenEjecucion(int fproceso, string clote)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();

            IList<tlotecontrolejecucion> control = new List<tlotecontrolejecucion>();
             control = contexto.tlotecontrolejecucion.AsNoTracking().Where(x => x.fproceso == fproceso && x.clote == clote && x.estatus == "P").ToList();
            if (control.Count > 0)
            {
                throw new AtlasException("BLOTE-0004", "LOTE: {0} SE ENCUENTRA EN EJECUCIÓN ESPERE SU FINALIZACIÓN", clote);
            }
        }
        public static void Ejecucion(int fproceso, string clote)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();

            IList<tlotecontrolejecucion> control = contexto.tlotecontrolejecucion.AsNoTracking().Where(x => x.fproceso == fproceso && x.clote == clote).ToList();
            if (control == null || control.Count==0)
            {
                throw new AtlasException("BLOTE-0005", "EL LOTE {0} NO SE HA INICIADO REALIZAR EL PROCESO.", clote);
            }
        }

        private static string JPQL_NUM_EJECUCION = "select (coalesce(max(numeroejecucion),0) + 1) as numeroejecucion from TloteControlEjecucion t where t.fproceso = @fproceso and t.clote = @clote ";

        /// <summary>
        ///     Entrega el numero de ejecucion del lote para la fecha de proceso.
        /// </summary>
        /// <param name="fproceso">Fecha de proceso.</param>
        /// <param name="clote">Codigo de lote.</param>
        /// <returns></returns>
        public static int GetNumeroEjecucion(int fproceso, string clote) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();

            int sec = 1;
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@fproceso"] = fproceso;
            parametros["@clote"] = clote;

            List<string> lcampos = new List<string>();
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, JPQL_NUM_EJECUCION);
            IList<Dictionary<string, object>> ldatos = ch.GetRegistroDictionary();

            if (ldatos == null || !ldatos.Any()) {
                return sec;
            }
            Dictionary<string, object>  item = ldatos.First();
            sec = int.Parse(item.ElementAt(0).Value.ToString());
            return sec;
        }

        public static void Crear(int fproceso, string clote, int numeroejecucion, int cmodulo, int ctransaccion) {
            tlotecontrolejecucion control = new tlotecontrolejecucion();
            control.fproceso = fproceso;
            control.clote = clote;
            control.numeroejecucion = numeroejecucion;
            control.cmodulo = cmodulo;
            control.ctransaccion = ctransaccion;
            control.estatus = "P";
            Sessionef.Save(control);
        }

    }
}
