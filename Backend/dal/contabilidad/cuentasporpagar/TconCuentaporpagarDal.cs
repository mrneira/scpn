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

    public class TconCuentaporpagarDal {

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

        public static tconcuentaporpagar Crear(RqMantenimiento rqmantenimiento, RequestOperacion requestoperacion, String ccomprobante, int fcontable) {
            tconcuentaporpagar obj = new tconcuentaporpagar();
            Sessionef.Save(obj);
            return obj;
        }

        private static string SQL_CXP_PARA_AUTORIZAR1 = "select t.cpersona,t.cctaporpagar,right('000' + t.establecimiento,3) + '-' + right('000' + t.puntoemision,3) + '-' + right('000000000' + t.secuencial,9) as 'documento', " + 
                                " t.ffactura,t.fingreso,t.fvencimiento,t.valorpagar, " +
                                " p.nombre, p.nombrecomercial, datediff(dd,t.ffactura,t.fvencimiento) as 'diasvencimiento', 0 as 'autorizar' " + 
                                " " +
                                " from tconcuentaporpagar t, tperproveedor p where t.cpersona = p.cpersona " +
                                " and t.cpersona >= @cpersona  and t.ffactura >=  @fingresoini and t.ffactura <= @fingresofin " +
                                " and t.valorpagar >= @valorapagarini and t.valorpagar <= @valorapagarfin " +
                                " and t.estadocxpcdetalle = 'CONTAB'";

        private static string SQL_CXP_PARA_AUTORIZAR2 = "select t.cpersona,t.cctaporpagar,right('000' + t.establecimiento,3) + '-' + right('000' + t.puntoemision,3) + '-' + right('000000000' + t.secuencial,9) as 'documento', " +
                                " t.ffactura,t.fingreso,t.fvencimiento,t.valorpagar, " +
                                " p.nombre, p.nombrecomercial, datediff(dd,t.ffactura,t.fvencimiento) as 'diasvencimiento', '0' as autorizar " +
                                " " +
                                " from tconcuentaporpagar t, tperproveedor p where t.cpersona = p.cpersona " +
                                " and t.cpersona = @cpersona  and t.ffactura >=  @fingresoini and t.ffactura <= @fingresofin " +
                                " and t.valorpagar >= @valorapagarini and t.valorpagar <= @valorapagarfin " +
                                " and t.estadocxpcdetalle = 'CONTAB'";

        /// <summary>
        /// Devuelve el listado de cuentas por pagar para autorizar
        /// </summary>
        /// <param name="fini"></param>
        /// <param name="ffin"></param>
        /// <param name="valini"></param>
        /// <param name="valfin"></param>
        /// <returns></returns>
        public static IList<Dictionary <string, object>> FindCxPParaAutorizar(int cpersona, DateTime fini, DateTime ffin, decimal valini, decimal valfin) {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@cpersona"] = cpersona;
            parametros["@fingresoini"] = fini;
            parametros["@fingresofin"] = ffin;
            parametros["@valorapagarini"] = valini;
            parametros["@valorapagarfin"] = valfin;
            List<string> lcampos = new List<string>();
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, cpersona == 0 ? SQL_CXP_PARA_AUTORIZAR1:SQL_CXP_PARA_AUTORIZAR2);
            IList<Dictionary<string, object>> ldatos = ch.GetRegistrosDictionary();
            return ldatos;
        }

        /// <summary>
        /// Entrega cabecera de una cuenta por pagar.
        /// </summary>
        /// <param name="cctaporpagar">Numero de cuenta por pagar.</param>
        /// <returns>tconcuentaporpagar</returns>
        public static tconcuentaporpagar Find(string cctaporpagar) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tconcuentaporpagar obj = null;
            obj = contexto.tconcuentaporpagar.Where(x => x.cctaporpagar.Equals(cctaporpagar)).SingleOrDefault();
            if (obj != null) {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

        public static tconcuentaporpagar FindXNumeroDocumento(string numdocumento)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tconcuentaporpagar obj = null;
            obj = contexto.tconcuentaporpagar.Where(x => x.numdocumento.Equals(numdocumento)).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }


    }

}
