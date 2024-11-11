using modelo;
using modelo.helper;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.contabilidad {

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla tconperiocontable.
    /// </summary>
    public class TconPeriodoContableDal {

 
        /// <summary>
        /// Entrega una lista de tconperiodocontable.
        /// </summary>
        /// <param name="ccompania">Codigo de compania.</param>
        /// <returns>IList<TconNivelDto></returns>
        public static IList<tconperiodocontable> Find() {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tconperiodocontable> lista = new List<tconperiodocontable>();
            lista = contexto.tconperiodocontable.AsNoTracking().ToList(); 
            return lista;
        }

        /// <summary>
        /// Encuentra un registro de tconperiodocontable por el pk
        /// </summary>
        public static tconperiodocontable Find(int fecha) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tconperiodocontable obj;
            int anio = Fecha.GetAnio(fecha);
            string mes = String.Format("{0:00}", Fecha.GetMes(fecha));
            obj = contexto.tconperiodocontable.Where(x => x.anio == anio &&
                                                    x.mesperiodocdetalle.Equals(mes)).SingleOrDefault();
            if (obj!= null) {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

        /// <summary>
        /// Encuentra un registro de tconperiodocontable por el pk
        /// </summary>
        public static tconperiodocontable Find(int anio, string mes) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tconperiodocontable obj;
            obj = contexto.tconperiodocontable.Where(x => x.anio == anio &&
                                                    x.mesperiodocdetalle.Equals(mes)).SingleOrDefault();
            if (obj != null) {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

        /// <summary>
        /// Devuelve true o false o nulo para un periodo contable
        /// </summary>
        public static bool ValidarPeriodoContableActivo(int anio, string mes) {
            int fecha = anio * 100 + int.Parse(mes);
            tconperiodocontable obj = Find(fecha);
            if (obj == null) {
                return false;
            }
            return obj.activo.Value;
        }

        /// <summary>
        /// </summary>
        /// <param name="anio">año.</param>
        /// <param name="mesperiodocdetalle">mes.</param>
        public static void CerrarPeriodo(int fecha) {
            int anio = Fecha.GetAnio(fecha);
            string mes = String.Format("{0:00}", Fecha.GetMes(fecha));
            string SQL_update = "update tconperiodocontable set activo=0, periodocerrado = 1 where anio=@anio and mesperiodocdetalle = @mesperiodocdetalle";
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try {
                contexto.Database.ExecuteSqlCommand(SQL_update, new SqlParameter("@anio", anio),
                                                    new SqlParameter("@mesperiodocdetalle", mes));
            } catch (System.InvalidOperationException) {
                return;
            }
        }

        /// <summary>
        /// </summary>
        /// <param name="anio">año.</param>
        /// <param name="mesperiodocdetalle">mes.</param>
        public static void InactivarPeriodo(int fecha) {
            int anio = Fecha.GetAnio(fecha);
            string mes = String.Format("{0:00}", Fecha.GetMes(fecha));
            string SQL_update = "update tconperiodocontable set activo = 0 where anio=@anio and mesperiodocdetalle = @mesperiodocdetalle";
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try {
                contexto.Database.ExecuteSqlCommand(SQL_update, new SqlParameter("@anio", anio),
                                                    new SqlParameter("@mesperiodocdetalle", mes));
            } catch (System.InvalidOperationException) {
                return;
            }
        }

        /// <summary>
        /// Devuelve fecha de fin del periodo anterior al periodo actual
        /// </summary>
        public static int GetFPeriodoFinAnteriorAFechaContable(int fcontableactual) {
            int anioactual = int.Parse(fcontableactual.ToString().Substring(0, 4));
            string mes = String.Format("{0:00}", int.Parse(fcontableactual.ToString().Substring(4, 2)) - 1 );
            if (mes.Equals("00")) {
                mes = "12";
                anioactual = anioactual - 1;
            }
            tconperiodocontable obj = Find(anioactual,mes);
            if (obj == null) {
                return 0;
            }
            return obj.fperiodofin;
        }

        /// <summary>
        /// Devuelve fecha de fin del periodo anterior al periodo actual
        /// </summary>
        public static tconperiodocontable GetPeriodoAnteriorAFechaContable(int fcontableactual) {
            int anioactual = int.Parse(fcontableactual.ToString().Substring(0, 4));
            string mes = String.Format("{0:00}", int.Parse(fcontableactual.ToString().Substring(4, 2)) - 1);
            tconperiodocontable obj = Find(anioactual, mes);
            return obj;
        }

        /// <summary>
        /// Devuelve true o false o nulo para un periodo contable cerrado, este campo aplica unicamente
        /// para la generación de comprobantes contables manuales de ajustes de fin de mes
        /// </summary>
        public static bool ValidarPeriodoCerrado(int fcontable) {
            int anioactual = int.Parse(fcontable.ToString().Substring(0, 4));
            string mes = String.Format("{0:00}", int.Parse(fcontable.ToString().Substring(4, 2)));
            tconperiodocontable obj = Find(anioactual, mes);
            if (obj == null) {
                return false;
            }
            return obj.periodocerrado;
        }


        /// <summary>
        /// Devuelve fecha de fin del periodo anterior al periodo actual
        /// </summary>
        public static tconperiodocontable GetPeriodoXfperiodofin(int fperiodofin) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tconperiodocontable obj;
            obj = contexto.tconperiodocontable.Where(x => x.fperiodofin == fperiodofin).SingleOrDefault();
            if (obj != null) {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }
    }
}
