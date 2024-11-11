using dal.generales;
using dal.monetario;
using modelo;
using modelo.interfaces;
using modelo.servicios;
using modelo.helper;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace dal.contabilidad.cuentasporpagar.liquidacionviaticos{

    public class TconLiqGastosDetalleDal{

        public static void Completar(RqMantenimiento rqmantenimiento, tconliqgastosdetalle detalle, tconliquidaciongastos liq) {
            detalle.cliquidaciongastos = liq.cliquidaciongastos;
            detalle.ccompromiso = liq.ccompromiso;
        }

        public static void Completar(RqMantenimiento rqmantenimiento, List<IBean> ldetalle) {
            // El numero de comprobante se obtiene en la clase com.flip.modulos.contabilidad.mantenimiento.comprobante.DatosCabecera
            tconliquidaciongastos liq = (tconliquidaciongastos)rqmantenimiento.Mtablas["CABECERA"].Lregistros.ElementAt(0);
            foreach (tconliqgastosdetalle obj in ldetalle) {
                Completar(rqmantenimiento, obj, liq);
            }
        }



        public static List<tconliqgastosdetalle> Find(long cliquidaciongastos, int ccompania) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tconliqgastosdetalle> lista = new List<tconliqgastosdetalle>();
            lista = contexto.tconliqgastosdetalle.AsNoTracking().Where(x => x.cliquidaciongastos == cliquidaciongastos &&
                                                                    x.ccompania == ccompania).OrderBy(x => x.secuencia).ToList();
            return lista;
        }

        public static tconliqgastosdetalle FindXSecuencia(long cliquidaciongastos ,int secuencia)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tconliqgastosdetalle obj = new tconliqgastosdetalle();
            obj = contexto.tconliqgastosdetalle.AsNoTracking().Where(x => x.cliquidaciongastos == cliquidaciongastos &&
                                                                    x.secuencia == secuencia).FirstOrDefault();
            if (obj != null) EntityHelper.SetActualizar(obj);
            return obj;
        }

    }

}
