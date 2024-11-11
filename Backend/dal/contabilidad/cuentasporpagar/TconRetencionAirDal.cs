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

    public class TconRetencionAirDal {

        public static void Completar(RqMantenimiento rqmantenimiento, tconcomprobantedetalle detalle, string ccomprobante, string cmonedalocal) {

        }

        public static void Completar(RqMantenimiento rqmantenimiento, List<IBean> ldetalle) {

        }

        public static List<tconretencionfuente> Find(string cctaporpagar) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tconretencionfuente> lista = new List<tconretencionfuente>();
            lista = contexto.tconretencionfuente.AsNoTracking().Where(x => x.cctaporpagar.Equals(cctaporpagar))
                .OrderBy(x => x.secuencia)
                .ToList();
            return lista;
        }


        private static String SQL = " select t.codigosri, t.codigosri + ' - ' + cast(t.porcentaje as varchar) + '% - ' +  t.descripcion  as descripcion, t.porcentaje from tconretencionair t " +
                                    " where t.estado = 1 order by t.codigosri ";
        public static IList<Dictionary<string, object>> ListarRetencionAir() {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@estado"] = 1;
            List<string> lcampos = new List<string>();
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, SQL);
            ch.registrosporpagina = 50;
            IList<Dictionary<string, object>> ldatos = ch.GetRegistrosDictionary();
            return ldatos;
        }

    }

}
