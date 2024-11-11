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

namespace dal.contabilidad {

    public class TconCuentaPorCobrarDal {


        public static void Completar(RqMantenimiento rqmantenimiento, tconcuentaporcobrar cabecera, string cctaporcobrar)
        {
            if (cabecera.fingreso == null){
                cabecera.Actualizar = false;
                cabecera.fingreso = (DateTime)rqmantenimiento.Freal;
                cabecera.cusuarioing = rqmantenimiento.Cusuario;
                cabecera.verreg = 0;
            }
            else{
                cabecera.fmodificacion = (DateTime)rqmantenimiento.Freal;
                cabecera.Actualizar = true;
            }
        
            cabecera.oficina = rqmantenimiento.Cagencia.ToString();
            cabecera.cctaporcobrar = cctaporcobrar;

            rqmantenimiento.AdicionarTabla("tconcuentaporcobrar", cabecera, false);
        }

        public static tconcuentaporcobrar Crear(RqMantenimiento rqmantenimiento, RequestOperacion requestoperacion, String ccomprobante, int fcontable)
        {
            tconcuentaporcobrar obj = new tconcuentaporcobrar();
            Sessionef.Save(obj);
            return obj;
        }


        /// <summary>
        /// Entrega cabecera de una cuenta por pagar.
        /// </summary>
        /// <param name="cctaporpagar">Numero de cuenta por pagar.</param>
        /// <returns>tconcuentaporcobrar</returns>
        public static tconcuentaporcobrar Find(string cctaporcobrar)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tconcuentaporcobrar obj = null;
            obj = contexto.tconcuentaporcobrar.Where(x => x.cctaporcobrar.Equals(cctaporcobrar)).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

        public static tconcuentaporcobrar FindXNumeroDocumento(string ccodfactura)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tconcuentaporcobrar obj = null;
            obj = contexto.tconcuentaporcobrar.Where(x => x.ccodfactura.Equals(ccodfactura)).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }
    }

}
