using modelo;
using modelo.helper;
using System;
using System.Collections.Concurrent;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.generales
{
    /// <summary>
    /// Clase que implementa dml's manuales contra la base de datos.
    /// </summary>
    public class TgenCargaArchivoLogDal {


        /// <summary>
        /// Metodo que entrega la definicion de un tipo de archvio. Si no encuentra los datos en cache busca en la base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="ctipoarchivo">Codigo de tipo de archivo.</param>
        /// <returns>TgenCargaArchivoDto</returns>
        public static tgencargaarchivolog Find(long clog) {

            tgencargaarchivolog obj = null;
            string key = "" + clog;
            CacheStore cs = CacheStore.Instance;

            obj = (tgencargaarchivolog)cs.GetDatos("tgencargaarchivolog", key);
            if (obj == null) {
                ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tgencargaarchivolog");
                obj = FindInDataBase(clog);
                //Sessionhb.GetSession().Evict(obj);
                m.TryAdd(key, obj);
                cs.PutDatos("tgencargaarchivolog", m);
            }
            return obj;
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de un tipo de archivo.
        /// </summary>
        /// <param name="ctipoarchivo">Codigo de tipo de archivo.</param>
        /// <returns>TgenCargaArchivologDto</returns>
        public static tgencargaarchivolog FindInDataBase(long clog)
        {
            tgencargaarchivolog obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tgencargaarchivolog.AsNoTracking().Where(x => x.clog == clog).SingleOrDefault();
            if (obj != null) EntityHelper.SetActualizar(obj);
            return obj;
        }

        /// <summary>
        /// Crea un registro de tgencargaarchivolog
        /// </summary>
        /// <param name="cmodulo"></param>
        /// <param name="ctransaccion"></param>
        /// <param name="tipoarchivo"></param>
        /// <param name="nombre"></param>
        /// <param name="fcarga"></param>
        /// <param name="freal"></param>
        /// <param name="estado"></param>
        /// <param name="registrosok"></param>
        /// <param name="registroserror"></param>
        /// <param name="registrostotal"></param>
        /// <param name="valor1"></param>
        /// <param name="valor2"></param>
        /// <param name="valor3"></param>
        /// <param name="comentario"></param>
        /// <param name="fingreso"></param>
        /// <param name="cusuarioing"></param>
        /// <returns></returns>
        public static tgencargaarchivolog crear(int cmodulo, int ctransaccion, string tipoarchivo, string nombre, DateTime fcarga, DateTime freal,
                                        string estado, int registrosok, int registroserror, int registrostotal, 
                                        decimal valor1, decimal valor2, decimal valor3, string comentario,
                                        DateTime fingreso, string cusuarioing) {
            tgencargaarchivolog cal = new tgencargaarchivolog();
            cal.cmodulo = cmodulo;
            cal.ctransaccion = ctransaccion;
            cal.tipoarchivo = tipoarchivo;
            cal.nombre = nombre;
            cal.fcarga = fcarga;
            cal.freal = freal;
            cal.estado = estado;
            cal.registrosok = registrosok;
            cal.registroserror = registroserror;
            cal.registrostotal = registrostotal;
            cal.valor1 = valor1;
            cal.valor2 = valor2;
            cal.valor3 = valor3;
            cal.comentario = comentario;
            cal.fingreso = fingreso;
            cal.cusuarioing = cusuarioing;
            return cal;
        }

    }

}
