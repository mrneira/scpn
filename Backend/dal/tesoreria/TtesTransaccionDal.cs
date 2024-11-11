using modelo;
using modelo.helper;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.enums;
using util.servicios.ef;

namespace dal.tesoreria {
    /// <summary>
    /// Dal para menejo de transacciones de spi y ocp
    /// </summary>
    /// <param name="ltransaccion"></param>
    public class TtesTransaccionDal {
        public static List<ttestransaccion> FindToRespuestaPendienteBce(string cestado, string tipoTransaccion)
        {
            List<ttestransaccion> obj = new List<ttestransaccion>();
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.ttestransaccion.AsNoTracking().Where(x => x.cestado == cestado && x.verreg == 0 && x.tipotransaccion == tipoTransaccion).ToList();

            EntityHelper.SetActualizar(obj.ToList<IBean>());

            return obj;
        }

        public static List<ttestransaccion> AnularPagoLotePorReferencia(long numeroReferencia, string tipoTransaccion)
        {
            List<ttestransaccion> obj = new List<ttestransaccion>();
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.ttestransaccion.AsNoTracking().Where(x => x.numeroreferencia == numeroReferencia && x.verreg == 0 && x.cestado != ((int)EnumEstadoPagoBce.EstadoPagoBce.Pagado).ToString() && x.tipotransaccion == tipoTransaccion).ToList();

            EntityHelper.SetActualizar(obj.ToList<IBean>());
            return obj;
        }

        public static ttesenvioarchivo AnularCabeceraPagoLotePorReferencia(long numeroReferencia, string tipoTransaccion)
        {
            ttesenvioarchivo obj = new ttesenvioarchivo();
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.ttesenvioarchivo.AsNoTracking().Where(x => x.numeroreferencia == numeroReferencia && x.tipotransaccion == tipoTransaccion).SingleOrDefault();
            EntityHelper.SetActualizar(obj);
            return obj;
        }

        public static ttestransaccion FindSpiPorReferenciaPago(long numeroReferencia, long numeroReferenciaPago)
        {
            ttestransaccion obj = new ttestransaccion();
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.ttestransaccion.Where(x => x.numeroreferencia.Value == numeroReferencia && x.numeroreferenciapago.Value == numeroReferenciaPago && x.verreg == 0).Single();
            return obj;
        }

        public static ttestransaccion FindSpiPorCodigo(long cspitransaccion)
        {
            ttestransaccion obj = new ttestransaccion();
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.ttestransaccion.Where(x => x.ctestransaccion == cspitransaccion && x.verreg == 0).Single();
            EntityHelper.SetActualizar(obj);
            return obj;
        }

        public static List<ttestransaccion> FindSpiPorCodigoAll(long cspitransaccion)
        {
            List<ttestransaccion> obj = new List<ttestransaccion>();
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.ttestransaccion.Where(x => x.ctestransaccion == cspitransaccion).ToList();
            return obj;
        }

        public static ttestransaccion FindToReferenciaAnular(string referenciaInterna, int? secuenciaInterna, string estado, string tipotransaccion)
        {
            // Estados de operaciones no anuladas y procesadas
            List<string> lestados = new List<string> { "3", "4" };

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            ttestransaccion obj = null;
            obj = contexto.ttestransaccion.AsNoTracking().Where(x => x.referenciainterna == referenciaInterna
                                                                   && !lestados.Contains(x.cestado)
                                                                   && x.verreg == 0
                                                                   && x.secuenciainterna == secuenciaInterna
                                                                   && x.tipotransaccion == tipotransaccion).SingleOrDefault();

            if (obj == null) {
                throw new AtlasException("BCE-007", "NO EXISTE REGISTRO DE SPI A ELIMINAR CON REFERENCIA {0}, SECUENCIA {1}", referenciaInterna, secuenciaInterna);
            }

            if (obj.cestado == ((int)EnumEstadoPagoBce.EstadoPagoBce.Generado).ToString()) {
                throw new AtlasException("BCE-009", "NO SE PUEDE ELIMINAR EL PAGO, SE ENCUENTRA EN ESTADO {0}", EnumEstadoPagoBce.EstadoPagoBce.Generado.ToString().ToUpper());
            }

            if (obj.cestado == ((int)EnumEstadoPagoBce.EstadoPagoBce.Pagado).ToString()) {
                throw new AtlasException("BCE-009", "NO SE PUEDE ELIMINAR EL PAGO, SE ENCUENTRA EN ESTADO {0}", EnumEstadoPagoBce.EstadoPagoBce.Pagado.ToString().ToUpper());
            }

            if (obj.cestado == ((int)EnumEstadoPagoBce.EstadoPagoBce.Anulado).ToString()) {
                throw new AtlasException("BCE-009", "NO SE PUEDE ELIMINAR EL PAGO, SE ENCUENTRA EN ESTADO {0}", EnumEstadoPagoBce.EstadoPagoBce.Anulado.ToString().ToUpper());
            }
            EntityHelper.SetActualizar(obj);
            obj.referenciainterna = obj.referenciainterna + "-ANULADO";
            obj.cestado = estado;
            Sessionef.Actualizar(obj);
            return obj;
        }

        private static string SQL_AUTORIZA = "update ttestransaccion set cestado = @cestado where fcontable = @fcontable and tipotransaccion = 'C' ";

        public static void AutorizarCobros(string cestado, int fcontable)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(SQL_AUTORIZA
                , new SqlParameter("cestado", cestado)
                , new SqlParameter("fcontable", fcontable));
        }

        private static string SQL_ACTUALIZA_TRANSACCIONES = "update ttestransaccion set cestado = @cestado, subcuenta=@subcuenta, numeroreferencia=@numeroreferencia," +
                            "numeroreferenciapago=@numeroreferenciapago, fmodificacion=@fmodificacion,  cusuariomod=@cusuariomod WHERE ctestransaccion=@ctestransaccion";

        public static void ActualizaGenerarTransaccion(List<ttestransaccion> ltransaccion, RqMantenimiento rm)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            foreach (ttestransaccion tran in ltransaccion) {
                contexto.Database.ExecuteSqlCommand(SQL_ACTUALIZA_TRANSACCIONES
                , new SqlParameter("cestado", tran.cestado)
                , new SqlParameter("subcuenta", tran.subcuenta)
                , new SqlParameter("numeroreferencia", tran.numeroreferencia)
                , new SqlParameter("numeroreferenciapago", tran.numeroreferenciapago)
                , new SqlParameter("fmodificacion", rm.Freal)
                , new SqlParameter("cusuariomod", rm.Cusuario)
                , new SqlParameter("ctestransaccion", tran.ctestransaccion));
            }
        }

        private static string SQL_INSERT_ARCHIVO = "INSERT ttesenvioarchivo VALUES (@ctesenvioarchivo, @numeroreferencia, NULL, @cestado, @cantidadpago, @valorpago," +
                        "@mespago, 1, @sumcontrol, @cempresa, @localidad, @cuentaorigen, @razonsocial, NULL, NULL, 0, 'C', @cusuarioing, @fingreso, NULL)";

        private static string SQL_CONSULTA_ID = "SELECT max(ctesenvioarchivo) as secuencia FROM ttesenvioarchivo";


        public static void ActualizaGenerarArchivo(ttesenvioarchivo envioarchivo, RqMantenimiento rm)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            long ctesenvioarchivo = contexto.Database.SqlQuery<long>(SQL_CONSULTA_ID).FirstOrDefault() + 1;
            contexto.Database.ExecuteSqlCommand(SQL_INSERT_ARCHIVO
                , new SqlParameter("ctesenvioarchivo", ctesenvioarchivo)
                , new SqlParameter("cestado", envioarchivo.estado)
                , new SqlParameter("cantidadpago", envioarchivo.cantidadpago)
                , new SqlParameter("valorpago", envioarchivo.valorpago)
                , new SqlParameter("mespago", envioarchivo.mespago)
                , new SqlParameter("sumcontrol", envioarchivo.sumcontrol)
                , new SqlParameter("cempresa", envioarchivo.cempresa)
                , new SqlParameter("localidad", envioarchivo.localidad)
                , new SqlParameter("cuentaorigen", envioarchivo.cuentaorigen)
                , new SqlParameter("razonsocial", envioarchivo.razonsocial)
                , new SqlParameter("numeroreferencia", envioarchivo.numeroreferencia)
                , new SqlParameter("cusuarioing", rm.Cusuario)
                , new SqlParameter("fingreso", rm.Freal)
                );
        }

        private static string SQL_ACTUALIZA_COBROS = "update ttestransaccion set cestado = @cestado, codrespuestabce = @codrespuestabce, frespuesta = @frespuesta, " +
            "vrespuesta = @vrespuesta, cusuariomod = @cusuariomod, fmodificacion = @fmodificacion, referenciabce = @referenciabce" +
            " where numeroreferencia=@numeroreferencia and numeroreferenciapago=@numeroreferenciapago AND verreg=0";

        public static void ActualizarCobrosTransaccion(List<ttestransaccion> ltransaccion, RqMantenimiento rm)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            foreach (ttestransaccion tran in ltransaccion) {
                contexto.Database.ExecuteSqlCommand(SQL_ACTUALIZA_COBROS
                , new SqlParameter("cestado", tran.cestado)
                , new SqlParameter("codrespuestabce", tran.codrespuestabce)
                , new SqlParameter("frespuesta", tran.frespuesta)
                , new SqlParameter("vrespuesta", tran.vrespuesta)
                , new SqlParameter("cusuariomod", tran.cusuariomod)
                , new SqlParameter("fmodificacion", tran.fmodificacion)
                , new SqlParameter("referenciabce", tran.referenciabce)
                , new SqlParameter("numeroreferencia", tran.numeroreferencia)
                , new SqlParameter("numeroreferenciapago", tran.numeroreferenciapago));
            }
        }

        private static string SQL_CONSULTA_ID_TRANSACCION = "SELECT max(ctestransaccion) as secuencia FROM ttestransaccion";
        private static string SQL_INSERTAR_COBRO_MASIVO = "INSERT INTO ttestransaccion VALUES(@ctestransaccion, 0, 0, NULL, @cmodulo, @ctransaccion, @mensaje," +
                    "NULL, NULL, @identificacionbeneficiario, @nombrebeneficiario, @numerocuentabeneficiario, @codigobeneficiario, @tipocuentacdetalle, @tipocuentaccatalogo, @institucioncdetalle, " +
                    "@institucionccatalogo, @valorpago, @detalle, @cestado, @referenciainterna, NULL, @secuenciainterna, NULL, NULL, NULL, NULL," +
                    "NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, 'C', @cusuarioing, @fingreso, NULL, NULL, @fcontable, 0, NULL, NULL)";

        public static void InsertarCobro(ttestransaccion tra)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            long ctestransaccion = contexto.Database.SqlQuery<long>(SQL_CONSULTA_ID_TRANSACCION).FirstOrDefault() + 1;
            contexto.Database.ExecuteSqlCommand(SQL_INSERTAR_COBRO_MASIVO
                , new SqlParameter("@ctestransaccion", ctestransaccion)
                , new SqlParameter("cmodulo", tra.cmodulo)
                , new SqlParameter("ctransaccion", tra.ctransaccion)
                , new SqlParameter("identificacionbeneficiario", tra.identificacionbeneficiario)
                , new SqlParameter("nombrebeneficiario", tra.nombrebeneficiario)
                , new SqlParameter("numerocuentabeneficiario", tra.numerocuentabeneficiario)
                , new SqlParameter("codigobeneficiario", tra.codigobeneficiario)
                , new SqlParameter("tipocuentacdetalle", tra.tipocuentacdetalle)
                , new SqlParameter("tipocuentaccatalogo", tra.tipocuentaccatalogo)
                , new SqlParameter("institucioncdetalle", tra.institucioncdetalle)
                , new SqlParameter("institucionccatalogo", tra.institucionccatalogo)
                , new SqlParameter("valorpago", tra.valorpago)
                , new SqlParameter("detalle", tra.detalle)
                , new SqlParameter("cestado", tra.cestado)
                , new SqlParameter("referenciainterna", tra.referenciainterna)
                , new SqlParameter("secuenciainterna", tra.secuenciainterna)
                , new SqlParameter("cusuarioing", tra.cusuarioing)
                , new SqlParameter("fingreso", tra.fingreso)
                , new SqlParameter("fcontable", tra.fcontable)
                , new SqlParameter("mensaje", tra.mensaje)
                );
        }

        /// <summary>
        /// Secuencia de tabla de transacciones.
        /// </summary>
        /// <returns>long</returns>
        public static long GetSecuencia()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            long secuencia = contexto.ttestransaccion.Select(x => x.ctestransaccion).DefaultIfEmpty(0).Max();
            return secuencia;
        }
    }
}

