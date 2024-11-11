using core.componente;
using dal.contabilidad.flujoefectivo;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;

namespace contabilidad.comp.mantenimiento.flujoejectivo {

    /// <summary>
    /// Clase que se encarga de realizar el recalculo del flujo de efectivo.
    /// </summary>
    public class AjustesFlujoEfectivo : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            int anioinicio = int.Parse(rqmantenimiento.Mdatos["anioinicio"].ToString());
            int aniofin = int.Parse(rqmantenimiento.Mdatos["aniofin"].ToString());
            string tipoplancdetalle = rqmantenimiento.Mdatos["tipoplancdetalle"].ToString();
            List<IBean> lmantenimiento = new List<IBean>();
            if (rqmantenimiento.GetTabla("AJUSTES") != null) {
                if (rqmantenimiento.GetTabla("AJUSTES").Lregistros.Count > 0) {
                    lmantenimiento = rqmantenimiento.GetTabla("AJUSTES").Lregistros;
                }
            }
            List<tconflujoefectivo> lista = TconFlujoEfectivoDal.Find(aniofin, anioinicio, tipoplancdetalle);
            List<IBean> lbase = lista.ToList<IBean>();
            List<IBean> ldetalle = DtoUtil.GetMergedList(lbase, lmantenimiento, null);

            // Actualiza saldos de los registros modificados en pantalla.
            foreach (modelo.interfaces.IBean o in ldetalle) {
                tconflujoefectivo obj = (tconflujoefectivo)o;
                TconFlujoEfectivoDal.ActualizarSaldos(obj);
            }
            if (rqmantenimiento.GetTabla("AJUSTES") == null) {
                rqmantenimiento.AdicionarTabla("AJUSTES", ldetalle, 0, null);
            } else {
                Tabla t = rqmantenimiento.Mtablas["AJUSTES"];
                t.Lregistros = ldetalle;
            }
        }
    }
}
