using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using modelo;
using modelo.servicios;
using util;
using util.servicios.ef;
using util.dto.consulta;
using modelo.helper;

namespace dal.prestaciones {
    /// <summary>
    /// Clase que implemeta, dml's de la tabla liquidacion 
    /// </summary>
    public class TpreLiquidacionDal {
        /// <summary>
        /// Obtiene las liquidaciones por expediemte
        /// </summary>
        /// <param name="secuencia"></param>
        /// <returns></returns>
        public static tpreliquidacion Find(int secuencia) {
            tpreliquidacion obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tpreliquidacion.AsNoTracking().Where(x => x.secuencia == secuencia && x.verreg == 0).SingleOrDefault();
            if(obj == null) {
                return null;
            }

            EntityHelper.SetActualizar(obj);
            return obj;
        }

        /// <summary>
        /// Crea una nueva instancia de la liquidacion
        /// </summary>
        /// <returns></returns>
        public static tpreliquidacion Crear() {
            tpreliquidacion obj = new tpreliquidacion();
            return obj;
        }

        private static string sqlMaxFechaOrdenGnl = " select STR(year(fechaordengen),4) + right('0' + ltrim(str(month(fechaordengen),2)),2) + right('0' + ltrim(str(day(fechaordengen),2)),2) FECHA from tsoccesantia where cpersona = @cpersona and ccdetalleestado = 'BLQ' and fechaordengen = (select max(fechaordengen) from tsoccesantia where cpersona = @cpersona and ccdetalleestado = 'BLQ') ";

        /// <summary>
        /// Parametros de consulta para obtener la máxima fecha de la ordeb general.
        /// </summary>
        /// <param name="cpersona"></param>
        /// <returns></returns>
        public static string GetMaxFechaOrdenGnl(long cpersona) {

            tpreliquidacion fc = new tpreliquidacion();
            // parametros de consulta para obtener la máxima fecha de la ordeb general.
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@cpersona"] = cpersona;
            // campos adiciones para la consulta.
            List<string> lcampos = new List<string>();
            lcampos.Add("FECHA");
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try {
                ConsultaHelper ch = new ConsultaHelper(contexto, parametros, sqlMaxFechaOrdenGnl);
                fc = (tpreliquidacion)ch.GetRegistro("tpreliquidacion", lcampos);
            } catch(System.InvalidOperationException) {
                throw new AtlasException("BLIQ-001", "NO EXISTE FECHA DE BAJA PARA {0}", cpersona);
            }

            return fc.Mdatos.Values.ElementAt(0).ToString();

        }

        private static string sqlhistoricocarrera = " select gra.cdetallejerarquia, tsocces.fechaordengen from tsoccesantia tsocces inner join tsoctipogrado gra on gra.cgrado = tsocces.cgrado where cpersona = @cpersona and fechaordengen >= @fechainicial and ccdetalleestado <> 'BLQ' order by fechaordengen ";

        /// <summary>
        /// Parametros de consulta para obtener el histórico de carrera del socio mayores a última liquidación.
        /// </summary>
        /// <param name="cpersona"></param>
        /// <param name="fechainicial"></param>
        /// <returns></returns>
        public static IList<Dictionary<string, object>> GetHistoricoCarrera(long cpersona, string fechainicial) {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@cpersona"] = cpersona;
            parametros["@fechainicial"] = fechainicial;
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, sqlhistoricocarrera);
            IList<Dictionary<string, object>> lisHistoricoCarrera = ch.GetRegistrosDictionary();
            return lisHistoricoCarrera;
        }

        private static string sqlDateDiff = " select DATEDIFF(MM, @FechaInicio , @FechaFin ) MESES";

        /// <summary>
        /// parametros de consulta para obtener la máxima fecha de la ordeb general.
        /// </summary>
        /// <param name="fechainicial"></param>
        /// <param name="fechafinal"></param>
        /// <returns></returns>
        public static int GetDateDiff(DateTime fechainicial, DateTime fechafinal) {

            tpreliquidacion fc = new tpreliquidacion();
            // parametros de consulta para obtener la máxima fecha de la ordeb general.
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@FechaInicio"] = fechainicial;
            parametros["@FechaFin"] = fechafinal;
            // campos adiciones para la consulta.
            List<string> lcampos = new List<string>();
            lcampos.Add("MESES");
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try {
                ConsultaHelper ch = new ConsultaHelper(contexto, parametros, sqlDateDiff);
                fc = (tpreliquidacion)ch.GetRegistro("tpreliquidacion", lcampos);
            } catch(System.InvalidOperationException) {
                throw new AtlasException("BLIQ-001", "ERROR EN DIFERENCIAS ENTRE LAS FECHAS {0} Y {1}", fechainicial, fechafinal);
            }

            return int.Parse(fc.Mdatos.Values.ElementAt(0).ToString());

        }
    }
}
