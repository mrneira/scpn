using dal.contabilidad;
using util.dto.mantenimiento;

namespace core.servicios {

    public class SecuenciaComprobanteContable {

        /// <summary>
        /// Metodo que genera una secuencia de comprobante contable dado un codigo
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public static string GetProximoValor(RqMantenimiento rqmantenimiento, string nsecuencia)
        {
            int fcontable = (int)rqmantenimiento.Fconatable;
            string secuencia = TconSecuenciaComprobanteDal.ObtenerSecuenciaComprobante(nsecuencia,fcontable);
            return secuencia;
        }
    }
}