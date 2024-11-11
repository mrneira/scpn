using modelo;
using modelo.helper;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.contabilidad {

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla tconparametros.
    /// </summary>
    public class TconParametrosDal {


        /// <summary>
        /// Entrega una lista de tconparametros 
        /// </summary>
        /// <param name="ccompania">Codigo de compania.</param>
        /// <param name="codigo">código del parámetro</param>
        /// <returns>List<TconParametros></returns>
        public static tconparametros FindXCodigo(string codigo, int ccompania) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tconparametros obj;
            ccompania = 1;
            obj = contexto.tconparametros.Where(x => x.codigo.Equals(codigo) &&
                                                                x.ccompania == ccompania).SingleOrDefault();
            if (obj != null) {
                EntityHelper.SetActualizar(obj);
            }
            else
            {
                throw new AtlasException("CONTA-010", "ERROR: PARAMETROS CONTABLE [{0}] NO DEFINIDO PARA MODULO CONTABILIDAD", codigo);
            } 
            return obj;
        }

        /// <summary>
        /// Entrega una lista de tconparametros 
        /// </summary>
        /// <param name="ccompania">Codigo de compania.</param>
        /// <param name="nombre">nombre del parámetro</param>
        /// <returns>List<TconParametros></returns>
        public static List<tconparametros> FindXNombre(string nombre, int ccompania)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tconparametros> lista = new List<tconparametros>();
            lista = contexto.tconparametros.AsNoTracking().Where(x => x.nombre.Equals(nombre) &&
                                                                x.ccompania == ccompania).ToList();
            return lista;
        }

        /// <summary>
        /// encuentra por texto 
        /// </summary>
        /// <param name="codigo"></param>
        /// <param name="ccompania"></param>
        /// <param name="numero"></param>
        /// <returns></returns>
        public static tconparametros FindTexto(string codigo, int ccompania, int numero)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tconparametros lista = new tconparametros();
            lista = contexto.tconparametros.Where(x => x.codigo.Equals(codigo) &&
                                                                x.ccompania == ccompania &&
                                                                x.numero==numero).SingleOrDefault();
            return lista;
        }
    }
}
