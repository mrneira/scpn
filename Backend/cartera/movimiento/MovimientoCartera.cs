using cartera.contabilidad;
using cartera.datos;
using dal.cartera;
using modelo;
using modelo.helper.cartera;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;
using util.movimiento;

namespace cartera.movimiento {

    /// <summary>
    /// Clase que se encarga de compeltar daros del movimiento con informacion de una operacion de cartera.
    /// </summary>
    public class MovimientoCartera : MovimientoModulos {

        public void Completardatos(Movimiento movimiento, RqMantenimiento rqmantenimiento, RqRubro rqrubro)
        {
            tcarmovimiento tcm = (tcarmovimiento)movimiento;
            if (rqmantenimiento.Coperacion != null) {
                tcaroperacion tco = OperacionFachada.GetOperacion(rqmantenimiento).Tcaroperacion;
                // Fija datos de la opracion de cartera.
                tcm.coperacion = tco.coperacion;
                tcm.csucursal = tco.csucursal;
                tcm.cagencia = tco.cagencia;
                tcm.ccompania = tco.ccompania;
                // por default va ek estatus del rubro si es null va el de la operacion
                tcm.cestatus = rqrubro.Cestatus;
                if (tcm.cestatus == null) {
                    tcm.cestatus = tco.cestatus;
                }
                tcm.cmoneda = tco.cmoneda;
                tcm.cmodulo = tco.cmodulo;
                tcm.cproducto = tco.cproducto;
                tcm.ctipoproducto = tco.ctipoproducto;
                tcm.cpersona = tco.cpersona;
                tcm.documento = rqmantenimiento.Documento;
                tcm.tipocredito = tco.ctipocredito;

                // Manejo de perfiles de codigo contable para rubros que no sean de capital de las cuotas.
                Perfiles.SetCodigoContable(tco, tcm);
            }

            // Completa datos Modulo / Producto / Tipo Producto
            if (tcm.cmodulo == null && rqmantenimiento.Mdatos.ContainsKey("cmodulo")) {
                tcm.cmodulo = 0; //rqmantenimiento.GetInt("cmodulo");
            }
            if (tcm.cproducto == null && rqmantenimiento.Mdatos.ContainsKey("cproducto")) {
                tcm.cproducto = 0; // rqmantenimiento.GetInt("cproducto");
            }
            if (tcm.ctipoproducto == null && rqmantenimiento.Mdatos.ContainsKey("ctipoproducto")) {
                tcm.ctipoproducto = 0; // rqmantenimiento.GetInt("ctipoproducto");
            }

            tcm.numcuota = rqrubro.Cuota;
            // Marca si el movimiento actualiza o no saldos del rubro de una cuota.
            tcm.actualizasaldo = true;
            if (!rqrubro.Actualizasaldo) {
                tcm.actualizasaldo = false;
            }

        }

    }
}
