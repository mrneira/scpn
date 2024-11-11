using modelo;
using System;
using System.Data.SqlClient;
using System.Linq;
using util.servicios.ef;

namespace dal.generales
{
    /// <summary>
    /// Clase que registra mensajes de error por registro asociado a un archivo.
    /// </summary>
    public class TgenCargaControlErroresDal {

        private static string HQL_CONTARFILAS = "select isnull(count(1),0) from TgenCargaControlErrores t where t.fproceso = @fproceso and t.ctipoarchivo = @ctipoarchivo and t.numeroejecucion = @numeroejecucion ";
        /// <summary>
        /// Metodo de conteo de filas
        /// </summary>
        public static int ContarFilas(int fproceso, int ctipoarchivo, int numeroejecucion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            int sec = contexto.Database.SqlQuery<int>(HQL_CONTARFILAS, new SqlParameter("@fproceso", fproceso),
                                                                       new SqlParameter("@ctipoarchivo", ctipoarchivo),
                                                                       new SqlParameter("@numeroejecucion", numeroejecucion)).SingleOrDefault();
            return sec;
        }

        private static string HQL_CONTARERRORES = "select isnull(count(1),0) from TgenCargaControlErrores t where  t.ctipoarchivo = @ctipoarchivo and t.numeroejecucion = @numeroejecucion and cresultado = 'E' and t.idproceso=@idproceso ";
        private static string HQL_CONTAROK = "select isnull(count(1),0) from TgenCargaControlErrores t where  t.ctipoarchivo = @ctipoarchivo and t.numeroejecucion = @numeroejecucion and cresultado = 'OK' and  t.idproceso=@idproceso ";
        /// <summary>
        /// Metodo para contar los errores que están en la bdd
        /// </summary>
        public static int ContarErrores(int fproceso, int ctipoarchivo, int numeroejecucion,int idproceso)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            int sec = contexto.Database.SqlQuery<int>(HQL_CONTARERRORES, 
                                                                         new SqlParameter("@ctipoarchivo", ctipoarchivo),
                                                                         new SqlParameter("@numeroejecucion", numeroejecucion),
                                                                         new SqlParameter("@idproceso", idproceso)
                                                                         ).SingleOrDefault();
            return sec;
        }

        public static int ContarOK(int fproceso, int ctipoarchivo, int numeroejecucion,int idproceso)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            int sec = contexto.Database.SqlQuery<int>(HQL_CONTAROK, 
                                                                         new SqlParameter("@ctipoarchivo", ctipoarchivo),
                                                                         new SqlParameter("@numeroejecucion", numeroejecucion),
                                                                         new SqlParameter("@idproceso", idproceso)
                                                                         ).SingleOrDefault();
            return sec;
        }
        /// <summary>
        /// Inserta un registro en la tabla TgenCargaControlErrores, con el error de procesamiento de un registro asociado a un archvio. 
        /// </summary>
        /// <param name="fproceso">Fecha de proceso en la que se ejecuta la carga del archvio.</param>
        /// <param name="numeroejecucion">Numero de ejecucion para la fecha y tipo de archivo.</param>
        /// <param name="numerolinea">Numero de linea del archivo.</param>
        /// <param name="ctipoarchivo">Codigo de tipo de archivo.</param>
        /// <param name="cresultado">Codigo de resultado.</param>
        /// <param name="mensaje">Mensaje </param>
        public void Crear(int fproceso, int numeroejecucion, int numerolinea, int ctipoarchivo, string cresultado, string mensaje)
        {
            tgencargacontrolerrores obj = new tgencargacontrolerrores();
            obj.fproceso = fproceso;
            obj.numeroejecucion = numeroejecucion;
            obj.numerolinea = numerolinea;
            obj.ctipoarchivo = ctipoarchivo;
            obj.cresultado = cresultado;
            obj.mensaje = mensaje;
            obj.freal = DateTime.Now;
            Sessionef.Save(obj);
        }

    }

}
