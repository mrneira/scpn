using core.componente;
using dal.garantias;
using garantias.datos;
using garantias.monetario;
using modelo;
using monetario.util;
using monetario.util.rubro;
using util.dto.mantenimiento;

namespace garantias.comp.mantenimiento.contabilizacion {

    /// <summary>
    /// Clase que se encarga de contabilizar la aceptacion de una garantia.
    /// </summary>
    public class Aceptacion : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            Operacion operacion = OperacionFachada.GetOperacion(rqmantenimiento);
            tgaroperacion tgaroperacion = operacion.getTgaroperacion();
            tgaroperacionavaluo avalgar = TgarOperacionAvaluoDal.Find(tgaroperacion.coperacion);

            TgarOperacionHistoriaDal.CreaHistoria(tgaroperacion, rqmantenimiento.Mensaje, rqmantenimiento.Fconatable);
            tgaroperacion.fcontabilizacion = rqmantenimiento.Fconatable;
            tgaroperacion.cestatus = "VIG";
            tgaroperacion.cusuarioapertura = rqmantenimiento.Cusuario;

            rqmantenimiento.EncerarRubros();
            // MONTO CON EL QUE SE CONTABILIZA LA GARANTIA.
            rqmantenimiento.Monto = avalgar.valoravaluo ?? 0;

            TransaccionRubro trubro = new TransaccionRubro(rqmantenimiento.Cmodulo, rqmantenimiento.Ctransaccion);

            RubroHelper.AdicionarRubro(rqmantenimiento, tgaroperacion, trubro, 1, rqmantenimiento.Monto);

            // ejecuta monetario de gastos de liquidacion
            new ComprobanteMonetario(rqmantenimiento);
        }

    }
}
