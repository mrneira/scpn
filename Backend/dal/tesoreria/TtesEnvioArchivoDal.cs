using modelo;
using modelo.helper;
using System.Collections.Generic;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.tesoreria
{
    /// <summary>
    /// Dal de manejo de envío de archivo y referencias
    /// </summary>
    /// <param name="numeroReferencia"></param>
    /// <param name="tipoTransaccion"></param>
    public class TtesEnvioArchivoDal
    {
        public static ttesenvioarchivo FindByNumeroReferencia(long? numeroReferencia, string tipoTransaccion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            ttesenvioarchivo obj;
            //obj = contexto.ttesenvioarchivo.Where(x => x.numeroreferencia ==numeroReferencia && x.tipotransaccion==tipoTransaccion).SingleOrDefault();
            obj = contexto.ttesenvioarchivo.Where(x => x.numeroreferencia == numeroReferencia && x.tipotransaccion == tipoTransaccion).OrderByDescending(x => x.fingreso).FirstOrDefault(); //NCH 20210921
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            if (obj == null)
            {
                throw new AtlasException("BCE-002", "NO SE ENCUENTRA INFORMACIÓN SOLICITADA");
            }
            return obj;
        }

        // <summary>
        /// Entrega un lista de cabecera de pagos
        /// </summary>
        public static List<ttesenvioarchivo> Find(long? numeroReferencia, string tipoTransaccion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<ttesenvioarchivo> lista = new List<ttesenvioarchivo>();
            try
            {
                lista = contexto.ttesenvioarchivo.Where(x => x.numeroreferencia == numeroReferencia && x.tipotransaccion == tipoTransaccion).ToList();

            }
            catch (System.InvalidOperationException)
            {
                throw;
            }
            return lista;
        }

        public static ttesreferencia FindSecuenciaProxima(string codigoReferencia)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            ttesreferencia obj;
            obj = contexto.ttesreferencia.Where(x => x.codigoreferencia == codigoReferencia).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            if (obj == null)
            {
                throw new AtlasException("BCE-002", "NO SE ENCUENTRA INFORMACIÓN SOLICITADA");
            }
            return obj;
        }
    }
}

