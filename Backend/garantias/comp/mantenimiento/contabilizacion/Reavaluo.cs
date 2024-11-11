using core.componente;
using dal.garantias;
using garantias.datos;
using garantias.monetario;
using modelo;
using monetario.util;
using monetario.util.rubro;
using util;
using util.dto.mantenimiento;

namespace garantias.comp.mantenimiento.contabilizacion {
    class Reavaluo : ComponenteMantenimiento {
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            // Variables
            decimal Total = 0;
            int rubro = 0;

            Operacion operacion = OperacionFachada.GetOperacion(rqmantenimiento);
            tgaroperacion tgaroperacion = operacion.getTgaroperacion();

            TgarOperacionHistoriaDal.CreaHistoria(tgaroperacion, rqmantenimiento.Mensaje, rqmantenimiento.Fconatable);
            tgaroperacion.fcontabilizacion = rqmantenimiento.Fconatable;
            if (!tgaroperacion.cestatus.Equals("VIG")) {
                throw new AtlasException("GAR-008", "PARA HACER UN REAVALUO, LA GARANTIA TIENE QUE ESTAR VIGENTE");
            }
            
            // Avaluo garantia
            tgaroperacionavaluo avalgar = TgarOperacionAvaluoDal.Find(tgaroperacion.coperacion);
            decimal Avaluo = (decimal)avalgar.valoravaluo;
            decimal Reavaluo = decimal.Parse(rqmantenimiento.Mdatos["valoravaluo"].ToString());

            decimal Subtotal = decimal.Subtract(Reavaluo, Avaluo);

            if (Subtotal == Constantes.CERO) {
                throw new AtlasException("GAR-009", "PARA HACER UN REAVALUO, LA GARANTIA TIENE QUE ESTAR VIGENTE");
            }

            if (Subtotal < 0) {
                Total = -1 * Subtotal;
                rubro = 3; // Incremento
            } else {
                Total = Subtotal;
                rubro = 1; // Decremento
            }

            rqmantenimiento.EncerarRubros();
            TransaccionRubro trubro = new TransaccionRubro(rqmantenimiento.Cmodulo, rqmantenimiento.Ctransaccion);
            RubroHelper.AdicionarRubro(rqmantenimiento, tgaroperacion, trubro, rubro, Total);

            // ejecuta monetario de gastos de liquidacion
            new ComprobanteMonetario(rqmantenimiento);
        }

    }
}

