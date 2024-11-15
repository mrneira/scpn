using cartera.enums;
using core.componente;
using dal.cartera;
using modelo;
using System.Collections.Generic;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.aprobacion {

    /// <summary>
    /// Clase que pasa los datos del desembolso de una solicitud de credito a los desembolsos de operacion de cartera.
    /// </summary>
    public class SolicitudToOperacionDesembolso : ComponenteMantenimiento {

        /// <summary>
        /// Transforma datos de desembolso de solicitud a datos de desembolso de operacion.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            tcarsolicitud sol = TcarSolicitudDal.Find(long.Parse(rqmantenimiento.Mdatos["csolicitud"].ToString()));
            if (!sol.cestadooperacion.Equals(EnumEstadoOperacion.ORIGINAL.CestadoOperacion))
            {
                return;
            }

            IList<tcarsolicituddesembolso> lsoldesembolso = TcarSolicitudDesembolsoDal.Find(long.Parse(rqmantenimiento.Mdatos["csolicitud"].ToString()));

            // Transforma a desembolso de la operacion.
            List<tcaroperaciondesembolso> ldesembolso = TcarSolicitudDesembolsoDal.ToTcarOperacionDesembolso(lsoldesembolso, rqmantenimiento.Coperacion,rqmantenimiento.Ccompania);

            if (ldesembolso.Count <= 0) {
                return;
            }

            // Adiciona datos a Tabla para que haga el commit de los objetos al final.
            rqmantenimiento.AdicionarTabla(typeof(tcaroperaciondesembolso).Name.ToUpper(), ldesembolso, false);
        }

    }
}
