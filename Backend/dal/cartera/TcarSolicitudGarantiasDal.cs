using dal.seguros;
using modelo;
using System.Collections.Generic;
using System.Linq;
using util.servicios.ef;

namespace dal.cartera {
    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla tcarsolicitudgarantias.
    /// </summary>
    public class TcarSolicitudGarantiasDal {

        /// <summary>
        /// Consulta la solicitud asociada a la garantia.
        /// </summary>
        /// <param name="coperaciongarantia">Numero de operacion.</param>
        /// <returns>List tcarsolicitudgarantias</returns>
        public static tcarsolicitud FindSolicitud(string coperaciongarantia)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcarsolicitudgarantias solgar = contexto.tcarsolicitudgarantias.AsNoTracking().Where(x => x.coperaciongarantia == coperaciongarantia).FirstOrDefault();
            if (solgar!=null) {
                tcarsolicitud carsol = TcarSolicitudDal.Find(solgar.csolicitud);
                return carsol;
            }
            return null;
        }

        public static List<tcarsolicitudgarantias> FindSolicitudGarantias(long csolicitud) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tcarsolicitudgarantias> lsolgar = contexto.tcarsolicitudgarantias.AsNoTracking().Where(x => x.csolicitud == csolicitud).ToList();
            return lsolgar;
        }

        /// <summary>
        /// Metodo que transforma los datos de personas asociados a una solicitud de credito, a una lista de personas asociadas a una operacion de cartera.
        /// </summary>
        /// <param name="ltcarsolicitudgar">Lista de personas asociadas a la solicitud.</param>
        /// <param name="coperacion">Numero de operacion de cartera.</param>
        /// <returns></returns>
        public static List<tcaroperaciongarantias> ToTcarOperacionGarantias(List<tcarsolicitudgarantias> ltcarsolicitudgar, string coperacioncartera) {
            List<tcaroperaciongarantias> lgarantiascartera = new List<tcaroperaciongarantias>();
            foreach (tcarsolicitudgarantias solgar in ltcarsolicitudgar) {
                tcaroperaciongarantias t = new tcaroperaciongarantias();
                t.coperacion = coperacioncartera;
                t.coperaciongarantia = solgar.coperaciongarantia;

                lgarantiascartera.Add(t);
            }
            return lgarantiascartera;
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de una solicitud de credito.
        /// </summary>
        /// <param name="csolicitud">Numero de solicitud.</param>
        /// <returns>TcarSolicitudGarantia</returns>
        public static tcarsolicitudgarantias Find(string coperaciongarantia)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcarsolicitudgarantias.AsNoTracking().Where(x => x.coperaciongarantia == coperaciongarantia).Single();
        }

    }
}
