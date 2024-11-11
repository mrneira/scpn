using cartera.datos;
using core.componente;
using core.servicios.mantenimiento;
using dal.cartera;
using modelo;
using System.Collections.Generic;
using util.dto.mantenimiento;

namespace garantias.comp.mantenimiento.contabilizacion {

    /// <summary>
    /// Clase que se encarga de contabilizar todas las garantias asociadas a un prestamo al realizar el desembolso.
    /// La transaccion que tiene todo parametrizado para contabilidar una garantia especifica es la (9-3), por lo que 
    /// esta clase de negocio invoca a la transaccion de contabilizacion (9-3) por cada garantia.
    /// Todo este proceso se realiza en una sola transaccion junto con el desembolso, por lo que al realizar el reverso del 
    /// desembolso de prestamo se realiza automaticamente el desemboso de los todos los movimientos generados por este componente
    /// </summary>
    public class ContabilizaDesembolsoPrestamo : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            //Operacion de cartera
            Operacion operacion = OperacionFachada.GetOperacion(rqmantenimiento);

            List<tcaroperaciongarantias> lgarantiascar = TcarOperacionGarantiasDal.Find(operacion.Tcaroperacion.coperacion);
            if (lgarantiascar == null || lgarantiascar.Count<=0) {
                return;
            }
            RqMantenimiento rqmantenimientogar = (RqMantenimiento)rqmantenimiento.Clone();
            foreach (tcaroperaciongarantias gacar in lgarantiascar) {
                // Contabiliza por garantia
                rqmantenimientogar.Coperacion = gacar.coperaciongarantia;
                Mantenimiento.ProcesarAnidado(rqmantenimientogar, 9, 3);
            }
        }

    }
}
