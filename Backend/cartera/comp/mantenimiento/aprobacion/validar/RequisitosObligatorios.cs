using cartera.datos;
using core.componente;
using core.servicios;
using dal.cartera;
using dal.contabilidad;
using dal.persona;
using dal.socio;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.aprobacion.validar
{
    /// <summary>
    /// Clase que se encarga de ejecutar validaciones de requisitos obligatorios de la solicitud.
    /// </summary>
    public class RequisitosObligatorios : ComponenteMantenimiento
    {
        /// <summary>
        /// Validación de requisitos
        /// </summary>
        /// <param name="RqMantenimiento">Request de Mantenimiento</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            long csolicitud = long.Parse(rqmantenimiento.Mdatos["csolicitud"].ToString());
            tcarsolicitud tcarsolicitud = TcarSolicitudDal.FindWithLock(csolicitud);

            List<tcarsolicitudrequisitos> lrequisitos = TcarSolicitudRequisitosDal.Find(csolicitud).ToList();

            foreach (tcarsolicitudrequisitos req in lrequisitos)
            {
                if ((!(bool)req.opcional) && (req.verificada == null || !(bool)req.verificada))
                {
                    throw new AtlasException("CAR-0039", "EXISTEN REQUISITOS OBLIGATORIOS NO VERIFICADOS");
                }
            }
        }

    }
}
