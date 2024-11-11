using core.componente;
using dal.seguros;
using modelo;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace seguros.comp.mantenimiento.poliza.validar {
    /// <summary>
    /// Clase que se encarga de ejecutar validaciones la poliza.
    /// </summary>
    public class DatosPoliza : ComponenteMantenimiento {
        /// <summary>
        /// Validacion de polizas de seguros
        /// </summary>
        /// <param name="RqMantenimiento">Request de Mantenimiento</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            // Subida de recibo de pago
            if (rqmantenimiento.GetTabla("GESTORDOCUMENTAL") != null) {
                return;
            }

            for (int i = 0; i < rqmantenimiento.GetTabla("POLIZA").Lregistros.Count; i++) //MNR 20240205
            {
                // Datos poliza
                tsgspoliza poliza = (tsgspoliza)rqmantenimiento.GetTabla("POLIZA").Lregistros.ElementAt(i);

                // Poliza vigente
                PolizaVigente(poliza, (int)poliza.finicio);

                // Numero de poliza
                // NumeroPoliza(poliza);
            }
        }

        /// <summary>
        /// Valida poliza vigente
        /// </summary>
        /// <param name="poliza">Registro de poliza.</param>
        /// <param name="finicio">Fecha de inicio de la nueva poliza</param>
        public static void PolizaVigente(tsgspoliza poliza, int finicio)
        {
            tsgspoliza polizavigente = TsgsPolizaDal.GetPolizaVigente(poliza.coperacioncartera, poliza.coperaciongarantia, finicio);
            if (polizavigente != null) {
                //throw new AtlasException("SGS-0001", "EXISTE UNA PÓLIZA VIGENTE CON FECHA VENCIMIENTO: {0}", Fecha.GetFechaPresentacionAnioMesDia((int)polizavigente.fvencimiento));
                throw new AtlasException("SGS-0001", "EXISTE UNA PÓLIZA VIGENTE CON FECHA VENCIMIENTO: {0}", "FACTURA " + poliza.numerofactura + " (" + Fecha.GetFechaPresentacionAnioMesDia((int)polizavigente.fvencimiento) + ")");
            }
        }

        /// <summary>
        /// Valida el numero de poliza
        /// </summary>
        /// <param name="poliza">Registro de poliza.</param>
        public static void NumeroPoliza(tsgspoliza poliza)
        {
            tsgspoliza pol = TsgsPolizaDal.FindNumeroPoliza(poliza.numeropoliza);
            if (pol != null) {
                throw new AtlasException("SGS-0002", "NÚMERO DE PÓLIZA YA EXISTE");
            }
        }

    }
}
