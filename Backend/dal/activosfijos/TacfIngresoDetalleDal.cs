using dal.generales;
using dal.monetario;
using modelo;
using modelo.helper;
using modelo.interfaces;
using modelo.servicios;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace dal.activosfijos {

    public class TacfIngresoDetalleDal
    {
        /// <summary>
        /// Consulta en la base de datos el detalle de un ingreso
        /// </summary>
        /// <param name="cingreso"></param>
        /// <returns></returns>
        public static tacfingresodetalle FindInDatabase(int cingreso)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tacfingresodetalle obj = null;
            obj = contexto.tacfingresodetalle.Where(x => x.cingreso == cingreso).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

        /// <summary>
        /// Consulta en la base de datos el detalle de un ingreso por producto y por ingreso
        /// </summary>
        /// <param name="cproducto"></param>
        /// <param name="cingreso"></param>
        /// <returns></returns>
        public static tacfingresodetalle FindCproducto(int cproducto, int cingreso)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tacfingresodetalle obj = null;
            obj = contexto.tacfingresodetalle.Where(x => x.cproducto == cproducto && x.cingreso == cingreso).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }
        public static void Completar(RqMantenimiento rqmantenimiento, tacfingresodetalle detalle, int cingreso)
        {
            detalle.cingreso = cingreso;
            detalle.optlock = 0;
            if (detalle.cusuarioing == null)
            {
                detalle.cusuarioing = rqmantenimiento.Cusuario;
                detalle.fingreso = rqmantenimiento.Freal;
                detalle.stock = decimal.Parse(detalle.Mdatos["stock"].ToString()) + detalle.cantidad;
            }
            else
            {
                detalle.cusuariomod = rqmantenimiento.Cusuario;
                detalle.fmodificacion = rqmantenimiento.Freal;
                detalle.stock = decimal.Parse(detalle.Mdatos["stock1"].ToString()) + detalle.cantidad;
            }
        }

        public static void Completar(RqMantenimiento rqmantenimiento, List<IBean> ldetalle)
        {
            int cingreso = int.Parse(rqmantenimiento.Mdatos["cingreso"].ToString());
            foreach (tacfingresodetalle obj in ldetalle)
            {
                TacfIngresoDetalleDal.Completar(rqmantenimiento, obj, cingreso);
            }
        }

        public static List<tacfingresodetalle> FindXCingreso(int cingreso) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tacfingresodetalle> lista = new List<tacfingresodetalle>();
            lista = contexto.tacfingresodetalle.AsNoTracking().Include("tacfproducto").Where(x => x.cingreso == cingreso).OrderBy(x => x.secuencia).ToList();
            return lista;
        }

        public static List<tacfingresodetalle>FindIngreso(int cingreso)
        {
      
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tacfingresodetalle> lista = new List<tacfingresodetalle>();
            lista = contexto.tacfingresodetalle.AsNoTracking().Where(x => x.cingreso.Equals(cingreso)).ToList();
            return lista;
        }
        public static tacfingresodetalle Find(int cingreso)
        {
            tacfingresodetalle obj = null;
            String key = "" + cingreso;
            CacheStore cs = CacheStore.Instance;
            obj = (tacfingresodetalle)cs.GetDatos("tacfingresodetalle", key);
            if (obj == null)
            {
                ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tacfingresodetalle");
                obj = FindInDatabase(cingreso);
                m[key] = obj;
                cs.PutDatos("tacfingresodetalle", m);
            }
            return obj;
        }
        public static tacfingresodetalle Crear(decimal cantidad, int cingreso, int cproducto, string cusuarioing, DateTime fingreso, long optlock, decimal stock, decimal vunitario)
        {
            tacfingresodetalle id = new tacfingresodetalle();
            id.cantidad = cantidad;
            id.cingreso = cingreso;
            id.cproducto = cproducto;
            id.cusuarioing = cusuarioing;
            id.fingreso = fingreso;
            id.optlock = optlock;
            id.stock = stock;
            id.vunitario = vunitario;
            return id;
        }

    }

}
