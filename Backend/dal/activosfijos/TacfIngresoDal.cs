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

    public class TacfIngresoDal
    {
       
        public static void Completar(RqMantenimiento rqmantenimiento, tacfingreso cabecera) {
            if (cabecera.cusuarioing.Equals("")) {
                cabecera.cusuarioing = (string)rqmantenimiento.Cusuario;
                cabecera.fingreso = (DateTime)rqmantenimiento.Freal;

            } else {
                cabecera.cusuariomod = (string)rqmantenimiento.Cusuario;
                cabecera.fmodificacion = (DateTime)rqmantenimiento.Freal;
            }
            cabecera.optlock = 0;

        }

        public static void Eliminar(RqMantenimiento rqmantenimiento, tacfingreso ingreso)
        {
            ingreso = FindIngreso(ingreso.cingreso);
            ingreso.eliminado = true;
            ingreso.cusuariomod = rqmantenimiento.Cusuario;
            ingreso.fmodificacion = rqmantenimiento.Freal;
            rqmantenimiento.Actualizar = true;
            rqmantenimiento.Mtablas["CABECERA"] = null;
            rqmantenimiento.Mtablas["DETALLE"] = null;
            rqmantenimiento.AdicionarTabla("tacfingreso", ingreso, false);
        }
        

        /// <summary>
        /// Entrega cabecera de un ingreso.
        /// </summary>
        /// <param name="cingreso">Numero de ingreso.</param>
        /// <returns>TacfingresoDto</returns>
        public static tacfingreso FindIngreso(int cingreso)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tacfingreso obj = null;
            obj = contexto.tacfingreso.Where(x => x.cingreso == cingreso).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }
        /// <summary>
        /// Entrega cabecera de un ingreso.
        /// </summary>
        /// <param name="cingreso">Numero de ingreso.</param>
        /// <returns>TacfingresoDto</returns>
        public static tacfingreso FindCuentaxPagar(string cctaporpagar)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tacfingreso obj = null;
            obj = contexto.tacfingreso.Where(x => x.cctaporpagar.Equals(cctaporpagar)).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

        /// <summary>
        /// Entrega cabecera de un ingreso.
        /// </summary>
        /// <param name="cctaporpagar">Numero de cuenta por pagar asociada</param>
        /// <returns>TacfingresoDto</returns>
        public static tacfingreso FindIngresoXctaporpagar(string cctaporpagar) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tacfingreso obj = null;
            obj = contexto.tacfingreso.Where(x => x.cctaporpagar.Equals(cctaporpagar)).SingleOrDefault();
            if (obj != null) {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

       
    }

}
