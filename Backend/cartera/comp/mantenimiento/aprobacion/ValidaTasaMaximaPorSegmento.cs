using core.componente;
using dal.cartera;
using modelo;
using System.Collections.Generic;
using System.Linq;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.aprobacion
{

    /// <summary>
    /// Clase que se encarga de validar que la tasa de operacion de cartera no sobrepase la tasa maxima legal definida para el segmento.
    /// </summary>
    public class ValidaTasaMaximaPorSegmento : ComponenteMantenimiento {
        /// <summary>
        /// Metodo para ejecutar 
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            long csolicitud = long.Parse(rqmantenimiento.Mdatos["csolicitud"].ToString());
            tcarsolicitud tcarsolicitud = TcarSolicitudDal.FindWithLock(csolicitud);
            List<tcaroperaciontasa> ltasas = null;
            string tablatasas = typeof(tcaroperaciontasa).Name.ToUpper();

            if (rqmantenimiento.GetTabla(tablatasas) != null) {
                ltasas = rqmantenimiento.GetTabla(tablatasas).Lregistros.Cast<tcaroperaciontasa>().ToList();
            }

            if (ltasas == null || ltasas.Count == 0) {
                ltasas = (List<tcaroperaciontasa>)TcarOperacionTasaDal.Find(rqmantenimiento.Coperacion);
            }
            foreach (tcaroperaciontasa obj in ltasas) {
                TcarSegmentoDal.ValidaTasaMaximaLegal(tcarsolicitud.csegmento, obj.tasaefectiva);
            }
        }

    }
}
