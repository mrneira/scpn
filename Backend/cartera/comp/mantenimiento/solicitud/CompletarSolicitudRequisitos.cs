using cartera.datos;
using core.componente;
using core.servicios;
using dal.cartera;
using dal.contabilidad;
using modelo;
using System.Collections.Generic;
using System.Linq;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.solicitud
{

    /// <summary>
    /// Clase que se encarga de completar datos del producto en la solicitud.
    /// </summary>
    public class CompletarSolicitudRequisitos : ComponenteMantenimiento
    {

        /// <summary>
        /// Completa informacion de los requisitos verificados.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {

            if (rqmantenimiento.GetTabla("SOLICITUDREQUISITOS") == null || rqmantenimiento.GetTabla("SOLICITUDREQUISITOS").Lregistros.Count() < 0)
            {
                return;
            }

            List<tcarsolicitudrequisitos> lrequisitos = rqmantenimiento.GetTabla("SOLICITUDREQUISITOS").Lregistros.Cast<tcarsolicitudrequisitos>().ToList();
            foreach (tcarsolicitudrequisitos req in lrequisitos)
            {
                req.cusuarioverifica = rqmantenimiento.Cusuario;
                req.freal = rqmantenimiento.Freal;
            }
        }
    }
}
