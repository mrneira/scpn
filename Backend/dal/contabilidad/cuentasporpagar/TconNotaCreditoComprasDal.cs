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

namespace dal.contabilidad.cuentasporpagar {

    public class TconNotaCreditoComprasDal {

        public static void Completar(RqMantenimiento rqmantenimiento, tconcuentaporpagar cabecera, string ccomprobante) {

            if (cabecera.cctaporpagar != null) {
                cabecera.fmodificacion = rqmantenimiento.Freal;
                cabecera.cusuariomod = rqmantenimiento.Cusuario;
                // Genera registro de historia.
            } else {
                cabecera.cctaporpagar = ccomprobante;
            }


            if (cabecera.fingreso == null) {
                cabecera.fingreso = rqmantenimiento.Freal;
                cabecera.cusuarioing = rqmantenimiento.Cusuario;
            }
            cabecera.oficina = rqmantenimiento.Cagencia.ToString();
        }

        /// <summary>
        /// Entrega lista de notas asociadas a una cuenta por pagar
        /// </summary>
        /// <param name="cctaporpagar">Numero de cuenta por pagar.</param>
        /// <returns>tconcuentaporpagar</returns>
        public static List<tconnotacreditocompras> Find(string cctaporpagar) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tconnotacreditocompras> lista = new List<tconnotacreditocompras>();
            lista = contexto.tconnotacreditocompras.AsNoTracking().Where(x => x.cctaporpagar.Equals(cctaporpagar)).ToList();
            return lista;
        }

    }

}
