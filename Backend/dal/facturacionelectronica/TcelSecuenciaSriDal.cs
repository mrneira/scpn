using modelo;
using modelo.helper;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.facturacionelectronica {

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla tconparametros.
    /// </summary>
    public class TcelSecuenciaSriDal
    {
        /// <summary>
        /// Entrega una lista de tconparametros 
        /// </summary>
        /// <param name="ccompania">Codigo de compania.</param>
        /// <param name="codigo">código del parámetro</param>
        /// <returns>List<TconParametros></returns>
        public static tcelsecuenciasri FindXSecuencia(string secuencia) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcelsecuenciasri obj;
            obj = contexto.tcelsecuenciasri.Where(x => x.csecuenciasri.Equals(secuencia)).SingleOrDefault();
            if (obj != null) {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }


        public static string ObtenerSecuenciaDocumentoElectronico(string csecuenciasri)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcelsecuenciasri obj;
            obj = contexto.tcelsecuenciasri.Where(x => x.csecuenciasri.Equals(csecuenciasri)).SingleOrDefault();
            
            if (obj == null)
            {
                throw new AtlasException("CEL-005", "NO SE ENCUENTRA PARAMETRIZADO ESTABLECIMIENTO Y PUNTO DE EMISION PARA EL DOCUMENTO GENERADO");
            }

            int secuenciaactual = (int)obj.secuenciaactual;
            obj.secuenciaactual++;
            EntityHelper.SetActualizar(obj);
            Sessionef.Actualizar(obj);

            return obj.establecimiento.PadLeft(3, '0') + "-" +
                obj.puntodeemision.PadLeft(3, '0') + "-" +
                obj.secuenciaactual.ToString().PadLeft(9, '0');
        }
    }
}
