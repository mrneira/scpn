using core.componente;
using dal.seguros;
using modelo;
using System.Collections.Generic;
using System.Linq;
using util.dto.mantenimiento;

namespace seguros.comp.mantenimiento.poliza {
    class PagoDirecto : ComponenteMantenimiento {

        /// <summary>
        /// Metodo que ejecuta el registro de seguro.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            // Subida de recibo de pago
            if (rqmantenimiento.GetTabla("GESTORDOCUMENTAL") != null) {
                return;
            }

            // Datos poliza
            tsgspoliza poliza = (tsgspoliza)rqmantenimiento.GetTabla("POLIZA").Lregistros.ElementAt(0);
            int secuencia = TsgsPolizaDal.GetSecuencia(poliza.coperacioncartera, poliza.coperaciongarantia);
            poliza.secuencia = secuencia;
            poliza.cusuarioing = rqmantenimiento.Cusuario;
            poliza.fingreso = rqmantenimiento.Fconatable;
            poliza.pagodirecto = true;
            poliza.ccatalogoestado = 600;
            poliza.cdetalleestado = "ING";

            // Datos seguro
            List<tsgsseguro> lseguro = new List<tsgsseguro>();
            tsgsseguro seguro = TsgsSeguroDal.Find(poliza.coperacioncartera, poliza.coperaciongarantia);
            seguro.Actualizar = true;
            seguro.secuenciapoliza = secuencia;
            lseguro.Add(seguro);
            rqmantenimiento.AdicionarTabla(typeof(tsgsseguro).Name.ToUpper(), lseguro, false);
        }

    }
}
