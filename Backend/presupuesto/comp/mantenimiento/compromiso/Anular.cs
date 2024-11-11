using core.componente;
using core.servicios;
using dal.presupuesto;
using modelo;
using modelo.interfaces;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace presupuesto.comp.mantenimiento.compromiso
{

    public class Anular : ComponenteMantenimiento {

        /// <summary>
        /// Clase que se encarga de completar información de la cabecera de un compromiso para una partida.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
                      

            if (rqmantenimiento.GetTabla("CABECERA") == null || rqmantenimiento.GetTabla("CABECERA").Lregistros.Count() < 0) {
                return;
            }

            tpptcompromiso cabecera = (tpptcompromiso)rqmantenimiento.GetTabla("CABECERA").Lregistros.ElementAt(0);
            List<IBean> lmantenimiento = new List<IBean>();
            lmantenimiento = rqmantenimiento.GetTabla("DETALLE").Lregistros;
            string cliberacion = Secuencia.GetProximovalor("PPTLIBERACI").ToString();
            tpptpartidagasto partgasto;
            List<tpptpartidagasto> lpartgasto = new List<tpptpartidagasto>();
            List<tppthistorialpartidagasto> lhistorialpg = new List<tppthistorialpartidagasto>();
            foreach (tpptcompromisodetalle obj in lmantenimiento) {
                partgasto = new tpptpartidagasto();
                partgasto = TpptPartidaGastoDal.Find(obj.cpartidagasto, Fecha.GetAnio(rqmantenimiento.Fconatable));
                partgasto.vcomprometido -= obj.valor;
                partgasto.vsaldopordevengar += obj.valor;
                lpartgasto.Add(partgasto);
                tppthistorialpartidagasto hpg = TpptHistorialPartidaGastoDal.Crear(partgasto, obj.ccompromiso, null, cliberacion, null, null, 
                    ConstantesPresupuesto.CONCEPTO_LIBERACION_PRESUPUESTARIA,"", rqmantenimiento, -obj.valor, -obj.valor);
                lhistorialpg.Add(hpg);
                lpartgasto.Add(partgasto);
            }

            rqmantenimiento.AdicionarTabla("tppthistorialpartidagasto", lhistorialpg, false);
            rqmantenimiento.AdicionarTabla("tpptpartidagasto", lpartgasto, false);
        }
    }
}
