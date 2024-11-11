using dal.generales;
using modelo;
using modelo.helper;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace dal.activosfijos {

    public class TacfEgresoDal {

        /// <summary>
        /// Completa datos de cabecera de un egreso
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="cabecera"></param>
        public static void Completar(RqMantenimiento rqmantenimiento, tacfegreso cabecera)
        {
            if (cabecera.cusuarioing.Equals("")) {
                cabecera.cusuarioing = (string)rqmantenimiento.Cusuario;
                cabecera.fingreso = (DateTime)rqmantenimiento.Freal;
                
            } else {
                cabecera.cusuariomod = (string)rqmantenimiento.Cusuario;
                cabecera.fmodificacion = (DateTime)rqmantenimiento.Freal;
            }
            
            cabecera.optlock = 0;

        }

        /// <summary>
        /// Metodo de busqueda de un egreso 
        /// </summary>
        /// <param name="cegreso"></param>
        /// <returns></returns>
        public static tacfegreso FindEgreso(int cegreso)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tacfegreso obj = null;
            obj = contexto.tacfegreso.Where(x => x.cegreso == cegreso).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

        /// <summary>
        /// Metodo que cambia el estado de un egreso a eliminado
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="egreso"></param>
        public static void Eliminar(RqMantenimiento rqmantenimiento, tacfegreso egreso)
        {
            egreso = FindEgreso(egreso.cegreso);
            egreso.eliminado = true;
            egreso.cusuariomod = rqmantenimiento.Cusuario;
            egreso.fmodificacion = rqmantenimiento.Freal;
            rqmantenimiento.Actualizar = true;
            rqmantenimiento.Mtablas["CABECERA"] = null;
            rqmantenimiento.Mtablas["DETALLE"] = null;
            rqmantenimiento.AdicionarTabla("tacfegreso", egreso, false);
        }

    }

}
