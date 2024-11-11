using modelo;
using modelo.helper;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.tesoreria
{
    /// <summary>
    /// Manejo de secuencia para referencia
    /// </summary>
    /// <param name="creferencia"></param>
    public class TtesSecuenciaReferenciaDal
    {

        public static long ObtenerSecuenciaReferencia(string creferencia)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            ttesreferencia obj;
            obj = contexto.ttesreferencia.Where(x => x.codigoreferencia.Equals(creferencia)).SingleOrDefault();

            if (obj == null)
            {
                throw new AtlasException("BCE-001", "NO SE ENCUENTRA PARAMETRIZADO CÓIGO REFERENCIA PARA EL IDENTIFICADOR ENVIADO");
            }

            int secuenciaactual = (int)obj.secuencial;
            obj.secuencial++;
            EntityHelper.SetActualizar(obj);
            Sessionef.Actualizar(obj);

            return secuenciaactual;
        }
    }
}

