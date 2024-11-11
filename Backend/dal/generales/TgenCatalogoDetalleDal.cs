using modelo;
using modelo.helper;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.generales {

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TgenCatalogoDetalle.
    /// </summary>
    public class TgenCatalogoDetalleDal {
        public static tgencatalogodetalle Find(int ccatalogo, string cdetalle) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tgencatalogodetalle obj = null;

            obj = contexto.tgencatalogodetalle.AsNoTracking().Where(x => x.ccatalogo == ccatalogo && x.cdetalle == cdetalle).SingleOrDefault();
            if(obj == null) {
                return null;
            }
            EntityHelper.SetActualizar(obj);
            return obj;
        }
        public static tgencatalogodetalle FindActivo(int ccatalogo, string cdetalle)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tgencatalogodetalle obj = null;

            obj = contexto.tgencatalogodetalle.AsNoTracking().Where(x => x.ccatalogo == ccatalogo && x.cdetalle == cdetalle && x.activo== true).SingleOrDefault();
            if (obj == null)
            {
                return null;
            }
            EntityHelper.SetActualizar(obj);
            return obj;
        }

        public static tgencatalogodetalle FindInDataBase(int ccatalogo, string cdetalle) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tgencatalogodetalle obj = null;

            obj = contexto.tgencatalogodetalle.AsNoTracking().Where(x => x.ccatalogo == ccatalogo && x.cdetalle == cdetalle).SingleOrDefault();
            if(obj == null) {
                return null;
            }
            return obj;
        }

        public static tgencatalogodetalle FindToDifcdetalle(int ccatalogo, string cdetalle) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tgencatalogodetalle obj = null;

            obj = contexto.tgencatalogodetalle.AsNoTracking().Where(x => x.ccatalogo == ccatalogo && x.cdetalle != cdetalle).SingleOrDefault();
            if(obj == null) {
                return null;
            }
            EntityHelper.SetActualizar(obj);
            return obj;
        }

        /// <summary>
        /// Consulta TgenCatalogoDetalle dado el codigo legal.
        /// </summary>
        /// <param name="ccatalogo">Codigo de catalogo.</param>
        /// <param name="clegal">Codigo legal.</param>
        /// <returns></returns>
        public static tgencatalogodetalle FindByLegal(int ccatalogo, string clegal) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tgencatalogodetalle obj = null;

            obj = contexto.tgencatalogodetalle.AsNoTracking().Where(x => x.ccatalogo == ccatalogo && x.clegal == clegal).SingleOrDefault();
            if(obj == null) {
                return null;
            }
            EntityHelper.SetActualizar(obj);
            return obj;
        }

        /// <summary>
        /// Metodo que entrega la definicion de una transaccion. Si la transaccion maneja cache, busca los datos en cahce, si no encuentra los datos en cache busca en la base, 
        /// alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="ccatalogo">Codigo de catalogo.</param>
        /// <returns></returns>
        public static IList<tgencatalogodetalle> Find(int ccatalogo) {
            IList<tgencatalogodetalle> ldata = null;
            // Si maneja cache de transaccion.
            String key = "" + ccatalogo;
            CacheStore cs = CacheStore.Instance;
            ldata = (IList<tgencatalogodetalle>)cs.GetDatos("tgencatalogodetalle", key);
            if(ldata == null) {
                ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tgencatalogodetalle");
                ldata = TgenCatalogoDetalleDal.FindInDataBase(ccatalogo);
                m[key] = ldata;
                cs.PutDatos("tgencatalogodetalle", m);
            }

            return ldata;
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de TgenCatalogoDetalle.
        /// </summary>
        /// <param name="ccatalogo">Codigop de cattalogo</param>
        /// <returns>IList<TgenCatalogoDetalleDto></returns>
        public static IList<tgencatalogodetalle> FindInDataBase(int ccatalogo) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tgencatalogodetalle> lista = null;

            lista = contexto.tgencatalogodetalle.AsNoTracking().Where(x => x.ccatalogo == ccatalogo).ToList();

            return lista;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de TgenCatalogoDetalle.
        /// </summary>
        /// <param name="ccatalogo">Codigop de cattalogo</param>
        /// <returns>IList<TgenCatalogoDetalleDto></returns>
        public static List<tgencatalogodetalle> FindInDataBase()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tgencatalogodetalle> lista = null;

            lista = contexto.tgencatalogodetalle.AsNoTracking().ToList();

            return lista;
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de TgenCatalogoDetalle.
        /// </summary>
        /// <param name="ccatalogo">Codigop de cattalogo</param>
        /// <returns>IList<TgenCatalogoDetalleDto></returns>
        public static List<tgencatalogodetalle> FindList(int ccatalogo, string clegal) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tgencatalogodetalle> obj = null;

            obj = contexto.tgencatalogodetalle
                .AsNoTracking()
                .Where(x => x.ccatalogo == ccatalogo && x.clegal == clegal)
                .ToList();
            if(obj == null) {
                return null;
            }
            return obj;
        }

    }
}
