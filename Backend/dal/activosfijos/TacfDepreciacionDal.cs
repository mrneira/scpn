using dal.generales;
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

    public class TacfDepreciacionDal
    {
        /// <summary>
        /// Completa datos de la cabecera de una depreciacion
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="cabecera"></param>
        public static void Completar(RqMantenimiento rqmantenimiento, tacfdepreciacion cabecera) {
            if (cabecera.cusuarioing.Equals("")) {
                cabecera.cusuarioing = (string)rqmantenimiento.Cusuario;
                cabecera.fingreso = (DateTime)rqmantenimiento.Freal;
               
            } else {
                cabecera.cusuariomod = (string)rqmantenimiento.Cusuario;
                cabecera.fmodificacion = (DateTime)rqmantenimiento.Freal;
            }
       

        }
        /// <summary>
        /// Cambia el estado de una depreciacion a eliminado
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="cdepreciacion"></param>
        public static void Eliminar(RqMantenimiento rqmantenimiento, int cdepreciacion)
        {
            tacfdepreciacion depreciacion = TacfDepreciacionDal.FindDepreciacion(cdepreciacion);
            depreciacion.estadocdetalle = "ELIMIN";
            depreciacion.cusuariomod = rqmantenimiento.Cusuario;
            depreciacion.fmodificacion = rqmantenimiento.Freal;
            Sessionef.Actualizar(depreciacion);
        }

        /// <summary>
        /// Entrega cabecera de una depreciacion.
        /// </summary>
        /// <param name="cdepreciacion">Numero de depreciacion.</param>
        /// <returns>TacfdepreciacionDto</returns>
        public static tacfdepreciacion FindDepreciacion(int cdepreciacion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tacfdepreciacion obj = null;
            obj = contexto.tacfdepreciacion.Where(x => x.cdepreciacion == cdepreciacion).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

        
    }

}
