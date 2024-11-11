using core.componente;
using dal.socio;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;

namespace socio.comp.mantenimiento.novedades {

    /// <summary>
    /// Clase que se encarga de generar historico de novedades.
    /// </summary>
    public class HistoricoNovedades : ComponenteMantenimiento {
        public override void Ejecutar(RqMantenimiento rm) {
            List<IBean> lmantenimiento = new List<IBean>();
            List<IBean> leliminados = new List<IBean>();
            // genera historico de novedades.
            if (rm.GetTabla("NOVEDADES") != null) {
                if (rm.GetTabla("NOVEDADES").Lregistros.Count > 0) {
                    lmantenimiento = rm.GetTabla("NOVEDADES").Lregistros;
                    this.generarHistoria(lmantenimiento, rm);
                }
                if (rm.GetTabla("NOVEDADES").Lregeliminar.Count > 0) {
                    leliminados = rm.GetTabla("NOVEDADES").Lregeliminar;
                    this.generarHistoriaEliminados(leliminados, rm);
                }
            }
        }

        /// <summary>
        /// Gnera registro de historico por cada mantenimiento.
        /// </summary>
        /// <param name="lmantenimiento">Lista de registros que se esta modificando</param>
        /// <param name="rm">Request con el que se ejecuta la transaccion.</param>
        private void generarHistoria(List<IBean> lmantenimiento, RqMantenimiento rm) {
            foreach (IBean obj in lmantenimiento) {
                tsocnovedadades n = (tsocnovedadades)obj;   
                if(n.fvigencia == null) {
                    n.fvigencia = rm.Fconatable;
                }
                if(n.GetDatos("BEANORIGINAL") != null) {
                    TsocNovedadadesHistoriaDal.CreaHistoria((tsocnovedadades)n.GetDatos("BEANORIGINAL"), rm.Fconatable);
                }                
            }
        }

        private void generarHistoriaEliminados(List<IBean> leliminados, RqMantenimiento rm) {
            foreach (IBean obj in leliminados) {
                tsocnovedadades n = (tsocnovedadades)obj;
                TsocNovedadadesHistoriaDal.CreaHistoria(n, rm.Fconatable);
            }
        }
    }
}
