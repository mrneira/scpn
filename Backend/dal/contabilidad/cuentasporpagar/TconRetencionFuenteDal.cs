using dal.generales;
using dal.monetario;
using modelo;
using modelo.interfaces;
using modelo.servicios;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace dal.contabilidad.cuentasporpagar {

    public class TconRetencionFuenteDal {

        public static void Completar(RqMantenimiento rqmantenimiento, tconretencionfuente detalle, string ccomprobante) {
            detalle.cctaporpagar = ccomprobante;
        }

        public static void Completar(RqMantenimiento rqmantenimiento, List<IBean> ldetalle) {
            // El numero de comprobante se obtiene en la clase com.flip.modulos.contabilidad.mantenimiento.comprobante.DatosCabecera
            string cctaporpagar = rqmantenimiento.Response["cctaporpagar"].ToString();
            foreach (tconretencionfuente obj in ldetalle) {
                TconRetencionFuenteDal.Completar(rqmantenimiento, obj, cctaporpagar);
            }
        }

        public static List<tconretencionfuente> Find(string cctaporpagar) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tconretencionfuente> lista = new List<tconretencionfuente>();
            lista = contexto.tconretencionfuente.AsNoTracking().Include("tconretencionair").Where(x => x.cctaporpagar.Equals(cctaporpagar))
                .OrderBy(x => x.secuencia)
                .ToList();
            return lista;
        }

    }

}
