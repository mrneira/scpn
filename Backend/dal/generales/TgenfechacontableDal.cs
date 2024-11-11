using modelo;
using modelo.servicios;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.servicios.ef;

namespace dal.generales {

    /// <summary>
    /// Clase que implementa dml's manuales contra la base de datos.
    /// </summary>
    public class TgenfechacontableDal {

        private static string SQL = "select current_timestamp as FREAL, t.* from tgenfechacontable as t where t.ccompania = @ccompania ";

        /// <summary>
        /// Entrega la feha contable de la aplicacion.
        /// </summary>
        /// <param name="ccompania"></param>
        /// <returns></returns>
        public static tgenfechacontable Find(int ccompania) {
            tgenfechacontable fc = new tgenfechacontable();
            // parametros de consulta de la fecha contable.
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@ccompania"] = ccompania;
            // campos adiciones que llegan en mdatos de la entidad.
            List<string> lcampos = new List<string>();
            lcampos.Add("FREAL");

            AtlasContexto contexto = Sessionef.GetAtlasContexto();

            try {
                ConsultaHelper ch = new ConsultaHelper(contexto, parametros, SQL);
                fc = (tgenfechacontable)ch.GetRegistro("tgenfechacontable",  lcampos);
            } catch (System.InvalidOperationException) {
                throw new AtlasException("BGEN-011", "FECHA CONTABLE NO DEFINIDA PARA LA COMPANIA: {0}", ccompania);
            }
            return fc;
        }


        /// <summary>
        /// Consulta en la base de datos la definicion de una tgenmodulo.
        /// </summary>
        /// <param name="cmodulo">Codigo de modulo al que pertenece la transaccion.</param>
        /// <returns></returns>
        public static tgenfechacontable Find(int ccompania, int fcontable) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tgenfechacontable obj = null;

            obj = contexto.tgenfechacontable.AsNoTracking().Where(x => x.ccompania == ccompania && x.fcontable == fcontable).SingleOrDefault();
            return obj;
        }


    }
}
