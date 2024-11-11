using modelo;
using modelo.helper;
using System;
using System.Data.SqlClient;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.generales {
    public class TgenCargaControlDal {

        /// <summary>
        /// Busca en la base y entrega un registro de TgenCargaControlDto.
        /// </summary>
        /// <param name="fproceso">Fecha en la que se carga el archivo.</param>
        /// <param name="ctipoarchivo">Codigo de tipo de archivo.</param>
        /// <param name="numeroejecucion">Numero de ejecucion para la fecha y tipo de archivo.</param>
        /// <returns></returns>
        public static tgencargacontrol Find(int fproceso, int cmodulo, int ctipoarchivo, int numeroejecucion, int idproceso) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tgencargacontrol control = null;

            control = contexto.tgencargacontrol.AsNoTracking().Where(x => x.ctipoarchivo == ctipoarchivo
                                                                       && x.cmodulo == cmodulo
                                                                       && x.numeroejecucion == numeroejecucion
                                                                       && x.idproceso == idproceso).SingleOrDefault();
            if (control == null) {
                return null;
            }
            EntityHelper.SetActualizar(control);
            return control;
        }

        /// <summary>
        /// Valida que  no exista en ejecucion la carga de un archivo, para la fecha y numero de ejecucion.
        /// </summary>
        /// <param name="fproceso">Fecha en la que se carga el archivo.</param>
        /// <param name="ctipoarchivo">Codigo de tipo de archivo.</param>
        public static tgencargacontrol ValidaenEjecucion(int fproceso, int cmodulo, int ctipoarchivo, string nombreArchivo) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tgencargacontrol control = null;

            control = contexto.tgencargacontrol.AsNoTracking().Where(x => x.nombre == nombreArchivo
                                                                       && x.cmodulo == cmodulo
                                                                       && x.ctipoarchivo == ctipoarchivo).SingleOrDefault();
            return control;
        }

        private static string HQL_NUM_EJECUCION = "select coalesce(max(numeroejecucion),0) + 1 as numeroejecucion from TgenCargaControl t where t.fproceso = @fproceso and t.cmodulo = @cmodulo and t.ctipoarchivo = @ctipoarchivo and t.nombre=@nombrearchivo ";
        /// <summary>
        /// Entrega el numero de ejecucion de la carga de archivos para la fecha de proceso.
        /// </summary>
        /// <param name="fproceso">Fecha de proceso en la que se ejecuta la carga de archivos.</param>
        /// <param name="ctipoarchivo">Codigo de tipo de archvio.</param>
        /// <returns></returns>
        public static int GetNumeroEjecucion(int fproceso, int cmodulo,int ctipoarchivo, string nombreArchivo) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            int sec = contexto.Database.SqlQuery<int>(HQL_NUM_EJECUCION, new SqlParameter("@fproceso", fproceso),
                                                                         new SqlParameter("@cmodulo", cmodulo),
                                                                         new SqlParameter("@ctipoarchivo", ctipoarchivo),
                                                                         new SqlParameter("@nombrearchivo", nombreArchivo)
                                                                         ).SingleOrDefault();
            return sec;
        }

        /// <summary>
        /// Crea una instancia de TgenCargaControl para el control de ejecucion de carga de archvios. Solo se permite una carga de archivos a la vez.
        /// </summary>
        /// <param name="fproceso">Fecha de proceso en la que se ejecuta la carga de archivos.</param>
        /// <param name="ctipoarchivo">Codigo de tipo de archvio.</param>
        /// <param name="numeroejecucion">Numero de ejecucion para la fecha y tipo de archvio.</param>
        public static tgencargacontrol Crear(int fproceso, int cmodulo,int ctipoarchivo, int numeroejecucion, string archivo) {
            tgencargacontrol obj = new tgencargacontrol();
            AtlasContexto contexto = new AtlasContexto();
            using (var contextoDB = contexto.Database.BeginTransaction()) {
                try {
                    obj.idproceso = (int)TgenSecuenciaDal.GetProximoValor(contexto, "ARCHIVO");
                    contextoDB.Commit();
                } catch (Exception) {
                    contextoDB.Rollback();
                } finally {
                    contextoDB.Dispose();
                }
            }

            obj.nombre = archivo;
            obj.fproceso = fproceso;
            obj.cmodulo = cmodulo;
            obj.ctipoarchivo = ctipoarchivo;
            obj.numeroejecucion = numeroejecucion;
            obj.cestado = "P";
            return obj;
        }

    }

}
