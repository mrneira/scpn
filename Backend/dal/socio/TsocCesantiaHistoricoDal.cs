using modelo;
using modelo.helper;
using modelo.servicios;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.servicios.ef;

namespace dal.socio {
    /// <summary>
    /// Clase que implemeta, dml's de la tabla historico cesantia
    /// </summary>
    public class TsocCesantiaHistoricoDal {
        /// <summary>
        /// Obtiene el ultimo historico del socio
        /// </summary>
        /// <param name="cpersona"></param>
        /// <param name="ccompania"></param>
        /// <param name="secuencia"></param>
        /// <returns></returns>
        public static tsoccesantiahistorico Find(long cpersona, int ccompania, int? secuencia = null) {

            tsoccesantiahistorico obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            long? secuenciamax = GetMaxSecuencia(cpersona, ccompania);
            if (secuencia != null) {
                obj = contexto.tsoccesantiahistorico.AsNoTracking().Where(x => x.ccompania == ccompania && x.cpersona == cpersona && x.secuencia == secuencia && x.verreg == 0).SingleOrDefault();
            } else {
                obj = contexto.tsoccesantiahistorico.AsNoTracking().Where(x => x.ccompania == ccompania && x.cpersona == cpersona && x.secuencia == (int)secuenciamax && x.verreg == 0).SingleOrDefault();
            }


            if (obj == null) {
                throw new AtlasException("BPER-001", "PERSONA NO DEFINIDA EN TSOCCESANTIA HISTORICO CPERSONA {0}", cpersona);
            } else {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

        public static List<tsoccesantiahistorico> FindList(long cpersona,int ccompania) {
            List<tsoccesantiahistorico> obj = new List<tsoccesantiahistorico>();
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tsoccesantiahistorico.AsNoTracking().Where(x => x.cpersona == cpersona && x.ccompania == ccompania && x.verreg == 0).ToList();
            return obj;
        }

        public static List<tsoccesantiahistorico> Find(int ccompania) {
            List<tsoccesantiahistorico> obj = new List<tsoccesantiahistorico>();
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tsoccesantiahistorico.AsNoTracking().Where(x => x.ccompania == ccompania && x.verreg == 0).ToList();
            return obj;
        }

        /// <summary>
        /// Obtiene el historico del socio depende de su secuencia
        /// </summary>
        /// <param name="cpersona"></param>
        /// <param name="ccompania"></param>
        /// <param name="secuencia"></param>
        /// <returns></returns>
        public static tsoccesantiahistorico FindToConsulta(long cpersona, int ccompania, int? secuencia = null) {

            tsoccesantiahistorico obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            long? secuenciamax = GetMaxSecuencia(cpersona, ccompania);
            if (secuencia != null) {
                obj = contexto.tsoccesantiahistorico.AsNoTracking().Where(x => x.ccompania == ccompania && x.cpersona == cpersona && x.secuencia == secuencia && x.verreg == 0).SingleOrDefault();
            } else {
                obj = contexto.tsoccesantiahistorico.AsNoTracking().Where(x => x.ccompania == ccompania && x.cpersona == cpersona && x.secuencia == (int)secuenciamax && x.verreg == 0).SingleOrDefault();
            }
            return obj;
        }

        /// <summary>
        /// Obtiene los historicos dependiendo de los aportes del socio
        /// </summary>
        /// <param name="cpersona"></param>
        /// <param name="ccompania"></param>
        /// <returns></returns>
        public static tsoccesantiahistorico FindToAportes(long cpersona, int ccompania) {

            tsoccesantiahistorico obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            long? max = GetMaxSecuencia(cpersona, ccompania);
            obj = contexto.tsoccesantiahistorico.AsNoTracking().Where(x => x.ccompania == ccompania && x.cpersona == cpersona && x.secuencia == max && x.verreg == 0).SingleOrDefault();
            return obj;
        }

        /// <summary>
        /// Obtiene el grado actual de un socio
        /// </summary>
        /// <param name="cpersona"></param>
        /// <param name="ccompania"></param>
        /// <returns></returns>
        public static int? FindByActual(long cpersona, int ccompania) {
            tsoccesantiahistorico obj = Find(cpersona, ccompania);
            if (obj == null) {
                return null;
            }
            return (int)obj.cgradoactual;
        }

        /// <summary>
        /// Obtiene el grado proximo del socio
        /// </summary>
        /// <param name="cpersona"></param>
        /// <param name="ccompania"></param>
        /// <returns></returns>
        public static int? FindByProximo(long cpersona, int ccompania) {
            tsoccesantiahistorico obj = Find(cpersona, ccompania);
            if (obj == null) {
                return null;
            }
            return (int)obj.cgradoproximo;
        }

        /// <summary>
        /// Método que actualiza el historico por aportes del socio
        /// </summary>
        /// <param name="laportes"></param>
        /// <returns></returns>
        public static List<tsoccesantiahistorico> UpdateTsocCesantiaHis(List<tpreaporte> laportes) {
            List<tsoccesantiahistorico> lsociohis = new List<tsoccesantiahistorico>();
            if (laportes == null) {
                return lsociohis;
            }
            foreach (tpreaporte obj in laportes) {
                tsoccesantiahistorico soc = FindToAporte(obj.cpersona, obj.ccompania);
                soc.Actualizar = true;
                soc.cpersona = obj.cpersona;
                soc.ccompania = obj.ccompania;
                lsociohis.Add(soc);
            }
            return lsociohis;
        }

        /// <summary>
        /// Obtiene el historico del socio por aportes 
        /// </summary>
        /// <param name="cpersona"></param>
        /// <param name="ccompania"></param>
        /// <returns></returns>
        public static tsoccesantiahistorico FindToAporte(long cpersona, int ccompania) {

            tsoccesantiahistorico obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tsoccesantiahistorico.AsNoTracking().Where(x => x.ccompania == ccompania && x.cpersona == cpersona).SingleOrDefault();
            if (obj == null) {
                return null;
            } else {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

        /// <summary>
        /// Obtiene la secuencoa maxima del historioco valido del socio
        /// </summary>
        /// <param name="cpersona"></param>
        /// <param name="ccompania"></param>
        /// <returns></returns>
        public static long? GetMaxSecuencia(long cpersona, int ccompania) {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            long? max = 0;
            max = contexto.tsoccesantiahistorico.Where(p => p != null && p.cpersona == cpersona && p.ccompania == ccompania && p.verreg == 0 && p.activo == true)
           .Select(p => p.secuencia)
           .DefaultIfEmpty()
           .Max();
            return max;
        }
        /// <summary>
        /// Obtiene la secuencoa maxima del historioco del socio
        /// </summary>
        /// <param name="cpersona"></param>
        /// <param name="ccompania"></param>
        /// <returns></returns>
        public static long? GetMaxSecuenciaHistorico(long cpersona, int ccompania) {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            long? max = 0;
            max = contexto.tsoccesantiahistorico.Where(p => p != null && p.cpersona == cpersona && p.ccompania == ccompania && p.verreg == 0)
           .Select(p => p.secuencia)
           .DefaultIfEmpty()
           .Max();
            return max;
        }
        /// <summary>
        /// Obtiene la ultima secuencia del historico valido del socio
        /// </summary>
        /// <param name="cpersona"></param>
        /// <param name="ccompania"></param>
        /// <returns></returns>
        public static long? GetMaxSecuenciaActiva(long cpersona, int ccompania) {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            long? max = 0;
            max = contexto.tsoccesantiahistorico.Where(p => p != null && p.cpersona == cpersona && p.ccompania == ccompania && p.verreg == 0 && p.activo == true)
           .Select(p => p.secuencia)
           .DefaultIfEmpty()
           .Max();
            return max;
        }

        /// <summary>
        /// Obtiene la secuencia maxima del historico del socio por estado del socio
        /// </summary>
        /// <param name="cpersona"></param>
        /// <param name="ccompania"></param>
        /// <param name="cestadosocio"></param>
        /// <returns></returns>
        public static long? GetMaxSecuenciaToEstadosocio(long cpersona, int ccompania, int cestadosocio) {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            long? max = 0;
            max = contexto.tsoccesantiahistorico.Where(p => p != null && p.cpersona == cpersona && p.ccompania == ccompania && p.cestadosocio == cestadosocio && p.activo == true && p.verreg == 0)
           .Select(p => p.secuencia)
           .DefaultIfEmpty()
           .Max();
            return max;
        }

        /// <summary>
        /// Obtiene el ultimo historico activo del socio
        /// </summary>
        /// <param name="cpersona"></param>
        /// <param name="ccompania"></param>
        /// <param name="cestadosocio"></param>
        /// <returns></returns>
        public static tsoccesantiahistorico FindFordenToEstadoSocio(long cpersona, int ccompania, int cestadosocio) {
            tsoccesantiahistorico obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            long? max = GetMaxSecuenciaToEstadosocio(cpersona, ccompania, cestadosocio);
            obj = contexto.tsoccesantiahistorico.AsNoTracking().Where(x => x.ccompania == ccompania && x.cpersona == cpersona && x.cestadosocio == cestadosocio && x.secuencia == max && x.activo == true && x.verreg == 0).SingleOrDefault();
            if (obj == null) {
                return null;
            } else {
                return obj;
            }

        }

        /// <summary>
        /// Obtiene la secuencia máxima del historico menor a la fecha de estado 
        /// </summary>
        /// <param name="cpersona"></param>
        /// <param name="ccompania"></param>
        /// <param name="festado"></param>
        /// <returns></returns>

        public static long? GetMaxSecuenciaToFestado(long cpersona, int ccompania,DateTime? festado) {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            long? max = 0;
            max = contexto.tsoccesantiahistorico.Where(p => p != null && p.cpersona == cpersona && p.ccompania == ccompania && p.verreg == 0 && p.activo == true && p.festado < festado)
           .Select(p => p.secuencia)
           .DefaultIfEmpty()
           .Max();
            return max;
        }
        /// <summary>
        /// Obtiene la secuencia máxima activa excluyemdo una secuencia determinada
        /// </summary>
        /// <param name="cpersona"></param>
        /// <param name="ccompania"></param>
        /// <param name="secuencia"></param>
        /// <returns></returns>
        public static long? GetMaxSecuenciaToSecuencia(long cpersona, int ccompania, int secuencia) {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            long? max = 0;
            max = contexto.tsoccesantiahistorico.Where(p => p != null && p.cpersona == cpersona && p.ccompania == ccompania && p.secuencia != secuencia && p.verreg == 0 && p.activo == true)
           .Select(p => p.secuencia)
           .DefaultIfEmpty()
           .Max();
            return max;
        }

        /// <summary>
        /// Crea una instancia del historico del socio
        /// </summary>
        /// <returns></returns>
        public static tsoccesantiahistorico Crear() {
            tsoccesantiahistorico obj = new tsoccesantiahistorico();
            return obj;
        }
        private static string SQL_HISTORICO = "DELETE FROM tsoccesantiahistorico WHERE verreg<>0 and cpersona=@cpersona";
        /// <summary>
        /// Obtiene nobedades automaticas generadas desde el modulo de prestamos
        /// </summary>
        /// <param name="cpersona"></param>
        /// <param name="ccompania"></param>
        /// <returns></returns>
        public static decimal eliminarRegistrosvreg(long cpersona, int ccompania)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(
                SQL_HISTORICO,
                new SqlParameter("cpersona", cpersona));

            return 0;
        }
    }
}
