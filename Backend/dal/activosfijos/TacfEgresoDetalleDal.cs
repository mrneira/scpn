using dal.generales;
using dal.monetario;
using modelo;
using modelo.helper;
using modelo.interfaces;
using modelo.servicios;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace dal.activosfijos {

    public class TacfEgresoDetalleDal
    {
        /// <summary>
        /// Completa datos del detalle de un egreso
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="detalle"></param>
        /// <param name="cegreso"></param>
        public static void Completar(RqMantenimiento rqmantenimiento, tacfegresodetalle detalle, int cegreso)
        {
            detalle.cegreso = cegreso;
            detalle.optlock = 0;
            detalle.stock = decimal.Parse(detalle.Mdatos["stock"].ToString());
            detalle.vunitario = decimal.Parse(detalle.Mdatos["vunitario"].ToString());
            if (detalle.cusuarioing == null)
            {
                detalle.cusuarioing = rqmantenimiento.Cusuario;
                detalle.fingreso = rqmantenimiento.Freal;
            }
            else
            {
                detalle.cusuariomod = rqmantenimiento.Cusuario;
                detalle.fmodificacion = rqmantenimiento.Freal;
            }
        }

        public static void Completar(RqMantenimiento rqmantenimiento, List<IBean> ldetalle)
        {
            int cegreso = int.Parse(rqmantenimiento.Mdatos["cegreso"].ToString());
            foreach (tacfegresodetalle obj in ldetalle)
            {
                TacfEgresoDetalleDal.Completar(rqmantenimiento, obj, cegreso);
            }
        }

        /// <summary>
        /// Metodo que permite la busqueda de un egreso
        /// </summary>
        /// <param name="cegreso"></param>
        /// <returns></returns>
        public static tacfegresodetalle FindEgreso(int cegreso)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tacfegresodetalle obj = null;
            obj = contexto.tacfegresodetalle.Where(x => x.cegreso == cegreso).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }
        public static List<tacfegresodetalle> FindXCegreso(int cegreso) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tacfegresodetalle> lista = new List<tacfegresodetalle>();
            lista = contexto.tacfegresodetalle.AsNoTracking().Where(x => x.cegreso == cegreso).OrderBy(x => x.secuencia).ToList();
            return lista;
        }

        /// <summary>
        /// Metodo que permite la creacion del detalle de un egreso
        /// </summary>
        /// <param name="cproducto"></param>
        /// <param name="cegreso"></param>
        /// <param name="optlock"></param>
        /// <param name="cantidad"></param>
        /// <param name="vunitario"></param>
        /// <param name="stock"></param>
        /// <param name="cusuarioing"></param>
        /// <param name="fingreso"></param>
        /// <returns></returns>
        public static tacfegresodetalle Crear(int cproducto, int cegreso, long optlock, decimal cantidad, decimal vunitario, decimal stock, string cusuarioing, DateTime fingreso)
        {
            tacfegresodetalle ed = new tacfegresodetalle();
            ed.cproducto = cproducto;
            ed.cegreso = cegreso;
            ed.optlock = optlock;
            ed.cantidad = cantidad;
            ed.vunitario = vunitario;
            ed.stock = stock;
            ed.cusuarioing = cusuarioing;
            ed.fingreso = fingreso;          
            return ed;
        }



    }

}
