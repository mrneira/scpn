using core.componente;
using dal.presupuesto;
using modelo;
using modelo.interfaces;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace presupuesto.comp.mantenimiento.compromiso
{

    /// <summary>
    /// Clase que se encarga de completar información ded detalle de un comprobante contable.
    /// </summary>
    public class DatosDetalle : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            string ccompromiso = rqmantenimiento.Mdatos["ccompromiso"].ToString();
            string infoadicional = rqmantenimiento.Mdatos["infoadicional"].ToString();
            List<tpptcompromisodetalle> lista = TpptCompromisoDetalleDal.FindXCcompromiso(ccompromiso);
            List<IBean> lbase = lista.ToList<IBean>();
            List<IBean> lmantenimiento = new List<IBean>();
            List<IBean> leliminar = new List<IBean>();
            if (rqmantenimiento.GetTabla("DETALLE") != null)
            {
                if (rqmantenimiento.GetTabla("DETALLE").Lregistros.Count > 0)
                {
                    lmantenimiento = rqmantenimiento.GetTabla("DETALLE").Lregistros;
                }
                if (rqmantenimiento.GetTabla("DETALLE").Lregeliminar.Count > 0)
                {
                    leliminar = rqmantenimiento.GetTabla("DETALLE").Lregeliminar;
                }
            }
            TpptCompromisoDetalleDal.Completar(rqmantenimiento, lmantenimiento);
            List<IBean> ldetalle = DtoUtil.GetMergedList(lbase, lmantenimiento, leliminar);

            tpptpartidagasto partgasto;
            List<tpptpartidagasto> lpartgasto = new List<tpptpartidagasto>();
            List<tppthistorialpartidagasto> lhistorialpg = new List<tppthistorialpartidagasto>();

            if (rqmantenimiento.Mdatos.ContainsKey("certificar")) {
                foreach (tpptcompromisodetalle obj in ldetalle) {
                    partgasto = new tpptpartidagasto();
                    partgasto = TpptPartidaGastoDal.Find(obj.cpartidagasto, Fecha.GetAnio(rqmantenimiento.Fconatable));
                    partgasto.vcomprometido += obj.valor;
                    //partgasto.vsaldoporcomprometer = partgasto.vcodificado - partgasto.vcomprometido;
                    partgasto.vsaldopordevengar = partgasto.vcodificado - partgasto.vcomprometido;
                    lpartgasto.Add(partgasto);

                    TpptPartidaGastoHistoriaDal.CreaHistoria(partgasto, rqmantenimiento.Fconatable);

                    tppthistorialpartidagasto hpg = TpptHistorialPartidaGastoDal.Crear(partgasto, obj.ccompromiso, null, null,null,null,
                        ConstantesPresupuesto.CONCEPTO_CERTIFICACION_PRESUPUESTARIA, infoadicional, rqmantenimiento, obj.valor, obj.valor);
                    lhistorialpg.Add(hpg);
                    lpartgasto.Add(partgasto);
                }
                rqmantenimiento.AdicionarTabla("tppthistorialpartidagasto", lhistorialpg, false);
                rqmantenimiento.AdicionarTabla("tpptpartidagasto", lpartgasto, false);
            }
           
        }

    }
}
