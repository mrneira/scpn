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

namespace dal.activosfijos {

    public class TacfAjusteDetalleDal
    {
        /// <summary>
        /// Entrega el detalle de un ajuste de bodega.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="detalle"></param>
        /// <param name="cajuste"></param>
        public static void Completar(RqMantenimiento rqmantenimiento, tacfajustedetalle detalle, int cajuste)
        {
            detalle.cajuste = cajuste;
            detalle.optlock = 0;
            detalle.stockcongelado = decimal.Parse( detalle.Mdatos["stock"].ToString());
            detalle.vunitario = decimal.Parse(detalle.Mdatos["vunitario"].ToString());
            if (detalle.cusuarioing == null){
                detalle.cusuarioing = rqmantenimiento.Cusuario;
                detalle.fingreso = rqmantenimiento.Freal;
            }else{
                detalle.cusuariomod = rqmantenimiento.Cusuario;
                detalle.fmodificacion = rqmantenimiento.Freal;
            }
        }

        public static void Completar(RqMantenimiento rqmantenimiento, List<IBean> ldetalle)
        {
            int cajuste = int.Parse(rqmantenimiento.Mdatos["cajuste"].ToString());
            foreach (tacfajustedetalle obj in ldetalle)
            {
                TacfAjusteDetalleDal.Completar(rqmantenimiento, obj, cajuste);
            }
        }

        public static List<tacfajustedetalle> FindXCajuste(int cajuste) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tacfajustedetalle> lista = new List<tacfajustedetalle>();
            lista = contexto.tacfajustedetalle.AsNoTracking().Where(x => x.cajuste == cajuste).OrderBy(x => x.secuencia).ToList();
            return lista;
        }
 
    }

}
