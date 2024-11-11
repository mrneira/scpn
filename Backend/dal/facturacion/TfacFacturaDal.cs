using modelo;
using modelo.helper;
using modelo.servicios;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using util.servicios.ef;

namespace dal.facturacion
{

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla tconparametros.
    /// </summary>
    public class TfacFacturaDal
    {
       
        /// <summary>
        /// 
        /// </summary>
        /// <param name="cfactura"></param>
        /// <returns></returns>
        public static tfacfactura FindInDataBase(long? cfactura) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tfacfactura obj = null;
            obj = contexto.tfacfactura.Where(x => x.cfactura == cfactura).SingleOrDefault();

            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

        private static readonly String SQL_FACT_CONTABILIZAR = "select f.ccompania, f.csucursal, f.cagencia, f.cmoduloorg, f.ctransaccionorg, f.ffactura, count(*) as cantidad "
            + " from tfacfactura f where f.ffactura = @fcontable and f.estadocdet = 'EMI' and (f.contabilizado is null or f.contabilizado = 0) "
            + " group by f.ccompania, f.csucursal, f.cagencia, f.cmoduloorg, f.ctransaccionorg, f.ffactura ";

        /// <summary>
        /// Entrega datos de facturas a contabilizar para una fecha contable.
        /// </summary>
        /// <param name="fcontable">Fecha a conultar datos de facturas a contabilizar.</param>
        /// <returns></returns>
        public static IList<Dictionary<string, object>> GetFacturasContabilizar(int fcontable) {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@fcontable"] = fcontable;
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, SQL_FACT_CONTABILIZAR);
            IList<Dictionary<string, object>> ldatos = ch.GetRegistrosDictionary();
            return ldatos;
        }

        private static readonly String SQL_FACTDET_CONTABILIZAR = "select fd.cproducto, fd.cimpuestoiva, fd.cimpuestoice, fd.cimpuestoirbpnr, "
            + " sum(fd.subtotal - fd.descuento) as subtotal, sum(fd.iva) as iva, sum(fd.ice) as ice, sum(fd.irbpnr) as irbpnr "
            +" from tfacfactura f, tfacfacturadetalle fd "
            +" where f.cfactura = fd.cfactura "
            + " and f.ffactura = @fcontable and f.estadocdet = 'EMI' and (f.contabilizado is null or f.contabilizado = 0) "
            + " and f.ccompania = @ccompania and f.csucursal = @csucursal and f.cagencia = @cagencia and f.cmoduloorg = @cmoduloorg and f.ctransaccionorg = @ctransaccionorg "
            + " and f.claveaccesosri IS NOT NULL "
            + " group by fd.cproducto, fd.cimpuestoiva, fd.cimpuestoice, fd.cimpuestoirbpnr ";

        /// <summary>
        /// Entrega datos de facturas a contabilizar para una fecha contable.
        /// </summary>
        /// <param name="fcontable">Fecha a conultar datos de facturas a contabilizar.</param>
        /// <returns></returns>
        public static IList<Dictionary<string, object>> GetFacturasDetContabilizar(int fcontable, int ccompania, int csucursal, int cagencia, int cmoduloorg, int ctransaccionorg) {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@fcontable"] = fcontable;
            parametros["@ccompania"] = ccompania;
            parametros["@csucursal"] = csucursal;
            parametros["@cagencia"] = cagencia;
            parametros["@cmoduloorg"] = cmoduloorg;
            parametros["@ctransaccionorg"] = ctransaccionorg;
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, SQL_FACTDET_CONTABILIZAR);
            IList<Dictionary<string, object>> ldatos = ch.GetRegistrosDictionary();
            return ldatos;
        }

        private static readonly String SQL_FACT_FPAGO = "select fp.cformapago, sum(fp.monto) as monto "
            + " from tfacfactura f, tfacfacturaformapago fp "
            + " where f.cfactura = fp.cfactura "
            + " and f.ffactura = @fcontable and f.estadocdet = 'EMI' and (f.contabilizado is null or f.contabilizado = 0) "
            + " and f.ccompania = @ccompania and f.csucursal = @csucursal and f.cagencia = @cagencia and f.cmoduloorg = @cmoduloorg and f.ctransaccionorg = @ctransaccionorg "
            + " group by fp.cformapago ";

        /// <summary>
        /// Entrega datos de formas de pago a contabilizar para una fecha contable.
        /// </summary>
        /// <param name="fcontable">Fecha a conultar datos de facturas a contabilizar.</param>
        /// <returns></returns>
        public static IList<Dictionary<string, object>> GetFacturasFormaPago(int fcontable, int ccompania, int csucursal, int cagencia, int cmoduloorg, int ctransaccionorg) {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@fcontable"] = fcontable;
            parametros["@ccompania"] = ccompania;
            parametros["@csucursal"] = csucursal;
            parametros["@cagencia"] = cagencia;
            parametros["@cmoduloorg"] = cmoduloorg;
            parametros["@ctransaccionorg"] = ctransaccionorg;
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, SQL_FACT_FPAGO);
            IList<Dictionary<string, object>> ldatos = ch.GetRegistrosDictionary();
            return ldatos;
        }

        private static String UPD_CONTABILIZADO = "update tfacfactura set contabilizado = @contabilizado where ffactura = @fcontable and estadocdet = 'EMI' ";

        /// <summary>
        /// Marca como contabilizado las facturas emitidas en una fecha.
        /// </summary>
        /// <param name="fcontable"></param>
        public static void MarcarContabilizados(int fcontable) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(UPD_CONTABILIZADO,
                new SqlParameter("@contabilizado", 1),
                new SqlParameter("@fcontable", fcontable));
        }

    }
}
