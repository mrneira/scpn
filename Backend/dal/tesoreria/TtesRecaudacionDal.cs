using modelo;
using modelo.helper;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using util.dto.lote;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace dal.tesoreria {
    public class TtesRecaudacionDal {
        /// <summary>
        /// Entrega el registro de recaudacion
        /// </summary>
        /// <returns></returns>
        public static ttesrecaudacion Find(int fcontable)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            ttesrecaudacion obj = contexto.ttesrecaudacion.AsNoTracking().Where(x => x.fcontable == fcontable).SingleOrDefault();
            EntityHelper.SetActualizar(obj);
            return obj;
        }

        /// <summary>
        /// Entrega el registro de recaudacion por pk
        /// </summary>
        /// <returns></returns>
        public static ttesrecaudacion Find(long crecaudacion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            ttesrecaudacion obj = contexto.ttesrecaudacion.AsNoTracking().Where(x => x.crecaudacion == crecaudacion).SingleOrDefault();
            EntityHelper.SetActualizar(obj);
            return obj;
        }

        /// <summary>
        /// Entrega el registro de recaudacion por pk
        /// </summary>
        /// <returns></returns>
        public static ttesrecaudacion Find(int fcontable, int cmodulo)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            ttesrecaudacion obj = contexto.ttesrecaudacion.AsNoTracking().Where(x => x.fcontable == fcontable && x.cmodulo == cmodulo).SingleOrDefault();
            return obj;
        }

        /// <summary>
        /// Entrega el registro de recaudacion por pk
        /// </summary>
        /// <returns></returns>
        public static ttesrecaudacion Find(int fcontable, int cmodulo, int ctransaccion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            ttesrecaudacion obj = contexto.ttesrecaudacion.AsNoTracking().Where(x => x.fcontable == fcontable
                                                                                  && x.cmodulo == cmodulo
                                                                                  && x.ctransaccion == ctransaccion).SingleOrDefault();
            if (obj != null) {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

        /// <summary>
        /// Elimina registros de archivos dado la fecha contable, modulo y transaccion.
        /// </summary>
        /// <param name="fcontable">Fecha contable.</param>
        /// <param name="cmodulo">Codigo de modulo.</param>
        /// <param name="ctransaccion">Codigo de transaccion.</param>
        public static void Eliminar(int fcontable, int cmodulo, int ctransaccion)
        {
            String JPQL_DELETE = "delete from TtesRecaudacion where fcontable = @fcontable and cmodulo = @cmodulo and ctransaccion = @ctransaccion";
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(JPQL_DELETE, new SqlParameter("fcontable", fcontable),
                                                             new SqlParameter("cmodulo", cmodulo),
                                                             new SqlParameter("ctransaccion", ctransaccion));
        }

        /// <summary>
        /// Entrega la lista de operaciones no APR y CAN
        /// </summary>
        /// <returns></returns>
        public static List<tcaroperacion> FindOperacionesRecaudacion(int fechaGeneracion)
        {
            List<tcaroperacion> obj = new List<tcaroperacion>();
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tcaroperacion.AsNoTracking().Where(x => x.cestatus != "APR" || x.cestatus != "CAN" && x.fvigencia == fechaGeneracion).ToList();
            return obj;
        }

        /// <summary>
        /// Entrega la lista de operaciones a procesar por Cash Management por estado
        /// </summary>
        /// <returns></returns>
        public static List<ttesrecaudaciondetalle> FindCobrosPorEstado(string cestado)
        {
            List<ttesrecaudaciondetalle> obj = new List<ttesrecaudaciondetalle>();
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            EntityHelper.SetActualizar(obj.ToList<IBean>());
            return obj;
        }

        /// <summary>
        /// Entrega bool si la operación ya se realizo
        /// </summary>
        /// <returns></returns>
        public static bool ValidarLoteCobroGenerado(int fechaGeneracion)
        {
            bool existe = false;
            List<ttesrecaudacion> obj = new List<ttesrecaudacion>();
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            int count = contexto.ttesrecaudacion
                .Where(o => o.fgeneracion == fechaGeneracion)
                .Count();
            if (count > 0) {
                existe = true;
            }
            return existe;
        }

        /// <summary>
        /// Eliminar todos los recuados en estado pendiente
        /// </summary>
        /// <returns></returns>
        public static void EliminarRecaudoPorEstado(string cestado)
        {
            string JPQL_DELETE = "delete from ttesrecaudacion where cestado = @cestado";
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(JPQL_DELETE, new SqlParameter("@cestado", cestado));
        }

        public static List<ttesrecaudacion> FindByFcontableEstado(int fcontable, string cestado)
        {
            List<ttesrecaudacion> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.ttesrecaudacion.AsNoTracking().Where(x => x.fcontable == fcontable).ToList();
            if (obj != null) {
                EntityHelper.SetActualizar(obj.ToList<IBean>());
            }
            return obj;
        }

        private static string SQL_AUTORIZACABECERAPK = "update ttesrecaudacion set cestado = @cestado,cusuarioaplica= @cusuarioaplica, faplica= @faplica"
                + " where crecaudacion = @crecaudacion";

        public static void AutorizarCabeceraCashPk(string cestado, long crecaudacion, string cusuarioaplica, DateTime faplica)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(SQL_AUTORIZACABECERAPK
                , new SqlParameter("cestado", cestado)
                , new SqlParameter("cusuarioaplica", cusuarioaplica)
                , new SqlParameter("faplica", faplica)
                , new SqlParameter("crecaudacion", crecaudacion));
        }

        private static string SQL_AUTORIZADETALLE = "update ttesrecaudaciondetalle set cestado = @cestado, ccomprobante = @ccomprobante"
                + " where crecaudaciondetalle = @crecaudaciondetalle";

        public static void ActualizarCobrosModulo(ttesrecaudacion cabecera, List<ttesrecaudaciondetalle> detalle, RqMantenimiento rm, string ccomprobante)
        {
            List<ttesrecaudacion> lrecaudacion = rm.GetTabla("AUTORIZARAPLICACION").Lregistros.Cast<ttesrecaudacion>().ToList();
            foreach (ttesrecaudacion item in lrecaudacion) {
                item.cestado = "3";
                item.cusuarioaplica = rm.Cusuario;
                item.faplica = rm.Freal;
            }

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            foreach (ttesrecaudaciondetalle det in detalle) {
                contexto.Database.ExecuteSqlCommand(SQL_AUTORIZADETALLE
                    , new SqlParameter("cestado", "3")
                    , new SqlParameter("crecaudaciondetalle", det.crecaudaciondetalle)
                    , new SqlParameter("ccomprobante", ccomprobante));
            }
        }

        private static string SQL_COBRO = "update ttesrecaudacion set cestado = @cestado, cusuarioaplica = @cusuarioaplica, faplica = @faplica where crecaudacion = @crecaudacion";
        public static void ActualizarCobrosPagado(ttesrecaudacion cabecera, List<ttesrecaudaciondetalle> detalle, RequestModulo requestmodulo)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();

            contexto.Database.ExecuteSqlCommand(SQL_COBRO
                    , new SqlParameter("cestado", "3")
                    , new SqlParameter("cusuarioaplica", requestmodulo.Cusuario)
                    , new SqlParameter("faplica", DateTime.Now)
                    , new SqlParameter("crecaudacion", cabecera.crecaudacion));
        }

        private static string SQL_COBRODETALLE = "update ttesrecaudaciondetalle set cestado = @cestado where crecaudaciondetalle = @crecaudaciondetalle";
        public static void ActualizarCobrosPagadoDetalle(string cestado, long crecaudaciondetalle)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();

            contexto.Database.ExecuteSqlCommand(SQL_COBRODETALLE
                    , new SqlParameter("cestado", cestado)
                    , new SqlParameter("crecaudaciondetalle", crecaudaciondetalle));
        }
    }
}
