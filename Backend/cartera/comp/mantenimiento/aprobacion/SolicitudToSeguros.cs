using core.componente;
using dal.cartera;
using dal.seguros;
using modelo;
using System.Collections.Generic;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.aprobacion {

    /// <summary>
    /// Clase que pasa los datos a seguros.
    /// </summary>
    public class SolicitudToSeguros : ComponenteMantenimiento {

        /// <summary>
        /// Transforma las garantias asociadas a la operacion a seguros.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            IList<tcarsolicitudseguros> lsolicitudseguros = TcarSolicitudSegurosDal.Find(long.Parse(rqmantenimiento.Mdatos["csolicitud"].ToString()));

            // Lista de garantias por operacion para seguros
            List<tsgsseguro> lseguros = TsgsSeguroDal.ToTsgsSeguro(lsolicitudseguros, rqmantenimiento);
            if (lseguros.Count <= 0) {
                return;
            }

            // Adiciona datos a Tabla para que haga el commit de los objetos al final.
            rqmantenimiento.AdicionarTabla(typeof(tsgsseguro).Name.ToUpper(), lseguros, false);
        }
    }
}
