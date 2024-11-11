using garantias.contabilidad;
using garantias.datos;
using modelo;
using modelo.helper.cartera;
using util.dto.mantenimiento;
using util.movimiento;

namespace garantias.movimiento {

    /// <summary>
    /// Clase que se encarga de compeltar daros del movimiento con informacion de una operacion de cartera.
    /// </summary>
    public class MovimientoGarantias : MovimientoModulos {

        public void Completardatos(Movimiento movimiento, RqMantenimiento rqmantenimiento, RqRubro rqrubro) {
            tgaroperacion tgo = OperacionFachada.GetOperacion(rqmantenimiento).getTgaroperacion();

            tgarmovimiento tcm = (tgarmovimiento)movimiento;
            // Fija datos de la opracion de cartera.
            tcm.coperacion = tgo.coperacion;
		    tcm.csucursal = tgo.csucursal;
		    tcm.cagencia = tgo.cagencia;
		    tcm.ccompania = tgo.ccompania;
		    tcm.cestatus = tgo.cestatus;
		    tcm.cmoneda = tgo.cmoneda;
		    tcm.cmodulo = tgo.cmodulo;
		    tcm.cproducto = tgo.cproducto;
		    tcm.ctipoproducto = tgo.ctipoproducto;
		    tcm.cpersona = tgo.cpersona;

		    // Manejo del perfile contable de garantias.
		    Perfiles p = new Perfiles(tgo);
            tcm.ccuenta = p.RemplazaCodigoContable(tcm.ccuenta);
	    }

    }
}