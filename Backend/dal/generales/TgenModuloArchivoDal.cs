using modelo;
using modelo.helper;
using System;
using System.Collections;
using System.Collections.Concurrent;
using System.Linq;
using System.Collections.Generic;
using util;
using util.servicios.ef;

namespace dal.generales
{
    public class TgenModuloArchivoDal
    {

        /// <summary>
        /// Consulta en la base de datos la definicion de una tgenmodulo.
        /// </summary>
        /// <returns></returns>
        public static IList<tgenmoduloarchivo> Find()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tgenmoduloarchivo> obj = null;
            try
            {
                obj = contexto.tgenmoduloarchivo.AsNoTracking().ToList();

            }
            catch (Exception er)
            {
                obj = null;
            }
            return obj;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de una tgenmoduloarchivo.
        /// </summary>
        /// <param name="carchivo">Codigo del modulo al que pertenece el registro.</param>
        /// <returns></returns>
        public static Object FindDatabase(int cmodulo)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            var obj = contexto.tgenmoduloarchivo
                            .Where(x => x.cmodulo == cmodulo)
                            .Select(x => new {
                                x.carchivo, x.nombre, x.descripcion, x.extension, x.tamanio
                            }).ToList();
            
            return obj;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de una tgenmoduloarchivo.
        /// </summary>
        /// <param name="carchivo">Codigo de archivo al que pertenece la registro.</param>
        /// <returns></returns>
        public static tgenmoduloarchivo FindArchivo(int carchivo)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tgenmoduloarchivo obj = null;

            obj = contexto.tgenmoduloarchivo.AsNoTracking().Where(x => x.carchivo == carchivo).SingleOrDefault();
            return obj;
        }

    }
}
