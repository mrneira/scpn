using modelo;
using modelo.helper;
using System.Collections.Generic;
using System.Linq;
using util.servicios.ef;

namespace dal.persona
{
    public class TperReferenciaBancariaDal
    {
        public static tperreferenciabancaria Find(long cpersona, int ccompania)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tperreferenciabancaria obj = null;
            obj = contexto.tperreferenciabancaria.AsNoTracking().Where(x => x.cpersona == cpersona && x.cuentaprincipal == true && x.ccompania == ccompania && x.verreg == 0).SingleOrDefault();
            if (obj == null)
            {
                return null;
            }
            EntityHelper.SetActualizar(obj);
            return obj;
        }

        public static tperreferenciabancaria FindReferencia(long cpersona, int ccompania)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tperreferenciabancaria obj = null;
            obj = contexto.tperreferenciabancaria.AsNoTracking().Where(x => x.cpersona == cpersona && x.ccompania == ccompania && x.verreg == 0 && x.cuentaprincipal==true).SingleOrDefault();
            return obj;
        }
        public static int FindSecuencia(long cpersona, int ccompania)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tperreferenciabancaria> obj = null;
            obj = contexto.tperreferenciabancaria.AsNoTracking().Where(x => x.cpersona == cpersona && x.ccompania == ccompania && x.verreg == 0).ToList();
            if (obj == null || obj.Count == 0)
            {
                return 1;
            }
            else
            {
                int secuenciamaxima = 0;
                secuenciamaxima = obj.Max(x => x.secuencia);
                secuenciamaxima = secuenciamaxima+1;
                return secuenciamaxima;
            }

        }
    }
}
