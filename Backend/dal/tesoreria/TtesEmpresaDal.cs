using modelo;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.tesoreria
{
    /// <summary>
    /// Dal para manejo de empresa
    /// </summary>
    /// <param name="cempresa"></param>
    public class TtesEmpresaDal
    {
        public static ttesempresa Find(int? cempresa)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            ttesempresa obj;
            obj = contexto.ttesempresa.Where(x => x.cempresa ==cempresa && x.verreg==0).SingleOrDefault();

            if (obj == null)
            {
                throw new AtlasException("BCE-002", "NO SE ENCUENTRA PARAMETRIZADO LA INFORMACIÓN EMPRESA");
            }
            return obj;
        }


    }
}

