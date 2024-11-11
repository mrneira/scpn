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

namespace dal.presupuesto {

    public class TpptCompromisoDal
    {

        public static void Completar(RqMantenimiento rqmantenimiento, tpptcompromiso cabecera) {
            if (cabecera.cusuarioing.Equals("")) {
                cabecera.cusuarioing = (string)rqmantenimiento.Cusuario;
                cabecera.fingreso = (DateTime)rqmantenimiento.Freal;
            } else {
                cabecera.cusuariomod = (string)rqmantenimiento.Cusuario;
                cabecera.fmodificacion = (DateTime)rqmantenimiento.Freal;
            }
        }

        public static void Eliminar(RqMantenimiento rqmantenimiento, tpptcompromiso compromiso)
        {
            compromiso = FindCompromiso(compromiso.ccompromiso);
            compromiso.eliminado = true;
            compromiso.cusuariomod = rqmantenimiento.Cusuario;
            compromiso.fmodificacion = rqmantenimiento.Freal;
            rqmantenimiento.Actualizar = true;
            rqmantenimiento.Mtablas["CABECERA"] = null;
            rqmantenimiento.Mtablas["DETALLE"] = null;
            rqmantenimiento.AdicionarTabla("tpptcompromiso", compromiso, false);
        }
        
        /// <summary>
        /// Entrega cabecera de un compromiso.
        /// </summary>
        /// <param name="ccompromiso">Numero de compromiso.</param>
        /// <returns>TpptcompromisoDto</returns>
        public static tpptcompromiso FindCompromiso(string ccompromiso)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tpptcompromiso obj = null;
            obj = contexto.tpptcompromiso.Where(x => x.ccompromiso == ccompromiso).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

        /// <summary>
        /// Entrega cabecera de un compromiso.
        /// </summary>
        /// <param name="ccompromiso">Numero de compromiso.</param>
        /// <returns>TpptcompromisoDto</returns>
        public static tpptcompromiso FindCompromisoXEstado(string ccompromiso, string estadocdetalle) {
            tpptcompromiso obj = FindCompromiso(ccompromiso);
            if (obj != null) {
                if (obj.estadocdetalle.Equals(estadocdetalle)) {
                    EntityHelper.SetActualizar(obj);
                }
            }
            return obj;
        }
    }

}
