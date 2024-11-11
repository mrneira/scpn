using modelo;
using modelo.helper;
using modelo.interfaces;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using util.servicios.ef;

namespace dal.tesoreria
{
    public class TtesRecaudacionDetalleDal
    {
        /// <summary>
        /// Entrega el totalizado de recaudaciones 
        /// </summary>
        /// <returns></returns>
        public static decimal ObtenerTotalRecaudacionesPendientes(int? fechaTrabajo, string cestado)
        {
            List<ttesrecaudaciondetalle> obj = new List<ttesrecaudaciondetalle>();
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.ttesrecaudaciondetalle.AsNoTracking().Where(x => x.cestado == cestado && x.fcontable == fechaTrabajo && x.crecaudacion == 0).ToList();
            return obj.Sum(a => a.valor);
        }

        /// <summary>
        /// Entrega el totalizado de registros de  recaudaciones 
        /// </summary>
        /// <returns></returns>
        public static int ObtenerRegistrosRecaudacionesPendientes(int? fechaTrabajo, string cestado)
        {
            List<ttesrecaudaciondetalle> obj = new List<ttesrecaudaciondetalle>();
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.ttesrecaudaciondetalle.AsNoTracking().Where(x => x.cestado == cestado && x.fcontable == fechaTrabajo && x.crecaudacion == 0).ToList();
            return obj.Count();
        }

        /// <summary>
        /// Entrega la lista de detalle de recaudaciones totalizado
        /// </summary>
        /// <returns></returns>
        public static List<ttesrecaudaciondetalle> Find(int? fechaTrabajo, string cestado)
        {
            List<ttesrecaudaciondetalle> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.ttesrecaudaciondetalle.AsNoTracking().Where(x => x.cestado == cestado).ToList();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj.ToList<IBean>());
            }
            return obj;
        }

        public static List<ttesrecaudaciondetalle> FindByFcontableEstado(int fcontable, string cestado)
        {
            List<ttesrecaudaciondetalle> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.ttesrecaudaciondetalle.AsNoTracking().Where(x => x.cestado == cestado
                                                                        && x.fcontable == fcontable).ToList();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj.ToList<IBean>());
            }
            return obj;
        }

        private static string SQL_CASH_NO_COBRADO_CAB = "SELECT crecaudacion FROM ttesrecaudaciondetalle " +
            "WHERE fcontable < @fcontable AND cestado=@cestado GROUP BY crecaudacion";
        private static string SQL_CASH_COBRADO_PARCIAL = "SELECT crecaudacion FROM ttesrecaudaciondetalle WHERE crecaudacion = @crecaudacion and cestado='3'";
        private static string SQL_CASH_NO_COBRADO = "update ttesrecaudaciondetalle SET cestado = '6' WHERE crecaudacion = @crecaudacion and cestado <> '3'";

        private static string SQL_CASH_NO_COBRADO_UP_DET = "update ttesrecaudaciondetalle SET cestado = '4' where crecaudacion = @crecaudacion";
        private static string SQL_CASH_NO_COBRADO_UP_CAB = "update ttesrecaudacion SET cestado = '4' WHERE crecaudacion = @crecaudacion";

        public static void CashNoCobrado(int fcontable, string cestado)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<long> cab = null;
            cab = contexto.Database.SqlQuery<long>(SQL_CASH_NO_COBRADO_CAB, new SqlParameter("fcontable", fcontable), new SqlParameter("cestado", cestado)).ToList();
            foreach (long item in cab)
            {
                List<long> pagos = null;
                pagos = contexto.Database.SqlQuery<long>(SQL_CASH_COBRADO_PARCIAL, new SqlParameter("crecaudacion", item)).ToList();
                if (pagos.Count > 0)
                {
                    contexto.Database.ExecuteSqlCommand(SQL_CASH_NO_COBRADO
                , new SqlParameter("crecaudacion", item));
                }
                else
                {
                    contexto.Database.ExecuteSqlCommand(SQL_CASH_NO_COBRADO_UP_CAB
                , new SqlParameter("crecaudacion", item));

                    contexto.Database.ExecuteSqlCommand(SQL_CASH_NO_COBRADO_UP_DET
               , new SqlParameter("crecaudacion", item));
                }
            }
        }

        private static string SQL_CASH_VIGENCIA_RANGO = "SELECT crecaudacion FROM ttesrecaudacion WHERE @fcontable between finicio and ffin GROUP BY crecaudacion";
        private static string SQL_CASH_VIGENCIA_CAB = "update ttesrecaudacion SET cestado = '4' WHERE crecaudacion = @crecaudacion and cestado != '3'";
        private static string SQL_CASH_VIGENCIA_DET = "update ttesrecaudaciondetalle SET cestado = '4' WHERE crecaudacion = @crecaudacion and cestado != '3'";

        public static void CashVigencia(int fcontable, string cestado)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<long> cab = null;
            cab = contexto.Database.SqlQuery<long>(SQL_CASH_VIGENCIA_RANGO, new SqlParameter("fcontable", fcontable)).ToList();
            foreach (long item in cab)
            {
                contexto.Database.ExecuteSqlCommand(SQL_CASH_VIGENCIA_CAB
                , new SqlParameter("crecaudacion", item));

                contexto.Database.ExecuteSqlCommand(SQL_CASH_VIGENCIA_DET
                , new SqlParameter("crecaudacion", item));
            }
        }

        public static List<ttesrecaudaciondetalle> FindByEstado(string cestado)
        {
            List<ttesrecaudaciondetalle> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.ttesrecaudaciondetalle.AsNoTracking().Where(x => x.cestado == cestado).ToList();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj.ToList<IBean>());
            }
            return obj;
        }

        public static List<ttesrecaudaciondetalle> FindByCodigoCabecera(long crecaudacion, string cestado)
        {
            List<ttesrecaudaciondetalle> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.ttesrecaudaciondetalle.AsNoTracking().Where(x => x.crecaudacion == crecaudacion && x.cestado == cestado).ToList();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj.ToList<IBean>());
            }
            return obj;
        }

        public static List<ttesrecaudaciondetalle> FindByCodigoCabecera(long crecaudacion)
        {
            List<ttesrecaudaciondetalle> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.ttesrecaudaciondetalle.AsNoTracking().Where(x => x.crecaudacion == crecaudacion).ToList();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj.ToList<IBean>());
            }
            return obj;
        }

        public static ttesrecaudaciondetalle FindByCodigoOperacionPago(int cmodulo, int ctransaccion, string coperacion, string cestado)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            ttesrecaudaciondetalle obj = contexto.ttesrecaudaciondetalle.AsNoTracking().Where(x => x.cmodulo == cmodulo
                                                                                                && x.ctransaccion == ctransaccion
                                                                                                && x.coperacion == coperacion
                                                                                                && x.cestado.Equals(cestado)).SingleOrDefault();
            return obj;
        }

        private static string SQL_AUTORIZA = "update ttesrecaudaciondetalle set cestado = @cestado"
                + " where crecaudaciondetalle = @crecaudaciondetalle and fcontable = @fcontable";

        public static void AutorizarPagos(long crecaudaciondetalle, string cestado, int? fcontable)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(SQL_AUTORIZA
                , new SqlParameter("cestado", cestado)
                , new SqlParameter("crecaudaciondetalle", crecaudaciondetalle)
                , new SqlParameter("fcontable", fcontable));
        }

        private static string SQL_AUTORIZAMASIVO = "update ttesrecaudaciondetalle set cestado = @cestado"
                + " where fcontable = @fcontable";

        public static void AutorizarPagosMasivo(string cestado, int? fcontable)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(SQL_AUTORIZAMASIVO
                , new SqlParameter("cestado", cestado)
                , new SqlParameter("fcontable", fcontable));
        }

        private static string SQL_AUTORIZAMASIVOPK = "update ttesrecaudaciondetalle set cestado = @cestado"
                + " where crecaudacion = @crecaudacion";

        public static void AutorizarPagosMasivoPk(string cestado, long crecaudacion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(SQL_AUTORIZAMASIVOPK
                , new SqlParameter("cestado", cestado)
                , new SqlParameter("crecaudacion", crecaudacion));
        }

        private static string SQL_REGISTRACODIGODETALLE = "update ttesrecaudaciondetalle set crecaudacion = @crecaudacion"
                + " where fcontable = @fcontable and cestado = @cestado and crecaudacion = 0";

        public static void RegistrarCodigoDetalle(string cestado, int? fcontable, long crecaudacion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(SQL_REGISTRACODIGODETALLE
                , new SqlParameter("crecaudacion", crecaudacion)
                , new SqlParameter("cestado", cestado)
                , new SqlParameter("fcontable", fcontable));
        }

        public static List<ttesrecaudaciondetalle> FindConciliacion(int finicio, int ffin, string cestado)
        {
            List<ttesrecaudaciondetalle> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.ttesrecaudaciondetalle.Where(x => x.cestado == cestado
                                                            && x.fcontable >= finicio
                                                            && x.fcontable <= ffin
                                                            && x.conciliado == false).ToList();
            return obj;
        }

        public static ttesrecaudaciondetalle FindCcomprobante(long crecaudaciondetalle)
        {

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            ttesrecaudaciondetalle recaudacion = null;

            recaudacion = contexto.ttesrecaudaciondetalle.AsNoTracking().Where(x => x.crecaudaciondetalle == crecaudaciondetalle).SingleOrDefault();
            if (recaudacion == null)
            {
                return null;
            }
            EntityHelper.SetActualizar(recaudacion);
            return recaudacion;
        }

        //RRO 20220920
        public static List<ttesrecaudaciondetalle> FindTtesrecaudaciondetalleRango(int finicio, int ffin)
        {
            List<ttesrecaudaciondetalle> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.ttesrecaudaciondetalle.Where(x => x.valorprocesado != null
                                                            && x.fcontable >= finicio
                                                            && x.fcontable <= ffin).ToList();
            return obj;
        }
    }
}
