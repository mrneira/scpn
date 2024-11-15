using cartera.enums;
using core.componente;
using dal.cartera;
using modelo;
using System;
using System.Collections.Generic;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.aprobacion {

    /// <summary>
    /// Clase que pasa los datos seguros fijos que se cobran en cuota de una solicitud a una operacion de cartera.
    /// </summary>
    public class SolicitudToOperacionCargosTabla : ComponenteMantenimiento {
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            List<tcarsolicitudcargostabla> lcargostabla = TcarSolicitudCargosTablaDal.Find(long.Parse(rqmantenimiento.Mdatos["csolicitud"].ToString()));

            // Transforma cargos tabla de solicitud a la operacion.
            List<tcaroperacioncargostabla> lcargos = TcarSolicitudCargosTablaDal.ToTcarOperacionCargosTabla(lcargostabla,
                    rqmantenimiento.Coperacion);
            if (lcargos.Count <= 0) {
                return;
            }
            //AGREGAR LOS CARGOS SI LA OPERACIÓN ES UNA NEGOCIACIÓN DE PQAGOS
            tcarsolicitud sol = TcarSolicitudDal.Find(long.Parse(rqmantenimiento.Mdatos["csolicitud"].ToString()));
            if (!sol.cestadooperacion.Equals(EnumEstadoOperacion.ORIGINAL.CestadoOperacion))
            {
                Dictionary<String, Decimal> mcargos = new Dictionary<string, decimal>();
                foreach (tcaroperacioncargostabla cargo in lcargos)
                {
                    mcargos[cargo.csaldo] = (decimal)cargo.monto;
                }
                rqmantenimiento.AddDatos("MSALDOS-ARREGLO-PAGOS-TABLA", mcargos);
            }
            // Adiciona datos a Tabla para que haga el commit de los objetos al final.
            rqmantenimiento.AdicionarTabla(typeof(tcaroperacioncargostabla).Name.ToUpper(), lcargos, false);
        }
    }
}