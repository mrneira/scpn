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

    public class TacfAjusteDal {

        public static void Completar(RqMantenimiento rqmantenimiento, tacfajuste cabecera)
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
        /// Entrega cabecera de un ajuste de bodega.
        /// </summary>
        /// <param name="cajuste">Numero de ajuste bodega.</param>
        /// <returns>TacfAjusteDto</returns>
        public static tacfajuste FindAjuste(int cajuste)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tacfajuste obj = null;
            obj = contexto.tacfajuste.Where(x => x.cajuste == cajuste).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

        public static void Eliminar(RqMantenimiento rqmantenimiento, tacfajuste ajuste)
        {
            ajuste = FindAjuste(ajuste.cajuste);
            ajuste.eliminado = true;
            ajuste.cusuariomod = rqmantenimiento.Cusuario;
            ajuste.fmodificacion = rqmantenimiento.Freal;
            rqmantenimiento.Actualizar = true;
            rqmantenimiento.Mtablas["CABECERA"] = null;
            rqmantenimiento.Mtablas["DETALLE"] = null;
            rqmantenimiento.AdicionarTabla("tacfajuste", ajuste, false);
        }


    }

}
