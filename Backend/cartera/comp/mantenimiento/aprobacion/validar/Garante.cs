using core.componente;
using dal.cartera;
using modelo;
using socio.datos;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.aprobacion.validar {
    /// <summary>
    /// Clase que se encarga de ejecutar validaciones del garante.
    /// </summary>
    public class Garante : ComponenteMantenimiento {

        /// <summary>
        /// Validación de garante
        /// </summary>
        /// <param name="RqMantenimiento">Request de Mantenimiento</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            long csolicitud = long.Parse(rqmantenimiento.Mdatos["csolicitud"].ToString());
            tcarsolicitud tcarsolicitud = TcarSolicitudDal.FindWithLock(csolicitud);

            tcarproducto producto = TcarProductoDal.Find((int)tcarsolicitud.cmodulo, (int)tcarsolicitud.cproducto, (int)tcarsolicitud.ctipoproducto);

            if ((producto.requieregarante != null) && ((bool)producto.requieregarante)) {
                ExisteGarante(tcarsolicitud, rqmantenimiento);
            }
        }

        /// <summary>
        /// Valida existencia de garante.
        /// </summary>
        /// <param name="solicitud">Instancia de solicitud.</param>
        /// <param name="rqmantenimiento">Request de Mantenimiento.</param>
        public static void ExisteGarante(tcarsolicitud solicitud, RqMantenimiento rqmantenimiento)
        {
            Socios socio = new Socios((long)solicitud.cpersona, rqmantenimiento);
            bool requieregarante = (socio.GetTservicioArray()[0] >= 20) ? false : true;

            if (requieregarante) {
                IList<Dictionary<string, object>> lgarantes = TcarSolicitudPersonaDal.FindGarantesBySolicitud(solicitud.csolicitud, rqmantenimiento.Ccompania).ToList();
                if (lgarantes.Count < 1) {
                    throw new AtlasException("CAR-0038", "SOLICITUD REQUIERE EL INGRESO DE GARANTE");
                }
            }
        }
    }
}
