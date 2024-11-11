using modelo;
using modelo.helper;
using modelo.servicios;
using System.Collections.Generic;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.persona {
    /// <summary>
    /// Clase que implementa dml's manuales contra la base de datos.
    /// </summary>
    public class TperPersonaDetalleDal {

        /// <summary>
        /// Entrega datos vigentes de una persona.
        /// </summary>
        /// <param name="ccompania">Codigo de compania.</param>
        /// <returns></returns>
        public static List<tperpersonadetalle> Find(int ccompania) {
            List<tperpersonadetalle> obj = new List<tperpersonadetalle>();
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tperpersonadetalle.AsNoTracking().Where(x => x.ccompania == ccompania && x.verreg == 0).ToList();
            return obj;
        }

        /// <summary>
        /// Entrega datos vigentes de una persona.
        /// </summary>
        /// <param name="cpersona">Codigo de persona.</param>
        /// <param name="ccompania">Codigo de compania.</param>
        /// <returns></returns>
        public static tperpersonadetalle Find(long cpersona, int ccompania) {
            tperpersonadetalle obj = new tperpersonadetalle();
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try {
                obj = contexto.tperpersonadetalle.Where(x => x.cpersona == cpersona && x.ccompania == ccompania && x.verreg == 0).Single();
                EntityHelper.SetActualizar(obj);
            } catch (System.InvalidOperationException) {
                throw new AtlasException("BPER-001", "PERSONA NO DEFINIDA EN TPERPERSONDETAIL CPERSONA: {0} COMPANIA: {1}", cpersona, ccompania);
            }
            return obj;
        }

        /// <summary>
        /// Entrega el email de una persona.
        /// </summary>
        /// <param name="cpersona">Codigo de persona.</param>
        /// <param name="ccompania">Codigo de compania.</param>
        /// <returns></returns>
        public static string GetEmail(long cpersona, int ccompania) {
            tperpersonadetalle p = TperPersonaDetalleDal.Find(cpersona, ccompania);
            if (p.email == null) {
                throw new AtlasException("BPER-004", "EMAIL NO DEFINIDO EN PARA PERSONA: {0}", cpersona);
            }
            return p.email;
        }

        /// <summary>
        /// BUsca y entrega datos de una persona dada la identificacion.
        /// </summary>
        /// <param name="identificacion"></param>
        /// <returns>TperPersonaDetalleDto</returns>
        public static tperpersonadetalle Find(string identificacion) {
            tperpersonadetalle obj = new tperpersonadetalle();
            AtlasContexto contexto = Sessionef.GetAtlasContexto();

            obj = contexto.tperpersonadetalle.AsNoTracking().Where(x => x.identificacion == identificacion && x.verreg == 0).SingleOrDefault();
            if (obj == null) {
                return null;
            }
            EntityHelper.SetActualizar(obj);
            return obj;
        }

        /// <summary>
        /// BUsca y entrega datos de una persona dada la identificacion.compania y socio
        /// </summary>
        /// <param name="identificacion"></param>
        /// <returns>TperPersonaDetalle</returns>
        public static tperpersonadetalle FindXIdentificacionCompania(string identificacion, int ccompania) {
            tperpersonadetalle obj = new tperpersonadetalle();
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tperpersonadetalle.Where(x => x.identificacion == identificacion && x.ccompania == ccompania && x.verreg == 0).SingleOrDefault();
            if (obj == null) {
                return null;
            }
            EntityHelper.SetActualizar(obj);
            return obj;
        }

        /// <summary>
        /// BUsca y entrega datos de una persona dada la identificacion.
        /// </summary>
        /// <param name="identificacion"></param>
        /// <returns>TperPersonaDetalleDto</returns>
        public static tperpersonadetalle FindByIdentification(string identificacion) {
            tperpersonadetalle obj = new tperpersonadetalle();
            AtlasContexto contexto = Sessionef.GetAtlasContexto();

            obj = contexto.tperpersonadetalle.AsNoTracking().Where(x => x.identificacion == identificacion && x.verreg == 0).SingleOrDefault();
            if (obj == null) {
                return null;
            }
            return obj;
        }

        public static bool ExisteCelular(string identificacion, string celular) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tperpersonadetalle obj = contexto.tperpersonadetalle.AsNoTracking().Where(x => x.identificacion != identificacion && x.celular == celular && x.verreg == 0).SingleOrDefault();

            if (obj == null) {
                return false;
            } else {
                return true;
            }
        }

        public static bool ExisteEmail(string identificacion, string email) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tperpersonadetalle obj = contexto.tperpersonadetalle.AsNoTracking().Where(x => x.identificacion != identificacion && x.email == email && x.verreg == 0).SingleOrDefault();

            if (obj == null) {
                return false;
            } else {
                return true;
            }
        }

        /// <summary>
        /// Entrega el maximo codigo de persona.
        /// </summary>
        /// <returns>long</returns>
        public static long FindMax() {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            long max = 0;
            try {
                max = contexto.tperpersonadetalle.Where(x => x.verreg == 0).Max(x => x.cpersona);
            } catch (System.InvalidOperationException) {
                max = 0;
            }
            return max;
        }



        private static string SQL = "SELECT pd.identificacion, pd.nombre, convert(VARCHAR(10),pn.fnacimiento,103) as fnacimiento," +
                        "(SELECT texto FROM todcparametros WHERE codigo = 'pob.ced') as codigo" +
                        " FROM tperpersonadetalle pd, tpernatural pn " +
                        " WHERE pd.cpersona = pn.cpersona " +
                        " AND pd.identificacion = @identificacion";
        /// <summary>
        /// obtiene informacion para el reporte poblar cedulas
        /// </summary>
        /// <param name="identificacion"></param>
        /// <returns></returns>
        public static IList<Dictionary<string, object>> FindPoblarCedulas(string identificacion) {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@identificacion"] = identificacion;
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, SQL);
            IList<Dictionary<string, object>> datos = ch.GetRegistrosDictionary();
            return datos;
        }

    }
}
