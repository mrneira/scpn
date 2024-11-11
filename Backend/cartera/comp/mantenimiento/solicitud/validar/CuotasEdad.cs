using cartera.datos;
using core.componente;
using dal.cartera;
using dal.persona;
using modelo;
using System;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.solicitud.validar {
    /// <summary>
    /// Clase que se encarga de ejecutar validaciones de plazo en la solicitud.
    /// </summary>
    public class CuotasEdad : ComponenteMantenimiento {

        /// <summary>
        /// Validación de plazo de Solicitud
        /// </summary>
        /// <param name="RqMantenimiento">Request de Mantenimiento</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            Solicitud solicitud = SolicitudFachada.GetSolicitud();
            tcarsolicitud tcarsolicitud = solicitud.Tcarsolicitud;

            tpernatural persona = new tpernatural();
            persona = TperNaturalDal.Find((long)tcarsolicitud.cpersona, (int)rqmantenimiento.Ccompania);

            if (persona.fnacimiento != null) {
                DateTime fsistema = Fecha.GetFechaSistema();
                DateTime fnacimiento = persona.fnacimiento.Value;

                int meses = Math.Abs((fsistema.Month - fnacimiento.Month) + 12 * (fsistema.Year - fnacimiento.Year));
                int mesessolicitud = meses + (int)tcarsolicitud.numerocuotas;

                int plazoedad = (int)TcarParametrosDal.GetValorNumerico("PLAZO-EDAD", rqmantenimiento.Ccompania);

                if (Math.Abs(meses / 12) > plazoedad) {
                    throw new AtlasException("CAR-0067", "SOCIO TIENE {0} AÑOS DE EDAD Y SUPERA EL LÍMITE PERMITIDO", Math.Abs(meses / 12));
                }

                if (mesessolicitud > (plazoedad * 12)) {
                    int plazosugerido = (plazoedad * 12) - meses;
                    throw new AtlasException("CAR-0033", "SOLICITUD SUPERA EL PLAZO MÁXIMO DE {0} AÑOS <br> CUOTAS MÁXIMAS SUGERIDAS: {1} CUOTAS", plazoedad, plazosugerido);
                }
            }
        }

    }
}
